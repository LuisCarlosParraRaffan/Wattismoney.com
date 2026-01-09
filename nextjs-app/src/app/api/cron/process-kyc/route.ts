import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendKycApprovedEmail } from '@/lib/email';

// Duration in minutes before auto-approving KYC
const APPROVAL_DELAY_MINUTES = 5;

export async function GET(request: NextRequest) {
    // Verify this is a legitimate cron request from Vercel
    const authHeader = request.headers.get('authorization');

    // In production, Vercel adds CRON_SECRET automatically
    // For local testing, we skip this check
    if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET) {
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            console.warn('[Cron] Unauthorized request');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    console.log('[Cron] Processing pending KYC approvals...');

    try {
        // Calculate the cutoff time (5 minutes ago)
        const cutoffTime = new Date();
        cutoffTime.setMinutes(cutoffTime.getMinutes() - APPROVAL_DELAY_MINUTES);

        // Find all KYC documents that are SUBMITTED and older than 5 minutes
        const pendingKyc = await prisma.kycDocument.findMany({
            where: {
                status: 'SUBMITTED',
                submittedAt: {
                    lte: cutoffTime,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                    },
                },
            },
        });

        console.log(`[Cron] Found ${pendingKyc.length} pending KYC documents to approve`);

        let approved = 0;
        const errors: string[] = [];

        for (const kyc of pendingKyc) {
            try {
                // Update KYC status to APPROVED
                await prisma.kycDocument.update({
                    where: { id: kyc.id },
                    data: {
                        status: 'APPROVED',
                        reviewedAt: new Date(),
                        reviewedBy: 'AUTO_APPROVED_CRON',
                    },
                });

                // Update user status to ACTIVE
                await prisma.user.update({
                    where: { id: kyc.userId },
                    data: { status: 'ACTIVE' },
                });

                // Send approval email
                if (kyc.user?.email) {
                    await sendKycApprovedEmail(
                        kyc.user.email,
                        kyc.user.firstName || 'Usuario'
                    );
                    console.log(`[Cron] Sent approval email to ${kyc.user.email}`);
                }

                approved++;
            } catch (error) {
                console.error(`[Cron] Error processing KYC ${kyc.id}:`, error);
                errors.push(`KYC ${kyc.id}: ${error}`);
            }
        }

        console.log(`[Cron] Approved ${approved} KYC documents`);

        return NextResponse.json({
            success: true,
            processed: pendingKyc.length,
            approved,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('[Cron] Error processing KYC approvals:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
