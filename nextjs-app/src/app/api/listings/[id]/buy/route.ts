import { NextRequest, NextResponse } from 'next/server';
import { FEATURES } from '@/lib/features';
import { featureDisabled } from '@/lib/guards';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getOrCreateWallet, verifyOnChainTransaction, calculateUserLevel } from '@/lib/wallet';
import { getChainById } from '@/lib/web3-config';

// POST /api/listings/[id]/buy - Buy a secondary market position with full settlement
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!FEATURES.secondaryMarket) return featureDisabled('El mercado secundario');

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const buyerId = session.user.id;
    const { id } = await params;

    try {
        const body = await request.json().catch(() => ({}));
        const {
            paymentRail = 'INTERNAL_WALLET', // 'INTERNAL_WALLET' | 'STRIPE' | 'LATAM_GATEWAY' | 'WEB3_DIRECT'
            txHash,
            chainId = 137,
            tokenSymbol = 'USDC',
        } = body;

        const listing = await prisma.secondaryListing.findUnique({
            where: { id },
            include: {
                investment: {
                    include: {
                        contract: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!listing) {
            return NextResponse.json({ error: 'Posición no encontrada' }, { status: 404 });
        }

        if (listing.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Esta posición ya no está disponible' }, { status: 400 });
        }

        if (listing.sellerId === buyerId) {
            return NextResponse.json({ error: 'No puedes comprar tu propia posición' }, { status: 400 });
        }

        const askingPrice = Number(listing.askingPrice);
        const commission = Number(listing.commission);
        const sellerNetProceeds = Math.max(0, askingPrice - commission);

        const buyerWallet = await getOrCreateWallet(buyerId);
        const sellerWallet = await getOrCreateWallet(listing.sellerId);

        let deductFiat = 0;
        let deductCrypto = 0;

        if (paymentRail === 'INTERNAL_WALLET') {
            const fiatAvail = Number(buyerWallet.fiatBalance);
            const cryptoAvail = Number(buyerWallet.cryptoBalanceUsdc);
            const totalAvail = fiatAvail + cryptoAvail;

            if (totalAvail < askingPrice) {
                return NextResponse.json(
                    {
                        error: `Saldo insuficiente en tu Billetera ($${totalAvail.toLocaleString()} disponible). Selecciona pago con Tarjeta/PSE o Web3.`,
                        insufficientFunds: true,
                    },
                    { status: 400 }
                );
            }

            if (fiatAvail >= askingPrice) {
                deductFiat = askingPrice;
            } else {
                deductFiat = fiatAvail;
                deductCrypto = askingPrice - fiatAvail;
            }
        } else if (paymentRail === 'WEB3_DIRECT') {
            if (!txHash) {
                return NextResponse.json(
                    { error: 'Se requiere txHash para liquidación Web3' },
                    { status: 400 }
                );
            }
            const verification = await verifyOnChainTransaction(String(txHash), Number(chainId));
            if (!verification.verified) {
                return NextResponse.json(
                    { error: verification.reason || 'Transacción Web3 inválida' },
                    { status: 400 }
                );
            }
        }

        const chain = getChainById(Number(chainId));
        const earnedXp = Math.max(10, Math.floor(askingPrice / 10));

        await prisma.$transaction(async (tx) => {
            // 1. Si paga con Billetera Interna, descontar al comprador
            if (paymentRail === 'INTERNAL_WALLET') {
                await tx.wallet.update({
                    where: { id: buyerWallet.id },
                    data: {
                        ...(deductFiat > 0 ? { fiatBalance: { decrement: deductFiat } } : {}),
                        ...(deductCrypto > 0 ? { cryptoBalanceUsdc: { decrement: deductCrypto } } : {}),
                    },
                });
            }

            // 2. Acreditar el 97% (neto tras comisión del 3%) en la billetera del vendedor
            const creditSellerCrypto = paymentRail === 'WEB3_DIRECT' || deductCrypto > deductFiat;
            await tx.wallet.update({
                where: { id: sellerWallet.id },
                data: creditSellerCrypto
                    ? { cryptoBalanceUsdc: { increment: sellerNetProceeds } }
                    : { fiatBalance: { increment: sellerNetProceeds } },
            });

            // 3. Marcar listado como SOLD
            await tx.secondaryListing.update({
                where: { id },
                data: {
                    status: 'SOLD',
                    soldAt: new Date(),
                    buyerId,
                },
            });

            // 4. Marcar inversión original del vendedor como SOLD
            await tx.investment.update({
                where: { id: listing.investmentId },
                data: { status: 'SOLD' },
            });

            // 5. Crear nueva inversión confirmada para el comprador
            const buyerInvestment = await tx.investment.create({
                data: {
                    userId: buyerId,
                    contractId: listing.investment.contractId,
                    amount: listing.askingPrice,
                    status: 'CONFIRMED',
                    expectedReturn: listing.investment.expectedReturn,
                    paymentRail,
                    currency: creditSellerCrypto ? tokenSymbol : 'USD',
                    txHash: txHash ? String(txHash) : null,
                    confirmedAt: new Date(),
                },
            });

            // 6. Registrar transacción de compra para el comprador
            await tx.transaction.create({
                data: {
                    userId: buyerId,
                    walletId: buyerWallet.id,
                    contractId: listing.investment.contractId,
                    investmentId: buyerInvestment.id,
                    listingId: listing.id,
                    type: 'SECONDARY_PURCHASE',
                    status: 'COMPLETED',
                    paymentRail,
                    amount: askingPrice,
                    fee: 0,
                    netAmount: askingPrice,
                    currency: creditSellerCrypto ? tokenSymbol : 'USD',
                    chainId: paymentRail === 'WEB3_DIRECT' ? chain.chainId : null,
                    networkName: paymentRail === 'WEB3_DIRECT' ? chain.shortName : null,
                    txHash: txHash ? String(txHash) : null,
                    description: `Compra de posición en Mercado Secundario: ${listing.investment.contract.name}`,
                },
            });

            // 7. Registrar transacción de venta y liquidación para el vendedor
            await tx.transaction.create({
                data: {
                    userId: listing.sellerId,
                    walletId: sellerWallet.id,
                    contractId: listing.investment.contractId,
                    investmentId: listing.investmentId,
                    listingId: listing.id,
                    type: 'SECONDARY_SALE',
                    status: 'COMPLETED',
                    paymentRail,
                    amount: askingPrice,
                    fee: commission,
                    netAmount: sellerNetProceeds,
                    currency: creditSellerCrypto ? tokenSymbol : 'USD',
                    description: `Venta de posición en Mercado Secundario: ${listing.investment.contract.name} (Comisión 3%: $${commission.toFixed(2)})`,
                },
            });

            // 8. Otorgar XP al comprador
            const updatedBuyer = await tx.user.update({
                where: { id: buyerId },
                data: { points: { increment: earnedXp } },
            });
            const tier = calculateUserLevel(updatedBuyer.points);
            if (updatedBuyer.level !== tier.level || updatedBuyer.levelName !== tier.levelName) {
                await tx.user.update({
                    where: { id: buyerId },
                    data: { level: tier.level, levelName: tier.levelName },
                });
            }
        });

        return NextResponse.json({
            success: true,
            earnedXp,
            message: `¡Posición adquirida exitosamente en ${listing.investment.contract.name}! Los fondos han sido liquidados al vendedor. (+${earnedXp} XP)`,
        });
    } catch (error) {
        console.error('Error buying listing:', error);
        return NextResponse.json({ error: 'Error al procesar la compra en Mercado Secundario' }, { status: 500 });
    }
}
