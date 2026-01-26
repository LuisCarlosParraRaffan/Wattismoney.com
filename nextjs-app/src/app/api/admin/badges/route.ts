import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';

// GET /api/admin/badges - List all badges
export async function GET() {
    const { error } = await checkAdminAccess();
    if (error) return error;

    try {
        const badges = await prisma.badge.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: {
                        users: true,
                    },
                },
            },
        });

        return NextResponse.json({ badges });
    } catch (err) {
        console.error('Error fetching badges:', err);
        return NextResponse.json(
            { error: 'Error al obtener insignias' },
            { status: 500 }
        );
    }
}

// POST /api/admin/badges - Create new badge
export async function POST(request: Request) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    try {
        const body = await request.json();
        const { name, description, icon, color, category, pointsValue } = body;

        if (!name || !icon || !color) {
            return NextResponse.json(
                { error: 'name, icon y color son requeridos' },
                { status: 400 }
            );
        }

        // Check if badge with same name exists
        const existing = await prisma.badge.findUnique({
            where: { name },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Ya existe una insignia con ese nombre' },
                { status: 400 }
            );
        }

        const badge = await prisma.badge.create({
            data: {
                name,
                description: description || null,
                icon,
                color,
                category: category || null,
                pointsValue: pointsValue || 0,
            },
        });

        return NextResponse.json({
            message: 'Insignia creada correctamente',
            badge,
        });
    } catch (err) {
        console.error('Error creating badge:', err);
        return NextResponse.json(
            { error: 'Error al crear insignia' },
            { status: 500 }
        );
    }
}
