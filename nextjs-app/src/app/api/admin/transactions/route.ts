import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import { prisma } from '@/lib/prisma';
import { getOrCreateWallet, calculateUserLevel } from '@/lib/wallet';
import { TransactionStatus } from '@/generated/prisma';

// GET /api/admin/transactions - List platform transactions & pending treasury approvals
export async function GET(request: NextRequest) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get('status') || 'ALL';

        const whereClause =
            statusParam === 'ALL' ? {} : { status: statusParam as TransactionStatus };

        try {
            const transactions = await prisma.transaction.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                take: 100,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    contract: {
                        select: {
                            id: true,
                            name: true,
                            annualReturn: true,
                        },
                    },
                },
            });

            const contracts = await prisma.contract.findMany({
                where: { status: { in: ['ACTIVE', 'FUNDED', 'IN_PROGRESS'] } },
                select: {
                    id: true,
                    name: true,
                    annualReturn: true,
                    currentRaised: true,
                    totalCapacity: true,
                    _count: { select: { investments: true } },
                },
                orderBy: { createdAt: 'desc' },
            });

            return NextResponse.json({
                transactions: transactions.map((t) => ({
                    ...t,
                    amount: Number(t.amount),
                    fee: Number(t.fee),
                    netAmount: Number(t.netAmount),
                })),
                contracts: contracts.map((c) => ({
                    id: c.id,
                    name: c.name,
                    annualReturn: Number(c.annualReturn),
                    currentRaised: Number(c.currentRaised),
                    totalCapacity: Number(c.totalCapacity),
                    investorsCount: c._count.investments,
                })),
            });
        } catch (schemaErr) {
            console.warn('Admin transactions fallback:', schemaErr);
            return NextResponse.json({ transactions: [], contracts: [] });
        }
    } catch (err) {
        console.error('Error in GET /api/admin/transactions:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// PATCH /api/admin/transactions - Approve or Reject pending Bank Transfer or Withdrawal
export async function PATCH(request: NextRequest) {
    const { error, session } = await checkAdminAccess();
    if (error) return error;

    try {
        const body = await request.json();
        const { transactionId, action, adminNotes, txHash } = body;
        const normalizedAction = String(action || '').toUpperCase(); // 'APPROVE' | 'REJECT'

        if (!transactionId || !['APPROVE', 'REJECT'].includes(normalizedAction)) {
            return NextResponse.json(
                { error: 'transactionId y action (APPROVE/REJECT) son requeridos' },
                { status: 400 }
            );
        }

        const txRecord = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { contract: true },
        });

        if (!txRecord) {
            return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 });
        }

        if (txRecord.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Solo se pueden revisar transacciones en estado PENDIENTE' },
                { status: 400 }
            );
        }

        const amount = Number(txRecord.amount);

        await prisma.$transaction(async (tx) => {
            if (normalizedAction === 'APPROVE') {
                // 1. Aprobar Depósito Fiat por Transferencia Bancaria
                if (txRecord.type === 'DEPOSIT_FIAT') {
                    await tx.wallet.update({
                        where: { id: txRecord.walletId },
                        data: {
                            fiatBalance: { increment: amount },
                            totalDeposited: { increment: amount },
                        },
                    });
                }

                // 2. Aprobar Inversión Primaria por Transferencia Bancaria
                if (txRecord.type === 'INVESTMENT_PRIMARY' && txRecord.investmentId && txRecord.contractId) {
                    await tx.investment.update({
                        where: { id: txRecord.investmentId },
                        data: {
                            status: 'CONFIRMED',
                            confirmedAt: new Date(),
                        },
                    });

                    const contract = await tx.contract.findUnique({
                        where: { id: txRecord.contractId },
                    });

                    if (contract) {
                        const newRaised = Number(contract.currentRaised) + amount;
                        await tx.contract.update({
                            where: { id: contract.id },
                            data: {
                                currentRaised: { increment: amount },
                                ...(newRaised >= Number(contract.totalCapacity) ? { status: 'FUNDED' } : {}),
                            },
                        });
                    }

                    const earnedXp = Math.max(10, Math.floor(amount / 10));
                    const updatedUser = await tx.user.update({
                        where: { id: txRecord.userId },
                        data: { points: { increment: earnedXp } },
                    });
                    const tier = calculateUserLevel(updatedUser.points);
                    if (updatedUser.level !== tier.level || updatedUser.levelName !== tier.levelName) {
                        await tx.user.update({
                            where: { id: txRecord.userId },
                            data: { level: tier.level, levelName: tier.levelName },
                        });
                    }
                }

                // 3. Aprobar Retiro Fiat o Crypto
                if (txRecord.type === 'WITHDRAWAL_FIAT' || txRecord.type === 'WITHDRAWAL_CRYPTO') {
                    await tx.wallet.update({
                        where: { id: txRecord.walletId },
                        data: {
                            lockedBalance: { decrement: amount },
                            totalWithdrawn: { increment: amount },
                        },
                    });
                }

                await tx.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: 'COMPLETED',
                        adminNotes: adminNotes || 'Aprobado por Tesorería',
                        ...(txHash ? { txHash } : {}),
                        reviewedBy: session?.user?.id,
                        reviewedAt: new Date(),
                    },
                });
            } else {
                // REJECT
                if (txRecord.type === 'INVESTMENT_PRIMARY' && txRecord.investmentId) {
                    await tx.investment.update({
                        where: { id: txRecord.investmentId },
                        data: { status: 'CANCELLED' },
                    });
                }

                if (txRecord.type === 'WITHDRAWAL_FIAT') {
                    await tx.wallet.update({
                        where: { id: txRecord.walletId },
                        data: {
                            lockedBalance: { decrement: amount },
                            fiatBalance: { increment: amount },
                        },
                    });
                }

                if (txRecord.type === 'WITHDRAWAL_CRYPTO') {
                    await tx.wallet.update({
                        where: { id: txRecord.walletId },
                        data: {
                            lockedBalance: { decrement: amount },
                            cryptoBalanceUsdc: { increment: amount },
                        },
                    });
                }

                await tx.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: 'REJECTED',
                        adminNotes: adminNotes || 'Rechazado por Tesorería',
                        reviewedBy: session?.user?.id,
                        reviewedAt: new Date(),
                    },
                });
            }
        });

        return NextResponse.json({
            success: true,
            message:
                normalizedAction === 'APPROVE'
                    ? 'Transacción aprobada y liquidada exitosamente'
                    : 'Transacción rechazada y saldos reversados',
        });
    } catch (err) {
        console.error('Error in PATCH /api/admin/transactions:', err);
        return NextResponse.json({ error: 'Error al actualizar transacción' }, { status: 500 });
    }
}

