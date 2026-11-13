import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrCreateWallet } from '@/lib/wallet';
import { getChainById } from '@/lib/web3-config';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const {
            amount,
            rail = 'BANK_TRANSFER', // 'BANK_TRANSFER' | 'WEB3_DIRECT'
            bankName,
            bankAccountNumber,
            bankAccountType,
            evmWalletAddress,
            chainId = 137,
            tokenSymbol = 'USDC',
        } = body;

        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount < 10) {
            return NextResponse.json(
                { error: 'El monto mínimo de retiro es $10 USD' },
                { status: 400 }
            );
        }

        const wallet = await getOrCreateWallet(session.user.id);
        const isCrypto = rail === 'WEB3_DIRECT';

        if (isCrypto) {
            const targetAddress = evmWalletAddress || wallet.evmWalletAddress;
            if (!targetAddress || !/^0x[a-fA-F0-9]{40}$/.test(targetAddress)) {
                return NextResponse.json(
                    { error: 'Ingresa una dirección de billetera EVM válida (0x...)' },
                    { status: 400 }
                );
            }
            if (Number(wallet.cryptoBalanceUsdc) < numericAmount) {
                return NextResponse.json(
                    { error: `Saldo Crypto insuficiente ($${Number(wallet.cryptoBalanceUsdc).toLocaleString()} USDC disponible)` },
                    { status: 400 }
                );
            }
        } else {
            const targetBank = bankName || wallet.bankName;
            const targetAccount = bankAccountNumber || wallet.bankAccountNumber;
            if (!targetBank || !targetAccount) {
                return NextResponse.json(
                    { error: 'Debes indicar el banco y número de cuenta destino' },
                    { status: 400 }
                );
            }
            if (Number(wallet.fiatBalance) < numericAmount) {
                return NextResponse.json(
                    { error: `Saldo Fiat insuficiente ($${Number(wallet.fiatBalance).toLocaleString()} USD disponible)` },
                    { status: 400 }
                );
            }
        }

        const chain = getChainById(Number(chainId));

        const transaction = await prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { id: wallet.id },
                data: isCrypto
                    ? {
                          cryptoBalanceUsdc: { decrement: numericAmount },
                          lockedBalance: { increment: numericAmount },
                          evmWalletAddress: evmWalletAddress || wallet.evmWalletAddress,
                          preferredChainId: Number(chainId),
                      }
                    : {
                          fiatBalance: { decrement: numericAmount },
                          lockedBalance: { increment: numericAmount },
                          bankName: bankName || wallet.bankName,
                          bankAccountNumber: bankAccountNumber || wallet.bankAccountNumber,
                          bankAccountType: bankAccountType || wallet.bankAccountType,
                      },
            });

            return tx.transaction.create({
                data: {
                    userId: session.user.id,
                    walletId: wallet.id,
                    type: isCrypto ? 'WITHDRAWAL_CRYPTO' : 'WITHDRAWAL_FIAT',
                    status: 'PENDING',
                    paymentRail: isCrypto ? 'WEB3_DIRECT' : 'BANK_TRANSFER',
                    amount: numericAmount,
                    fee: 0,
                    netAmount: numericAmount,
                    currency: isCrypto ? tokenSymbol : 'USD',
                    chainId: isCrypto ? chain.chainId : null,
                    networkName: isCrypto ? chain.shortName : null,
                    tokenSymbol: isCrypto ? tokenSymbol : null,
                    toAddress: isCrypto ? (evmWalletAddress || wallet.evmWalletAddress) : null,
                    bankReference: !isCrypto
                        ? `${bankName || wallet.bankName} • ${bankAccountType || wallet.bankAccountType || 'Ahorros'} • ${bankAccountNumber || wallet.bankAccountNumber}`
                        : null,
                    description: isCrypto
                        ? `Retiro de ${numericAmount.toLocaleString()} ${tokenSymbol} en red ${chain.shortName}`
                        : `Retiro bancario a ${bankName || wallet.bankName} (${bankAccountNumber || wallet.bankAccountNumber})`,
                },
            });
        });

        return NextResponse.json({
            success: true,
            message: 'Solicitud de retiro registrada. Tesorería procesará la transferencia en breve.',
            transaction,
        });
    } catch (error) {
        console.error('Error in POST /api/wallet/withdraw:', error);
        return NextResponse.json(
            { error: 'Error al procesar solicitud de retiro' },
            { status: 500 }
        );
    }
}
