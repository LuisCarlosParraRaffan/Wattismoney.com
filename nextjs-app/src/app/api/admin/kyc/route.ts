import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';
import { KycStatus, UserStatus } from '@/generated/prisma';

// GET /api/admin/kyc - List KYC documents pending review
export async function GET(request: Request) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'SUBMITTED';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const skip = (page - 1) * limit;

        const [documents, total] = await Promise.all([
            prisma.kycDocument.findMany({
                where: { status: status as KycStatus },
                skip,
                take: limit,
                orderBy: { submittedAt: 'asc' }, // Oldest first
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                },
            }),
            prisma.kycDocument.count({ where: { status: status as KycStatus } }),
        ]);

        return NextResponse.json({
            documents,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching KYC documents:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/kyc - Approve or reject KYC
export async function PATCH(request: Request) {
    const { error, session } = await checkAdminAccess();
    if (error) return error;

    try {
        const body = await request.json();
        const { documentId, action, rejectionReason } = body;

        if (!documentId || !action) {
            return NextResponse.json(
                { error: 'documentId y action son requeridos' },
                { status: 400 }
            );
        }

        if (action !== 'APPROVE' && action !== 'REJECT') {
            return NextResponse.json(
                { error: 'action debe ser APPROVE o REJECT' },
                { status: 400 }
            );
        }

        // Get document and user
        const document = await prisma.kycDocument.findUnique({
            where: { id: documentId },
            include: { user: true },
        });

        if (!document) {
            return NextResponse.json(
                { error: 'Documento no encontrado' },
                { status: 404 }
            );
        }

        // Update document and user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const updatedDoc = await tx.kycDocument.update({
                where: { id: documentId },
                data: {
                    status: action === 'APPROVE' ? KycStatus.APPROVED : KycStatus.REJECTED,
                    rejectionReason: action === 'REJECT' ? rejectionReason : null,
                    reviewedAt: new Date(),
                    reviewedBy: session?.user?.id,
                },
            });

            // Update user status
            await tx.user.update({
                where: { id: document.userId },
                data: {
                    status: action === 'APPROVE' ? UserStatus.ACTIVE : UserStatus.KYC_REJECTED,
                },
            });

            return updatedDoc;
        });

        return NextResponse.json({ document: result });
    } catch (err) {
        console.error('Error updating KYC:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
