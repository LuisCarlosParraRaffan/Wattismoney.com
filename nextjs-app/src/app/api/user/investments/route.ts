import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/user/investments - Get current user's investments
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const investments = await prisma.investment.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                contract: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        energyType: true,
                        annualReturn: true,
                        generatorLocation: true,
                    },
                },
                listing: {
                    select: {
                        id: true,
                        status: true,
                        askingPrice: true,
                    },
                },
            },
        });

        return NextResponse.json({ investments });
    } catch (error) {
        console.error('Error fetching investments:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
