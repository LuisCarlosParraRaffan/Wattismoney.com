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

        // Get user's KYC document status
        const kycDocument = await prisma.kycDocument.findFirst({
            where: { userId: session.user.id },
            orderBy: { submittedAt: 'desc' },
            select: {
                id: true,
                status: true,
                submittedAt: true,
            }
        });

        // Also check if user has completed the investor quiz
        const investorProfile = await prisma.investorProfile.findUnique({
            where: { userId: session.user.id },
            select: {
                id: true,
                aiRiskProfile: true,
                quizCompletedAt: true,
            }
        });

        return NextResponse.json({
            kycStatus: kycDocument?.status || 'PENDING',
            kycSubmittedAt: kycDocument?.submittedAt || null,
            hasCompletedQuiz: !!investorProfile?.quizCompletedAt,
            investorProfile: investorProfile?.aiRiskProfile || null,
        });

    } catch (error) {
        console.error('Error getting KYC status:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
