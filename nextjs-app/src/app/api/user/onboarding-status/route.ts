import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                kycDocuments: {
                    where: {
                        status: { in: ['SUBMITTED', 'APPROVED', 'IN_REVIEW'] }
                    },
                    take: 1,
                },
                investorProfile: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            userStatus: user.status,
            hasKyc: user.kycDocuments.length > 0,
            hasInvestorProfile: !!user.investorProfile,
            kycStatus: user.kycDocuments[0]?.status || null,
            profileType: user.investorProfile?.profileType || null,
        });
    } catch (error) {
        console.error('Error checking onboarding status:', error);
        return NextResponse.json(
            { error: 'Error interno' },
            { status: 500 }
        );
    }
}
