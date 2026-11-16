import { prisma } from '@/lib/prisma';
import { getChainById } from '@/lib/web3-config';

export function calculateUserLevel(points: number): { level: number; levelName: string } {
    if (points >= 2500) return { level: 4, levelName: 'Titán Energético' };
    if (points >= 1000) return { level: 3, levelName: 'Magnate Verde' };
    if (points >= 300) return { level: 2, levelName: 'Solar Punk' };
    return { level: 1, levelName: 'Enchufado' };
}

export async function getOrCreateWallet(userId: string) {
    let wallet = await prisma.wallet.findUnique({
        where: { userId },
    });

    if (!wallet) {
        wallet = await prisma.wallet.create({
            data: {
                userId,
                fiatBalance: 0,
                cryptoBalanceUsdc: 0,
                lockedBalance: 0,
                totalDeposited: 0,
                totalWithdrawn: 0,
                totalYieldEarned: 0,
                preferredChainId: 137,
            },
        });
    }

    return wallet;
}

export interface OnChainVerificationResult {
    verified: boolean;
    isSimulated: boolean;
    blockNumber?: number;
    explorerLink: string;
    reason?: string;
}

export async function verifyOnChainTransaction(
    txHash: string,
    chainId: number = 137
): Promise<OnChainVerificationResult> {
    const chain = getChainById(chainId);
    const cleanHash = txHash.trim();
    const explorerLink = `${chain.explorerUrl}/tx/${cleanHash}`;

    // Validación de formato de hash EVM (0x + 64 hex chars)
    if (!/^0x[a-fA-F0-9]{64}$/.test(cleanHash)) {
        return {
            verified: false,
            isSimulated: false,
            explorerLink,
            reason: 'El hash de transacción (txHash) debe tener formato hexadecimal válido de 66 caracteres (0x...).',
        };
    }

    try {
        const response = await fetch(chain.rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getTransactionReceipt',
                params: [cleanHash],
            }),
            signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
            const payload = await response.json();
            if (payload?.result) {
                const receipt = payload.result;
                const succeeded = receipt.status === '0x1';
                return {
                    verified: succeeded,
                    isSimulated: false,
                    blockNumber: receipt.blockNumber ? parseInt(receipt.blockNumber, 16) : undefined,
                    explorerLink,
                    reason: succeeded ? undefined : 'La transacción fue revertida en la blockchain.',
                };
            }
        }
    } catch (err) {
        console.warn('RPC verification error:', err);
    }

    // Cierre seguro: si la red no confirma la transacción, NO se da por válida.
    return {
        verified: false,
        isSimulated: false,
        explorerLink,
        reason: 'La transacción aún no pudo verificarse en la blockchain. Intenta de nuevo en unos minutos.',
    };
}
