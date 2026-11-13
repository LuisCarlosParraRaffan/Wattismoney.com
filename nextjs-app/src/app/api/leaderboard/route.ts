import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        const currentUserId = session?.user?.id || null;

        const users = await prisma.user.findMany({
            where: {
                role: 'INVESTOR',
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
                points: true,
                level: true,
                levelName: true,
                investments: {
                    where: { status: 'CONFIRMED' },
                    select: { amount: true },
                },
                badges: {
                    include: {
                        badge: {
                            select: {
                                id: true,
                                name: true,
                                icon: true,
                                color: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ points: 'desc' }, { createdAt: 'asc' }],
            take: 50,
        });

        const leaderboard = users.map((u, idx) => {
            const totalInvested = u.investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
            const displayName =
                [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email.split('@')[0];

            return {
                rank: idx + 1,
                id: u.id,
                name: displayName,
                avatarUrl: u.avatarUrl,
                points: u.points || 0,
                level: u.levelName || 'Enchufado',
                totalInvested,
                contractsCount: u.investments.length,
                badges: u.badges.map((ub) => ub.badge),
                isCurrentUser: u.id === currentUserId,
            };
        });

        const currentUserEntry = leaderboard.find((item) => item.isCurrentUser) || null;

        return NextResponse.json({
            leaderboard,
            currentUser: currentUserEntry,
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        return NextResponse.json({ error: 'Error al cargar clasificación' }, { status: 500 });
    }
}