// POST /api/admin/transactions - Distribute PPA Energy Yields to all active investors of a contract
export async function POST(request: NextRequest) {
    const { error, session } = await checkAdminAccess();
    if (error) return error;

    try {
        const body = await request.json();
        const {
            contractId,
            currency = 'USD', // 'USD' (Fiat) or 'USDC' (Crypto)
            periodMonths = 1,
        } = body;

        if (!contractId) {
            return NextResponse.json({ error: 'Se requiere contractId' }, { status: 400 });
        }

        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            include: {
                investments: {
                    where: { status: 'CONFIRMED' },
                },
            },
        });

        if (!contract) {
            return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
        }

        if (contract.investments.length === 0) {
            return NextResponse.json(
                { error: 'Este contrato aún no tiene inversiones confirmadas para dispersar rendimientos' },
                { status: 400 }
            );
        }

        const annualRate = Number(contract.annualReturn) / 100;
        const periodRate = (annualRate / 12) * Number(periodMonths);
        const isCryptoYield = currency === 'USDC';

        let totalDistributed = 0;
        let distributionsCount = 0;

        for (const inv of contract.investments) {
            const yieldAmount = Math.round(Number(inv.amount) * periodRate * 100) / 100;
            if (yieldAmount <= 0) continue;

            const wallet = await getOrCreateWallet(inv.userId);

            await prisma.$transaction(async (tx) => {
                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: {
                        ...(isCryptoYield
                            ? { cryptoBalanceUsdc: { increment: yieldAmount } }
                            : { fiatBalance: { increment: yieldAmount } }),
                        totalYieldEarned: { increment: yieldAmount },
                    },
                });

                await tx.investment.update({
                    where: { id: inv.id },
                    data: {
                        accruedYield: { increment: yieldAmount },
                    },
                });

                await tx.transaction.create({
                    data: {
                        userId: inv.userId,
                        walletId: wallet.id,
                        contractId: contract.id,
                        investmentId: inv.id,
                        type: 'YIELD_DISTRIBUTION',
                        status: 'COMPLETED',
                        paymentRail: isCryptoYield ? 'WEB3_DIRECT' : 'INTERNAL_WALLET',
                        amount: yieldAmount,
                        fee: 0,
                        netAmount: yieldAmount,
                        currency: isCryptoYield ? 'USDC' : 'USD',
                        reviewedBy: session?.user?.id,
                        reviewedAt: new Date(),
                        description: `Pago de rendimientos PPA (${periodMonths} mes${Number(periodMonths) > 1 ? 'es' : ''}) — ${contract.name}`,
                    },
                });
            });

            totalDistributed += yieldAmount;
            distributionsCount += 1;
        }

        return NextResponse.json({
            success: true,
            totalDistributed: Math.round(totalDistributed * 100) / 100,
            distributionsCount,
            message: `Se dispersaron $${totalDistributed.toFixed(2)} ${currency} en rendimientos energéticos a ${distributionsCount} inversiones activas.`,
        });
    } catch (err) {
        console.error('Error distributing yields:', err);
        return NextResponse.json({ error: 'Error al dispersar rendimientos' }, { status: 500 });
    }
}
