import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrCreateWallet, calculateUserLevel } from '@/lib/wallet';

// POST /api/investments - Create a new investment from Internal Hybrid Wallet
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const {
            contractId,
            amount,
            walletSource = 'FIAT', // 'FIAT' | 'CRYPTO' | 'COMBINED'
        } = body;

        const numericAmount = Number(amount);

        if (!contractId || !numericAmount) {
            return NextResponse.json(
                { error: 'Se requiere contractId y amount' },
                { status: 400 }
            );
        }

        if (numericAmount <= 0) {
            return NextResponse.json(
                { error: 'El monto debe ser mayor a 0' },
                { status: 400 }
            );
        }

        // Fetch the contract to validate
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            select: {
                id: true,
                name: true,
                status: true,
                minInvestment: true,
                maxInvestment: true,
                totalCapacity: true,
                currentRaised: true,
                annualReturn: true,
            },
        });

        if (!contract) {
            return NextResponse.json(
                { error: 'Contrato no encontrado' },
                { status: 404 }
            );
        }

        if (contract.status !== 'ACTIVE') {
            return NextResponse.json(
                { error: 'Este contrato no está aceptando inversiones' },
                { status: 400 }
            );
        }

        // Validate amount is within limits
        const minInvestment = Number(contract.minInvestment);
        const maxInvestment = Number(contract.maxInvestment);

        if (numericAmount < minInvestment) {
            return NextResponse.json(
                { error: `La inversión mínima es $${minInvestment.toLocaleString()} USD` },
                { status: 400 }
            );
        }

        if (maxInvestment > 0 && numericAmount > maxInvestment) {
            return NextResponse.json(
                { error: `La inversión máxima es $${maxInvestment.toLocaleString()} USD` },
                { status: 400 }
            );
        }

        // Check if contract has capacity
        const currentRaised = Number(contract.currentRaised);
        const totalCapacity = Number(contract.totalCapacity);
        const remainingCapacity = totalCapacity - currentRaised;

        if (numericAmount > remainingCapacity) {
            return NextResponse.json(
                { error: `El contrato solo puede aceptar $${remainingCapacity.toLocaleString()} USD más` },
                { status: 400 }
            );
        }

        // Check user's hybrid wallet balance
        const wallet = await getOrCreateWallet(userId);
        const fiatAvail = Number(wallet.fiatBalance);
        const cryptoAvail = Number(wallet.cryptoBalanceUsdc);
        const totalAvail = fiatAvail + cryptoAvail;

        if (totalAvail < numericAmount) {
            return NextResponse.json(
                {
                    error: `Saldo insuficiente en tu Billetera ($${totalAvail.toLocaleString()} disponible). Deposita fondos o selecciona Pago Directo con Tarjeta/PSE o Web3.`,
                    insufficientFunds: true,
                    availableBalance: totalAvail,
                },
                { status: 400 }
            );
        }

        // Determinar cuánto descontar de Fiat y cuánto de Crypto
        let deductFiat = 0;
        let deductCrypto = 0;

        if (walletSource === 'CRYPTO') {
            if (cryptoAvail >= numericAmount) {
                deductCrypto = numericAmount;
            } else {
                deductCrypto = cryptoAvail;
                deductFiat = numericAmount - cryptoAvail;
            }
        } else {
            if (fiatAvail >= numericAmount) {
                deductFiat = numericAmount;
            } else {
                deductFiat = fiatAvail;
                deductCrypto = numericAmount - fiatAvail;
            }
        }

        // Calculate expected return & XP
        const annualReturn = Number(contract.annualReturn) / 100;
        const expectedReturn = numericAmount * (1 + annualReturn);
        const earnedXp = Math.max(10, Math.floor(numericAmount / 10));

        const investment = await prisma.$transaction(async (tx) => {
            // 1. Deduct from wallet
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    ...(deductFiat > 0 ? { fiatBalance: { decrement: deductFiat } } : {}),
                    ...(deductCrypto > 0 ? { cryptoBalanceUsdc: { decrement: deductCrypto } } : {}),
                },
            });

            // 2. Create investment as CONFIRMED
            const newInvestment = await tx.investment.create({
                data: {
                    userId,
                    contractId,
                    amount: numericAmount,
                    expectedReturn,
                    paymentRail: 'INTERNAL_WALLET',
                    currency: deductCrypto > deductFiat ? 'USDC' : 'USD',
                    status: 'CONFIRMED',
                    confirmedAt: new Date(),
                },
            });

            // 3. Update contract's currentRaised & auto-transition to FUNDED if 100% reached
            const newRaised = currentRaised + numericAmount;
            await tx.contract.update({
                where: { id: contractId },
                data: {
                    currentRaised: { increment: numericAmount },
                    ...(newRaised >= totalCapacity ? { status: 'FUNDED' } : {}),
                },
            });

            // 4. Record ledger transaction
            await tx.transaction.create({
                data: {
                    userId,
                    walletId: wallet.id,
                    contractId,
                    investmentId: newInvestment.id,
                    type: 'INVESTMENT_PRIMARY',
                    status: 'COMPLETED',
                    paymentRail: 'INTERNAL_WALLET',
                    amount: numericAmount,
                    fee: 0,
                    netAmount: numericAmount,
                    currency: deductCrypto > deductFiat ? 'USDC' : 'USD',
                    description: `Inversión con Saldo en Billetera en ${contract.name}`,
                },
            });

            // 5. Award gamification XP points
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

            return newInvestment;
        });

        return NextResponse.json(
            {
                success: true,
                earnedXp,
                message: `¡Inversión de $${numericAmount.toLocaleString()} confirmada en ${contract.name}! (+${earnedXp} XP)`,
                investment: {
                    id: investment.id,
                    contractId: investment.contractId,
                    contractName: contract.name,
                    amount: Number(investment.amount),
                    expectedReturn: Number(investment.expectedReturn),
                    status: investment.status,
                    createdAt: investment.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating investment:', error);
        return NextResponse.json(
            { error: 'Error al procesar la inversión' },
            { status: 500 }
        );
    }
}

// GET /api/investments - Get current user's investments (alias for /api/user/investments)
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const investments = await prisma.investment.findMany({
            where: { userId: session.user.id },
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

        return NextResponse.json({ investments });
    } catch (error) {
        console.error('Error fetching investments:', error);
        return NextResponse.json(
            { error: 'Error al obtener inversiones' },
            { status: 500 }
        );
    }
}
