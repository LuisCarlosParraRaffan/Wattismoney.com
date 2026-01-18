import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';
import { UserStatus } from '@/generated/prisma';

// GET /api/admin/users/[id] - Get user details
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id } = await params;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                kycDocuments: {
                    orderBy: { submittedAt: 'desc' },
                },
                investorProfile: true,
                investments: {
                    include: {
                        contract: {
                            select: {
                                id: true,
                                name: true,
                                status: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (err) {
        console.error('Error fetching user:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error, session } = await checkAdminAccess();
    if (error) return error;

    const { id } = await params;

    try {
        const body = await request.json();
        const { status, role } = body;

        // Validate status
        const validStatuses = Object.values(UserStatus);
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Estado no válido' },
                { status: 400 }
            );
        }

        // Only SUPER_ADMIN can change roles
        if (role && session?.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json(
                { error: 'Solo SUPER_ADMIN puede cambiar roles' },
                { status: 403 }
            );
        }

        const updateData: Record<string, unknown> = {};
        if (status) updateData.status = status;
        if (role) updateData.role = role;

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                status: true,
            },
        });

        return NextResponse.json({ user });
    } catch (err) {
        console.error('Error updating user:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
