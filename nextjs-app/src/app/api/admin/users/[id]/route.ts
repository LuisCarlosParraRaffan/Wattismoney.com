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
                    take: 10, // Limit to most recent 10
                },
                _count: {
                    select: {
                        investments: true,
                    },
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

// PATCH /api/admin/users/[id] - Update user (admin can update all fields)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error, session } = await checkAdminAccess();
    if (error) return error;

    const { id } = await params;

    try {
        const body = await request.json();

        // Validate status if provided
        const validStatuses = Object.values(UserStatus);
        if (body.status && !validStatuses.includes(body.status)) {
            return NextResponse.json(
                { error: 'Estado no válido' },
                { status: 400 }
            );
        }

        // Only SUPER_ADMIN can change roles
        if (body.role && session?.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json(
                { error: 'Solo SUPER_ADMIN puede cambiar roles' },
                { status: 403 }
            );
        }

        // All fields that admin can update
        const allowedFields = [
            'firstName',
            'lastName',
            'phone',
            'dateOfBirth',
            'nationality',
            'avatarUrl',
            'bio',
            'address',
            'city',
            'country',
            'preferredLanguage',
            'profilePublic',
            'status',
            'role',
            'points',
            'level',
            'levelName',
        ];

        const updateData: Record<string, unknown> = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        // Handle dateOfBirth conversion
        if (updateData.dateOfBirth && typeof updateData.dateOfBirth === 'string') {
            updateData.dateOfBirth = new Date(updateData.dateOfBirth);
        }

        // Handle numeric conversions
        if (updateData.points !== undefined) {
            updateData.points = Number(updateData.points);
        }
        if (updateData.level !== undefined) {
            updateData.level = Number(updateData.level);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
                bio: true,
                address: true,
                city: true,
                country: true,
                preferredLanguage: true,
                profilePublic: true,
                role: true,
                status: true,
                points: true,
                level: true,
                levelName: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({
            message: 'Usuario actualizado correctamente',
            user
        });
    } catch (err) {
        console.error('Error updating user:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
