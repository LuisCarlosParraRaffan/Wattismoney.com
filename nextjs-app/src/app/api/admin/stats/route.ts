import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';

// GET /api/admin/stats - Get platform statistics
export async function GET() {
    const { error } = await checkAdminAccess();
    if (error) return error;

    try {
        const [
            totalUsers,
            activeUsers,
            pendingKyc,
            kycInReview,
            totalContracts,
            activeContracts,
            totalInvestments,
            totalInvested,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { status: 'ACTIVE' } }),
            prisma.user.count({ where: { status: 'PENDING_KYC' } }),
            prisma.kycDocument.count({ where: { status: 'SUBMITTED' } }),
            prisma.contract.count(),
            prisma.contract.count({ where: { status: 'ACTIVE' } }),
            prisma.investment.count({ where: { status: 'CONFIRMED' } }),
            prisma.investment.aggregate({
                where: { status: 'CONFIRMED' },
                _sum: { amount: true },
            }),
        ]);

        // User registration trend (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentUsers = await prisma.user.count({
            where: { createdAt: { gte: sevenDaysAgo } },
        });

        // User status breakdown
        const usersByStatus = await prisma.user.groupBy({
            by: ['status'],
            _count: true,
        });

        // Contracts by type
        const contractsByType = await prisma.contract.groupBy({
            by: ['energyType'],
            _count: true,
        });

        return NextResponse.json({
            users: {
                total: totalUsers,
                active: activeUsers,
                pendingKyc,
                recentRegistrations: recentUsers,
                byStatus: usersByStatus,
            },
            kyc: {
                pendingReview: kycInReview,
            },
            contracts: {
                total: totalContracts,
                active: activeContracts,
                byType: contractsByType,
            },
            investments: {
                total: totalInvestments,
                totalAmount: totalInvested._sum.amount || 0,
            },
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
