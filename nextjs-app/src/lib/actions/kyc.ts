'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { sendKycSubmittedEmail, sendProfileInvitationEmail, sendProfileCompleteEmail } from '@/lib/email';

// Schema de validación para documentos KYC
const KycDocumentSchema = z.object({
    documentType: z.enum(['DNI', 'NIE', 'PASSPORT', 'DRIVERS_LICENSE']),
    documentNumber: z.string().min(5, 'Número de documento inválido').optional(),
    frontImageUrl: z.string().url('URL inválida').optional(),
    backImageUrl: z.string().url('URL inválida').optional(),
    proofOfResidenceUrl: z.string().url('URL inválida').optional(),
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

        // Enviar email de confirmación de documentos recibidos
        if (user?.email && user?.firstName) {
            await sendKycSubmittedEmail(user.email, user.firstName);
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

        // Actualizar estado del usuario a PENDING_INVESTOR_PROFILE
        // (necesitamos añadir este estado al enum o usar ACTIVE temporalmente)
        await prisma.user.update({
            where: { id: session.user.id },
            data: { status: 'ACTIVE' }, // Usuario activo, pero middleware verificará perfil de inversor
        });

        // Enviar email de invitación para completar perfil de inversor
        if (user?.email && user?.firstName) {
            await sendProfileInvitationEmail(user.email, user.firstName);
        }

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

        // Enviar email de felicitaciones
        if (user?.email && user?.firstName) {
            await sendProfileCompleteEmail(user.email, user.firstName, profileType);
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
