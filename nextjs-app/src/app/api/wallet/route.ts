import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrCreateWallet } from '@/lib/wallet';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const userId = session.user.id;

        // Obtener inversiones confirmadas para métricas de portafolio
        const investments = await prisma.investment.findMany({
            where: { userId },
            include: {
                contract: {
                    select: {
                        id: true,
                        name: true,
                        annualReturn: true,
                        energyType: true,
                        generatorLocation: true,
                        status: true,
                    },
                },
                listing: {
                    select: {
                        id: true,
                        status: true,
                        askingPrice: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const confirmedInvestments = investments.filter((inv) => inv.status === 'CONFIRMED');
        const totalInvested = confirmedInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
        const totalExpectedReturn = confirmedInvestments.reduce(
            (sum, inv) => sum + Number(inv.expectedReturn || 0),
            0
        );

        try {
            const wallet = await getOrCreateWallet(userId);
            const transactions = await prisma.transaction.findMany({
                where: { userId },
                include: {
                    contract: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });

            const fiatBalance = Number(wallet.fiatBalance);
            const cryptoBalanceUsdc = Number(wallet.cryptoBalanceUsdc);
            const lockedBalance = Number(wallet.lockedBalance);
            const totalAvailable = fiatBalance + cryptoBalanceUsdc;

            return NextResponse.json({
                wallet: {
                    id: wallet.id,
                    fiatBalance,
                    cryptoBalanceUsdc,
                    lockedBalance,
                    totalAvailable,
                    totalDeposited: Number(wallet.totalDeposited),
                    totalWithdrawn: Number(wallet.totalWithdrawn),
                    totalYieldEarned: Number(wallet.totalYieldEarned),
                    evmWalletAddress: wallet.evmWalletAddress,
                    preferredChainId: wallet.preferredChainId || 137,
                    bankName: wallet.bankName,
                    bankAccountType: wallet.bankAccountType,
                    bankAccountNumber: wallet.bankAccountNumber,
                    bankRoutingOrSwift: wallet.bankRoutingOrSwift,
                },
                portfolio: {
                    totalInvested,
                    totalExpectedReturn,
                    netExpectedGain: totalExpectedReturn - totalInvested,
                    totalNetWorth: totalAvailable + totalInvested + lockedBalance,
                },
                transactions: transactions.map((tx) => ({
                    id: tx.id,
                    type: tx.type,
                    status: tx.status,
                    paymentRail: tx.paymentRail,
                    amount: Number(tx.amount),
                    fee: Number(tx.fee),
                    netAmount: Number(tx.netAmount),
                    currency: tx.currency,
                    description: tx.description,
                    txHash: tx.txHash,
                    chainId: tx.chainId,
                    networkName: tx.networkName,
                    tokenSymbol: tx.tokenSymbol,
                    receiptUrl: tx.receiptUrl,
                    bankReference: tx.bankReference,
                    contractId: tx.contractId,
                    contractName: tx.contract?.name || null,
                    createdAt: tx.createdAt,
                })),
                investments,
            });
        } catch (dbSchemaError) {
            console.warn('Wallet table fallback (run npx prisma db push to create Wallet/Transaction tables):', dbSchemaError);
            return NextResponse.json({
                wallet: {
                    id: 'fallback-wallet',
                    fiatBalance: 0,
                    cryptoBalanceUsdc: 0,
                    lockedBalance: 0,
                    totalAvailable: 0,
                    totalDeposited: 0,
                    totalWithdrawn: 0,
                    totalYieldEarned: 0,
                    evmWalletAddress: null,
                    preferredChainId: 137,
                    bankName: null,
                    bankAccountType: null,
                    bankAccountNumber: null,
                    bankRoutingOrSwift: null,
                },
                portfolio: {
                    totalInvested,
                    totalExpectedReturn,
                    netExpectedGain: totalExpectedReturn - totalInvested,
                    totalNetWorth: totalInvested,
                },
                transactions: [],
                investments,
                schemaPending: true,
            });
        }
    } catch (error) {
        console.error('Error in GET /api/wallet:', error);
        return NextResponse.json({ error: 'Error al cargar la billetera' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const {
            evmWalletAddress,
            preferredChainId,
            bankName,
            bankAccountType,
            bankAccountNumber,
            bankRoutingOrSwift,
        } = body;

        const wallet = await getOrCreateWallet(session.user.id);

        const updatedWallet = await prisma.wallet.update({
            where: { id: wallet.id },
            data: {
                ...(evmWalletAddress !== undefined ? { evmWalletAddress } : {}),
                ...(preferredChainId !== undefined ? { preferredChainId: Number(preferredChainId) } : {}),
                ...(bankName !== undefined ? { bankName } : {}),
                ...(bankAccountType !== undefined ? { bankAccountType } : {}),
                ...(bankAccountNumber !== undefined ? { bankAccountNumber } : {}),
                ...(bankRoutingOrSwift !== undefined ? { bankRoutingOrSwift } : {}),
            },
        });

        return NextResponse.json({
            success: true,
            wallet: {
                id: updatedWallet.id,
                evmWalletAddress: updatedWallet.evmWalletAddress,
                preferredChainId: updatedWallet.preferredChainId,
                bankName: updatedWallet.bankName,
                bankAccountType: updatedWallet.bankAccountType,
                bankAccountNumber: updatedWallet.bankAccountNumber,
                bankRoutingOrSwift: updatedWallet.bankRoutingOrSwift,
            },
        });
    } catch (error) {
        console.error('Error updating wallet settings:', error);
        return NextResponse.json({ error: 'Error al actualizar configuración de billetera' }, { status: 500 });
    }
}
