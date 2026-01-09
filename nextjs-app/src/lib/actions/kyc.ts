'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import {
    sendKycApprovedEmail,
    sendProfileCompleteEmail
} from '@/lib/email';

// Schema de validación para documentos KYC
const KycDocumentSchema = z.object({
    documentType: z.enum(['DNI', 'NIE', 'PASSPORT', 'DRIVERS_LICENSE']),
    documentNumber: z.string().min(5, 'Número de documento inválido').optional().nullable(),
    frontImageUrl: z.string().url('URL inválida').optional().nullable(),
    backImageUrl: z.string().url('URL inválida').optional().nullable(),
    proofOfResidenceUrl: z.string().url('URL inválida').optional().nullable(),
});

export type KycState = {
    errors?: {
        documentType?: string[];
        documentNumber?: string[];
        frontImageUrl?: string[];
        backImageUrl?: string[];
        proofOfResidenceUrl?: string[];
        _form?: string[];
    };
    success?: boolean;
    documentId?: string;
};

// Crear o actualizar documento KYC
export async function submitKycDocument(
    prevState: KycState,
    formData: FormData
): Promise<KycState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            errors: {
                _form: ['Debes iniciar sesión para enviar documentos'],
            },
        };
    }

    const validatedFields = KycDocumentSchema.safeParse({
        documentType: formData.get('documentType'),
        documentNumber: formData.get('documentNumber'),
        frontImageUrl: formData.get('frontImageUrl'),
        backImageUrl: formData.get('backImageUrl'),
        proofOfResidenceUrl: formData.get('proofOfResidenceUrl'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // Buscar documento existente del usuario
        const existingDoc = await prisma.kycDocument.findFirst({
            where: { userId: session.user.id },
        });

        const documentData = {
            ...validatedFields.data,
            status: 'SUBMITTED' as const,
            submittedAt: new Date(),
        };

        let document;

        if (existingDoc) {
            // Actualizar documento existente
            document = await prisma.kycDocument.update({
                where: { id: existingDoc.id },
                data: documentData,
            });
        } else {
            // Crear nuevo documento
            document = await prisma.kycDocument.create({
                data: {
                    ...documentData,
                    userId: session.user.id,
                },
            });
        }

        // Obtener datos del usuario para emails
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { email: true, firstName: true },
        });

        // Enviar email de confirmación de KYC aprobado (no bloqueante)
        // Con auto-aprobación en MVP, enviamos directamente el email de éxito
        if (user?.email && user?.firstName) {
            try {
                // Email de KYC Aprobado que incluye CTA para completar perfil de inversor
                await sendKycApprovedEmail(user.email, user.firstName);
            } catch (emailError) {
                console.error('Error enviando email KYC approved (no crítico):', emailError);
            }
        }

        // AUTO-APROBACIÓN PARA MVP: Aprobar automáticamente todos los KYC
        // TODO: Implementar revisión manual cuando se tenga más volumen
        await prisma.kycDocument.update({
            where: { id: document.id },
            data: {
                status: 'APPROVED',
                reviewedAt: new Date(),
                reviewedBy: 'AUTO_APPROVED_MVP',
            },
        });

        // Actualizar estado del usuario a ACTIVE
        await prisma.user.update({
            where: { id: session.user.id },
            data: { status: 'ACTIVE' },
        });

        revalidatePath('/kyc-upload');
        revalidatePath('/dashboard');

        return {
            success: true,
            documentId: document.id,
        };
    } catch (error) {
        console.error('Error al enviar KYC:', error);
        return {
            errors: {
                _form: ['Error al procesar los documentos. Intenta de nuevo.'],
            },
        };
    }
}

// Obtener estado del KYC del usuario actual
export async function getKycStatus() {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            kycDocuments: {
                orderBy: { submittedAt: 'desc' },
                take: 1,
            },
        },
    });

    if (!user) return null;

    return {
        userStatus: user.status,
        kycDocument: user.kycDocuments[0] || null,
    };
}

// Schema para el perfil de inversor
const InvestorProfileSchema = z.object({
    investmentGoal: z.string(),
    investmentHorizon: z.string(),
    riskTolerance: z.string(),
    initialInvestment: z.string(),
    preferredProjectTypes: z.array(z.string()).optional(),
});

export type InvestorProfileState = {
    errors?: {
        investmentGoal?: string[];
        investmentHorizon?: string[];
        riskTolerance?: string[];
        initialInvestment?: string[];
        _form?: string[];
    };
    success?: boolean;
    profileType?: string;
};

// Guardar perfil de inversor
export async function saveInvestorProfile(
    prevState: InvestorProfileState,
    formData: FormData
): Promise<InvestorProfileState> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            errors: {
                _form: ['Debes iniciar sesión'],
            },
        };
    }

    const validatedFields = InvestorProfileSchema.safeParse({
        investmentGoal: formData.get('investmentGoal'),
        investmentHorizon: formData.get('investmentHorizon'),
        riskTolerance: formData.get('riskTolerance'),
        initialInvestment: formData.get('initialInvestment'),
        preferredProjectTypes: formData.getAll('preferredProjectTypes'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // Calcular perfil basado en respuestas
        const profileType = calculateProfileType(validatedFields.data.riskTolerance);

        // Crear o actualizar perfil
        await prisma.investorProfile.upsert({
            where: { userId: session.user.id },
            update: {
                ...validatedFields.data,
                profileType,
            },
            create: {
                userId: session.user.id,
                ...validatedFields.data,
                profileType,
            },
        });

        // Obtener datos del usuario para enviar email de felicitaciones
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { email: true, firstName: true },
        });

        // Enviar email de felicitaciones (no bloqueante)
        if (user?.email && user?.firstName) {
            try {
                await sendProfileCompleteEmail(user.email, user.firstName, profileType);
            } catch (emailError) {
                console.error('Error enviando email profile complete (no crítico):', emailError);
            }
        }

        revalidatePath('/investor-profile');
        revalidatePath('/dashboard');

        return { success: true, profileType };
    } catch (error) {
        console.error('Error al guardar perfil:', error);
        return {
            errors: {
                _form: ['Error al guardar el perfil. Intenta de nuevo.'],
            },
        };
    }
}

// Función helper para calcular el tipo de perfil
function calculateProfileType(riskTolerance: string): 'VERY_CONSERVATIVE' | 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' {
    switch (riskTolerance) {
        case 'very_conservative':
            return 'VERY_CONSERVATIVE';
        case 'conservative':
            return 'CONSERVATIVE';
        case 'aggressive':
            return 'AGGRESSIVE';
        default:
            return 'MODERATE';
    }
}
