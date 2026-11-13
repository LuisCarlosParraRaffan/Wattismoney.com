import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrCreateWallet, verifyOnChainTransaction, calculateUserLevel } from '@/lib/wallet';
import { getChainById, TREASURY_EVM_WALLET } from '@/lib/web3-config';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const {
            amount,
            chainId = 137,
            tokenSymbol = 'USDC',
            txHash,
            fromAddress,
            purpose = 'WALLET_DEPOSIT', // 'WALLET_DEPOSIT' | 'CONTRACT_INVESTMENT'
            contractId,
        } = body;

        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            return NextResponse.json(
                { error: 'El monto debe ser mayor a 0' },
                { status: 400 }
            );
        }

        if (!txHash) {
            return NextResponse.json(
                { error: 'Se requiere el hash de transacción on-chain (txHash)' },
                { status: 400 }
            );
        }

        const cleanHash = String(txHash).trim();

        // Protección anti-replay: verificar que el txHash no haya sido procesado antes
        const existingTx = await prisma.transaction.findUnique({
            where: { txHash: cleanHash },
        });
        if (existingTx) {
            return NextResponse.json(
                { error: 'Esta transacción blockchain (txHash) ya fue procesada previamente.' },
                { status: 409 }
            );
        }

        // Verificar transacción en RPC de la red seleccionada
        const chain = getChainById(Number(chainId));
        const verification = await verifyOnChainTransaction(cleanHash, chain.chainId);

        if (!verification.verified) {
            return NextResponse.json(
                { error: verification.reason || 'No se pudo verificar la transacción en la blockchain.' },
                { status: 400 }
            );
        }

        const wallet = await getOrCreateWallet(userId);

        // Caso 1: Depósito Crypto a la Billetera Híbrida (USDC / USDT)
        if (purpose === 'WALLET_DEPOSIT' || !contractId) {
            const transaction = await prisma.$transaction(async (tx) => {
                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: {
                        cryptoBalanceUsdc: { increment: numericAmount },
                        totalDeposited: { increment: numericAmount },
                        ...(fromAddress ? { evmWalletAddress: fromAddress } : {}),
                        preferredChainId: chain.chainId,
                    },
                });

                return tx.transaction.create({
                    data: {
                        userId,
                        walletId: wallet.id,
                        type: 'DEPOSIT_CRYPTO',
                        status: 'COMPLETED',
                        paymentRail: 'WEB3_DIRECT',
                        amount: numericAmount,
                        fee: 0,
                        netAmount: numericAmount,
                        currency: tokenSymbol,
                        chainId: chain.chainId,
                        networkName: chain.shortName,
                        tokenSymbol,
                        txHash: cleanHash,
                        fromAddress: fromAddress || wallet.evmWalletAddress || null,
                        toAddress: TREASURY_EVM_WALLET,
                        description: `Depósito Web3 de ${numericAmount.toLocaleString()} ${tokenSymbol} en red ${chain.shortName}`,
                    },
                });
            });

            return NextResponse.json({
                success: true,
                explorerLink: verification.explorerLink,
                message: `¡Depósito de ${numericAmount.toLocaleString()} ${tokenSymbol} (${chain.shortName}) confirmado on-chain!`,
                transaction,
            });
        }

        // Caso 2: Inversión Directa Web3 en un Contrato Energético (PPA)
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
        });

        if (!contract || contract.status !== 'ACTIVE') {
            return NextResponse.json(
                { error: 'El contrato seleccionado no está activo para inversión' },
                { status: 400 }
            );
        }

        const minInvestment = Number(contract.minInvestment);
        const maxInvestment = Number(contract.maxInvestment);
        const currentRaised = Number(contract.currentRaised);
        const totalCapacity = Number(contract.totalCapacity);
        const remainingCapacity = totalCapacity - currentRaised;

        if (numericAmount < minInvestment) {
            return NextResponse.json(
                { error: `La inversión mínima es $${minInvestment.toLocaleString()} ${tokenSymbol}` },
                { status: 400 }
            );
        }

        if (maxInvestment > 0 && numericAmount > maxInvestment) {
            return NextResponse.json(
                { error: `La inversión máxima es $${maxInvestment.toLocaleString()} ${tokenSymbol}` },
                { status: 400 }
            );
        }

        if (numericAmount > remainingCapacity) {
            return NextResponse.json(
                { error: `El contrato solo dispone de $${remainingCapacity.toLocaleString()} ${tokenSymbol} de capacidad restante` },
                { status: 400 }
            );
        }

        const annualReturn = Number(contract.annualReturn) / 100;
        const expectedReturn = numericAmount * (1 + annualReturn);
        // Bonus de +25% XP por financiar en riel Web3 Smart Contract
        const earnedXp = Math.max(15, Math.floor(numericAmount / 8));

        const result = await prisma.$transaction(async (tx) => {
            if (fromAddress) {
                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: {
                        evmWalletAddress: fromAddress,
                        preferredChainId: chain.chainId,
                    },
                });
            }

            const newInvestment = await tx.investment.create({
                data: {
                    userId,
                    contractId,
                    amount: numericAmount,
                    expectedReturn,
                    paymentRail: 'WEB3_DIRECT',
                    currency: tokenSymbol,
                    txHash: cleanHash,
                    status: 'CONFIRMED',
                    confirmedAt: new Date(),
                },
            });

            const newRaised = currentRaised + numericAmount;
            await tx.contract.update({
                where: { id: contractId },
                data: {
                    currentRaised: { increment: numericAmount },
                    ...(newRaised >= totalCapacity ? { status: 'FUNDED' } : {}),
                },
            });

            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { points: { increment: earnedXp } },
            });
            const tier = calculateUserLevel(updatedUser.points);
            if (updatedUser.level !== tier.level || updatedUser.levelName !== tier.levelName) {
                await tx.user.update({
                    where: { id: userId },
                    data: { level: tier.level, levelName: tier.levelName },
                });
            }

            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    walletId: wallet.id,
                    contractId,
                    investmentId: newInvestment.id,
                    type: 'INVESTMENT_PRIMARY',
                    status: 'COMPLETED',
                    paymentRail: 'WEB3_DIRECT',
                    amount: numericAmount,
                    fee: 0,
                    netAmount: numericAmount,
                    currency: tokenSymbol,
                    chainId: chain.chainId,
                    networkName: chain.shortName,
                    tokenSymbol,
                    txHash: cleanHash,
                    fromAddress: fromAddress || wallet.evmWalletAddress || null,
                    toAddress: contract.treasuryWallet || TREASURY_EVM_WALLET,
                    description: `Inversión Web3 (${tokenSymbol} en ${chain.shortName}) en ${contract.name}`,
                },
            });

            return { investment: newInvestment, transaction };
        });

        return NextResponse.json({
            success: true,
            explorerLink: verification.explorerLink,
            earnedXp,
            message: `¡Inversión Web3 de ${numericAmount.toLocaleString()} ${tokenSymbol} en ${contract.name} confirmada en ${chain.shortName}! (+${earnedXp} XP)`,
            investment: result.investment,
            transaction: result.transaction,
        });
    } catch (error) {
        console.error('Error in POST /api/payments/crypto:', error);
        return NextResponse.json(
            { error: 'Error al procesar la transacción cripto' },
            { status: 500 }
        );
    }
}
