import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';
import { KycStatus, UserStatus } from '@/generated/prisma';
import { sendKycApprovedEmail, sendKycRejectedEmail } from '@/lib/email';

// GET /api/admin/kyc - List KYC documents pending review
export async function GET(request: Request) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get('status') || 'SUBMITTED';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const skip = (page - 1) * limit;
        const whereClause = statusParam === 'ALL' ? {} : { status: statusParam as KycStatus };

        const [documents, total] = await Promise.all([
            prisma.kycDocument.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { submittedAt: 'desc' },
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
            prisma.kycDocument.count({ where: whereClause }),
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
        const { documentId, action, rejectionReason, reason } = body;
        const normalizedAction = String(action || '').toUpperCase();
        const finalReason = rejectionReason || reason || 'Documentación incompleta o ilegible';

        if (!documentId || !normalizedAction) {
            return NextResponse.json(
                { error: 'documentId y action son requeridos' },
                { status: 400 }
            );
        }

        if (normalizedAction !== 'APPROVE' && normalizedAction !== 'REJECT') {
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
                    status: normalizedAction === 'APPROVE' ? KycStatus.APPROVED : KycStatus.REJECTED,
                    rejectionReason: normalizedAction === 'REJECT' ? finalReason : null,
                    reviewedAt: new Date(),
                    reviewedBy: session?.user?.id,
                },
            });

            // Update user status
            await tx.user.update({
                where: { id: document.userId },
                data: {
                    status: normalizedAction === 'APPROVE' ? UserStatus.ACTIVE : UserStatus.KYC_REJECTED,
                },
            });

            return updatedDoc;
        });

        // Send notification email asynchronously (do not fail API if Resend fails)
        if (document.user?.email) {
            const fullName = [document.user.firstName, document.user.lastName].filter(Boolean).join(' ');
            if (normalizedAction === 'APPROVE') {
                sendKycApprovedEmail(document.user.email, fullName).catch(console.error);
            } else {
                sendKycRejectedEmail(document.user.email, finalReason, fullName).catch(console.error);
            }
        }

        return NextResponse.json({ document: result });
    } catch (err) {
        console.error('Error updating KYC:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
