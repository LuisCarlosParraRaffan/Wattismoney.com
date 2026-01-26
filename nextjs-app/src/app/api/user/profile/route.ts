import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/user/profile - Get current user's full profile
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                dateOfBirth: true,
                nationality: true,
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
                createdAt: true,
                lastLoginAt: true,
                kycDocuments: {
                    select: {
                        status: true,
                        reviewedAt: true,
                    },
                    orderBy: { submittedAt: 'desc' },
                    take: 1,
                },
                investorProfile: {
                    select: {
                        aiRiskProfile: true,
                        investmentGoal: true,
                        investmentHorizon: true,
                        riskTolerance: true,
                    },
                },
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

        // Calculate XP based on investments count * 1000
        const calculatedPoints = (user._count.investments || 0) * 1000;
        const calculatedLevel = Math.floor(calculatedPoints / 5000) + 1;

        return NextResponse.json({
            ...user,
            // Use calculated values if no manual points/level set
            points: user.points > 0 ? user.points : calculatedPoints,
            level: user.level > 1 ? user.level : calculatedLevel,
            kycStatus: user.kycDocuments[0]?.status || 'PENDING',
            kycVerifiedAt: user.kycDocuments[0]?.reviewedAt || null,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { error: 'Error al obtener perfil' },
            { status: 500 }
        );
    }
}

// PATCH /api/user/profile - Update current user's profile (editable fields only)
export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();

        // Only allow these fields to be updated by the user
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
        ];

        // Filter out any non-allowed fields
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

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
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
                updatedAt: true,
            },
        });

        return NextResponse.json({
            message: 'Perfil actualizado correctamente',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            { error: 'Error al actualizar perfil' },
            { status: 500 }
        );
    }
}
