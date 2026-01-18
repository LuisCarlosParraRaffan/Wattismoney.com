import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';

// GET /api/admin/users - List all users with pagination
export async function GET(request: Request) {
    const { error, session } = await checkAdminAccess();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        const skip = (page - 1) * limit;

        const where = {
            ...(search && {
                OR: [
                    { email: { contains: search, mode: 'insensitive' as const } },
                    { firstName: { contains: search, mode: 'insensitive' as const } },
                    { lastName: { contains: search, mode: 'insensitive' as const } },
                ],
            }),
            ...(status && { status: status as never }),
        };

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    lastLoginAt: true,
                    points: true,
                    level: true,
                    kycDocuments: {
                        select: {
                            status: true,
                            submittedAt: true,
                        },
                        orderBy: { submittedAt: 'desc' },
                        take: 1,
                    },
                    investorProfile: {
                        select: {
                            aiRiskProfile: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
