import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrCreateWallet, calculateUserLevel } from '@/lib/wallet';

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
            rail = 'STRIPE', // 'STRIPE' | 'LATAM_GATEWAY' | 'BANK_TRANSFER'
            purpose = 'WALLET_DEPOSIT', // 'WALLET_DEPOSIT' | 'CONTRACT_INVESTMENT'
            contractId,
            paymentMethodDetail, // e.g., 'Visa •••• 4242', 'PSE - Bancolombia', 'Nequi', 'ACH'
            bankReference,
            receiptUrl,
            localCurrency = 'USD',
        } = body;

        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            return NextResponse.json(
                { error: 'El monto debe ser mayor a $0 USD' },
                { status: 400 }
            );
        }

        const wallet = await getOrCreateWallet(userId);
        const isBankTransfer = rail === 'BANK_TRANSFER';

        if (isBankTransfer && !bankReference) {
            return NextResponse.json(
                { error: 'Por favor ingresa el número de referencia o comprobante bancario' },
                { status: 400 }
            );
        }

        // Caso 1: Depósito a la Billetera Fiat (Liquidez Disponible)
        if (purpose === 'WALLET_DEPOSIT' || !contractId) {
            const txRecord = await prisma.$transaction(async (tx) => {
                if (!isBankTransfer) {
                    // Stripe y Pasarela LATAM (PSE/Nequi) acreditan instantáneamente tras autorización
                    await tx.wallet.update({
                        where: { id: wallet.id },
                        data: {
                            fiatBalance: { increment: numericAmount },
                            totalDeposited: { increment: numericAmount },
                        },
                    });
                }

                const externalPrefix =
                    rail === 'STRIPE' ? 'pi_stripe_' : rail === 'LATAM_GATEWAY' ? 'wompi_tx_' : 'wire_';

                return tx.transaction.create({
                    data: {
                        userId,
                        walletId: wallet.id,
                        type: 'DEPOSIT_FIAT',
                        status: isBankTransfer ? 'PENDING' : 'COMPLETED',
                        paymentRail: rail,
                        amount: numericAmount,
                        fee: 0,
                        netAmount: numericAmount,
                        currency: 'USD',
                        externalId: `${externalPrefix}${Date.now()}`,
                        bankReference: bankReference || paymentMethodDetail || null,
                        receiptUrl: receiptUrl || null,
                        description: isBankTransfer
                            ? `Depósito por Transferencia Bancaria (Ref: ${bankReference}) — Pendiente de validación`
                            : `Depósito Fiat vía ${rail === 'STRIPE' ? 'Stripe' : 'Pasarela LATAM (PSE/Nequi)'}${paymentMethodDetail ? ` (${paymentMethodDetail})` : ''}`,
                    },
                });
            });

            return NextResponse.json({
                success: true,
                status: txRecord.status,
                message: isBankTransfer
                    ? 'Comprobante bancario registrado. Nuestro equipo de Tesorería acreditará tu saldo tras verificar la transferencia.'
                    : `¡Depósito de $${numericAmount.toLocaleString()} USD acreditado exitosamente en tu billetera!`,
                transaction: txRecord,
            });
        }

        // Caso 2: Inversión Directa en un Contrato Energético (PPA) con Fiat
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
                { error: `La inversión mínima en este proyecto es $${minInvestment.toLocaleString()} USD` },
                { status: 400 }
            );
        }

        if (maxInvestment > 0 && numericAmount > maxInvestment) {
            return NextResponse.json(
                { error: `La inversión máxima permitida es $${maxInvestment.toLocaleString()} USD` },
                { status: 400 }
            );
        }

        if (numericAmount > remainingCapacity) {
            return NextResponse.json(
                { error: `El proyecto solo dispone de $${remainingCapacity.toLocaleString()} USD de capacidad restante` },
                { status: 400 }
            );
        }

        const annualReturn = Number(contract.annualReturn) / 100;
        const expectedReturn = numericAmount * (1 + annualReturn);
        const earnedXp = Math.max(10, Math.floor(numericAmount / 10));

        const result = await prisma.$transaction(async (tx) => {
            const newInvestment = await tx.investment.create({
                data: {
                    userId,
                    contractId,
                    amount: numericAmount,
                    expectedReturn,
                    paymentRail: rail,
                    currency: localCurrency || 'USD',
                    status: isBankTransfer ? 'PENDING' : 'CONFIRMED',
                    confirmedAt: isBankTransfer ? null : new Date(),
                },
            });

            if (!isBankTransfer) {
                const newRaised = currentRaised + numericAmount;
                await tx.contract.update({
                    where: { id: contractId },
                    data: {
                        currentRaised: { increment: numericAmount },
                        ...(newRaised >= totalCapacity ? { status: 'FUNDED' } : {}),
                    },
                });

                // Otorgar XP de gamificación al inversor
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
            }

            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    walletId: wallet.id,
                    contractId,
                    investmentId: newInvestment.id,
                    type: 'INVESTMENT_PRIMARY',
                    status: isBankTransfer ? 'PENDING' : 'COMPLETED',
                    paymentRail: rail,
                    amount: numericAmount,
                    fee: 0,
                    netAmount: numericAmount,
                    currency: 'USD',
                    externalId: `${rail.toLowerCase()}_${Date.now()}`,
                    bankReference: bankReference || paymentMethodDetail || null,
                    receiptUrl: receiptUrl || null,
                    description: isBankTransfer
                        ? `Inversión por Transferencia Bancaria en ${contract.name} (Ref: ${bankReference})`
                        : `Inversión Fiat (${rail === 'STRIPE' ? 'Stripe' : 'PSE/LATAM'}) en ${contract.name}`,
                },
            });

            return { investment: newInvestment, transaction };
        });

        return NextResponse.json({
            success: true,
            status: result.investment.status,
            earnedXp: isBankTransfer ? 0 : earnedXp,
            message: isBankTransfer
                ? 'Inversión registrada como PENDIENTE. Se confirmará automáticamente en cuanto Tesorería valide tu transferencia bancaria.'
                : `¡Inversión de $${numericAmount.toLocaleString()} USD confirmada en ${contract.name}! (+${earnedXp} XP)`,
            investment: result.investment,
            transaction: result.transaction,
        });
    } catch (error) {
        console.error('Error in POST /api/payments/fiat:', error);
        return NextResponse.json(
            { error: 'Error al procesar el pago Fiat' },
            { status: 500 }
        );
    }
}
