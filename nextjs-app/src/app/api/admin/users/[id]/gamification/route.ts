import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/admin/users/[id]/gamification - Get user's gamification data
export async function GET(request: Request, { params }: RouteParams) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id: userId } = await params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                points: true,
                level: true,
                levelName: true,
                badges: {
                    include: {
                        badge: true,
                    },
                    orderBy: { awardedAt: 'desc' },
                },
                _count: {
                    select: {
                        investments: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Calculate automatic XP from investments
        const autoPoints = (user._count.investments || 0) * 1000;
        const autoLevel = Math.floor(autoPoints / 5000) + 1;

        return NextResponse.json({
            ...user,
            autoPoints,
            autoLevel,
            investmentCount: user._count.investments,
        });
    } catch (err) {
        console.error('Error fetching gamification:', err);
        return NextResponse.json(
            { error: 'Error al obtener datos de gamificación' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/users/[id]/gamification - Update user's gamification
export async function PATCH(request: Request, { params }: RouteParams) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id: userId } = await params;

    try {
        const body = await request.json();
        const { points, level, levelName } = body;

        const updateData: { points?: number; level?: number; levelName?: string } = {};

        if (points !== undefined) updateData.points = Number(points);
        if (level !== undefined) updateData.level = Number(level);
        if (levelName !== undefined) updateData.levelName = levelName;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                points: true,
                level: true,
                levelName: true,
            },
        });

        return NextResponse.json({
            message: 'Gamificación actualizada correctamente',
            user: updatedUser,
        });
    } catch (err) {
        console.error('Error updating gamification:', err);
        return NextResponse.json(
            { error: 'Error al actualizar gamificación' },
            { status: 500 }
        );
    }
}
