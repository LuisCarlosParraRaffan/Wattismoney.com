import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = (auth?.user as { role?: string })?.role;

            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') ||
                nextUrl.pathname.startsWith('/cartera') ||
                nextUrl.pathname.startsWith('/mercado-primario') ||
                nextUrl.pathname.startsWith('/mi-impacto') ||
                nextUrl.pathname.startsWith('/perfil') ||
                nextUrl.pathname.startsWith('/ajustes') ||
                nextUrl.pathname.startsWith('/ayuda');

            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            const isOnAuth = nextUrl.pathname.startsWith('/login') ||
                nextUrl.pathname.startsWith('/signup');

            // Admin routes - require ADMIN or SUPER_ADMIN role
            if (isOnAdmin) {
                if (!isLoggedIn) return false;
                if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
                    // Redirect non-admins to dashboard
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                return true;
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && isOnAuth) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },
    providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;

