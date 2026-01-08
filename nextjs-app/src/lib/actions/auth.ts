'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { sendWelcomeEmail } from '@/lib/email';

// Schema de validación para registro
const SignupSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
});

export type SignupState = {
    errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
        acceptTerms?: string[];
        _form?: string[];
    };
    success?: boolean;
};

export async function signupAction(
    prevState: SignupState,
    formData: FormData
): Promise<SignupState> {
    // Validar datos del formulario
    const validatedFields = SignupSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        acceptTerms: formData.get('acceptTerms') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { firstName, lastName, email, password } = validatedFields.data;

    try {
        // Verificar si el email ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                errors: {
                    email: ['Este email ya está registrado'],
                },
            };
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 12);

        // Crear usuario
        await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                passwordHash,
                status: 'PENDING_EMAIL_VERIFICATION',
            },
        });

        // Enviar email de bienvenida
        await sendWelcomeEmail(email, firstName);

        return { success: true };
    } catch (error) {
        console.error('Error en registro:', error);
        return {
            errors: {
                _form: ['Ocurrió un error al crear la cuenta. Intenta de nuevo.'],
            },
        };
    }
}

// Schema de validación para login
const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginState = {
    errors?: {
        email?: string[];
        password?: string[];
        _form?: string[];
    };
    success?: boolean;
};

export async function loginAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const validatedFields = LoginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await signIn('credentials', {
            email: validatedFields.data.email,
            password: validatedFields.data.password,
            redirect: false,
        });

        return { success: true };
    } catch (error) {
        console.error('Error en login:', error);
        return {
            errors: {
                _form: ['Credenciales inválidas'],
            },
        };
    }
}

// Logout action
export async function logoutAction() {
    redirect('/api/auth/signout');
}
