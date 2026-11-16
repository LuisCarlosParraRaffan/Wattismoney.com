import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type ActiveInvestor = { id: string; email: string; firstName: string | null };

export type InvestorGuardResult =
    | { ok: true; user: ActiveInvestor }
    | { ok: false; response: NextResponse };

/**
 * Control de acceso en servidor para cualquier operación con dinero:
 * sesión válida + cuenta ACTIVE + al menos un KYC APROBADO por un administrador.
 */
export async function requireActiveInvestor(): Promise<InvestorGuardResult> {
    const session = await auth();
    if (!session?.user?.id) {
        return { ok: false, response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            firstName: true,
            status: true,
            kycDocuments: { where: { status: 'APPROVED' }, select: { id: true }, take: 1 },
        },
    });

    if (!user) {
        return { ok: false, response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) };
    }

    if (user.status !== 'ACTIVE' || user.kycDocuments.length === 0) {
        return {
            ok: false,
            response: NextResponse.json(
                {
                    error: 'Tu verificación de identidad (KYC) debe estar aprobada antes de invertir.',
                    code: 'KYC_REQUIRED',
                },
                { status: 403 }
            ),
        };
    }

    return { ok: true, user: { id: user.id, email: user.email, firstName: user.firstName } };
}

/** Respuesta estándar para funcionalidades apagadas en lib/features.ts */
export function featureDisabled(label: string) {
    return NextResponse.json(
        { error: `${label} aún no está disponible en la plataforma.`, code: 'FEATURE_DISABLED' },
        { status: 503 }
    );
}
