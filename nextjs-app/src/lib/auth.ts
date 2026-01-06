import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        // Google OAuth Provider
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        // Credentials Provider (Email/Password)
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email y contraseña son requeridos");
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                // Buscar usuario en la base de datos
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.passwordHash) {
                    // Retornar null en lugar de error evita fugas de información
                    return null;
                }

                // Verificar contraseña
                const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

                if (!isPasswordValid) {
                    return null;
                }

                // Actualizar último login (async - no bloqueante)
                try {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { lastLoginAt: new Date() },
                    });
                } catch (error) {
                    console.error("Error updating last login:", error);
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
                };
            },
        }),
    ],
    events: {
        async createUser({ user }) {
            // Cuando se crea un usuario nuevo (ej: via Google OAuth)
            if (user.id) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { status: "PENDING_KYC" },
                });
            }
        },
    },
});
