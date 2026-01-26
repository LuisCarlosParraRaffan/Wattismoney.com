import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/admin/users/[id]/badges - Get user's badges
export async function GET(request: Request, { params }: RouteParams) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id: userId } = await params;

    try {
        const userBadges = await prisma.userBadge.findMany({
            where: { userId },
            include: {
                badge: true,
            },
            orderBy: { awardedAt: 'desc' },
        });

        // Also get all available badges for assignment dropdown
        const allBadges = await prisma.badge.findMany({
            orderBy: { name: 'asc' },
        });

        const assignedBadgeIds = userBadges.map(ub => ub.badgeId);
        const availableBadges = allBadges.filter(b => !assignedBadgeIds.includes(b.id));

        return NextResponse.json({
            userBadges,
            availableBadges,
        });
    } catch (err) {
        console.error('Error fetching user badges:', err);
        return NextResponse.json(
            { error: 'Error al obtener insignias del usuario' },
            { status: 500 }
        );
    }
}

// POST /api/admin/users/[id]/badges - Assign badge to user
export async function POST(request: Request, { params }: RouteParams) {
    const { error, session } = await checkAdminAccess();
    if (error) return error;

    const { id: userId } = await params;

    try {
        const body = await request.json();
        const { badgeId } = body;

        if (!badgeId) {
            return NextResponse.json(
                { error: 'badgeId es requerido' },
                { status: 400 }
            );
        }

        // Check if badge exists
        const badge = await prisma.badge.findUnique({
            where: { id: badgeId },
        });

        if (!badge) {
            return NextResponse.json(
                { error: 'Insignia no encontrada' },
                { status: 404 }
            );
        }

        // Check if user already has this badge
        const existing = await prisma.userBadge.findUnique({
            where: {
                userId_badgeId: { userId, badgeId },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'El usuario ya tiene esta insignia' },
                { status: 400 }
            );
        }

        // Assign badge and add points
        const [userBadge] = await prisma.$transaction([
            prisma.userBadge.create({
                data: {
                    userId,
                    badgeId,
                    awardedBy: session?.user?.id,
                },
                include: {
                    badge: true,
                },
            }),
            // Add badge points to user
            prisma.user.update({
                where: { id: userId },
                data: {
                    points: {
                        increment: badge.pointsValue,
                    },
                },
            }),
        ]);

        return NextResponse.json({
            message: `Insignia "${badge.name}" asignada correctamente (+${badge.pointsValue} XP)`,
            userBadge,
        });
    } catch (err) {
        console.error('Error assigning badge:', err);
        return NextResponse.json(
            { error: 'Error al asignar insignia' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/users/[id]/badges - Remove badge from user
export async function DELETE(request: Request, { params }: RouteParams) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id: userId } = await params;

    try {
        const { searchParams } = new URL(request.url);
        const badgeId = searchParams.get('badgeId');

        if (!badgeId) {
            return NextResponse.json(
                { error: 'badgeId es requerido' },
                { status: 400 }
            );
        }

        // Get badge to know points to deduct
        const userBadge = await prisma.userBadge.findUnique({
            where: {
                userId_badgeId: { userId, badgeId },
            },
            include: {
                badge: true,
            },
        });

        if (!userBadge) {
            return NextResponse.json(
                { error: 'El usuario no tiene esta insignia' },
                { status: 404 }
            );
        }

        // Remove badge and deduct points
        await prisma.$transaction([
            prisma.userBadge.delete({
                where: {
                    userId_badgeId: { userId, badgeId },
                },
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    points: {
                        decrement: userBadge.badge.pointsValue,
                    },
                },
            }),
        ]);

        return NextResponse.json({
            message: `Insignia "${userBadge.badge.name}" removida (-${userBadge.badge.pointsValue} XP)`,
        });
    } catch (err) {
        console.error('Error removing badge:', err);
        return NextResponse.json(
            { error: 'Error al remover insignia' },
            { status: 500 }
        );
    }
}
