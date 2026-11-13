'use client';

import { useState, useCallback } from 'react';
import {
    SUPPORTED_EVM_CHAINS,
    TREASURY_EVM_WALLET,
    encodeErc20Transfer,
    getChainById,
} from '@/lib/web3-config';

interface EthereumProvider {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    isMetaMask?: boolean;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

export function generateDemoTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash;
}

export function useWeb3Wallet(initialChainId = 137) {
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number>(initialChainId);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSendingTx, setIsSendingTx] = useState(false);
    const [walletProviderName, setWalletProviderName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = useCallback(async (preferSimulated = false) => {
        setIsConnecting(true);
        setError(null);
        try {
            if (!preferSimulated && typeof window !== 'undefined' && window.ethereum) {
                const accounts = (await window.ethereum.request({
                    method: 'eth_requestAccounts',
                })) as string[];

                if (accounts && accounts.length > 0) {
                    setAddress(accounts[0]);
                    setWalletProviderName(window.ethereum.isMetaMask ? 'MetaMask' : 'Web3 Wallet');

                    const currentChainHex = (await window.ethereum.request({
                        method: 'eth_chainId',
                    })) as string;
                    const parsedChain = parseInt(currentChainHex, 16);
                    if (SUPPORTED_EVM_CHAINS.some((c) => c.chainId === parsedChain)) {
                        setChainId(parsedChain);
                    }
                    return accounts[0];
                }
            }

            // Si no hay extensión Web3 instalada o el usuario elige Wallet Demo/WalletConnect Sandbox
            const demoAddress = '0x8F4920B7c1527A4E32D0946E853e721B2938471A';
            setAddress(demoAddress);
            setWalletProviderName('WalletConnect / Sandbox EVM');
            return demoAddress;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error al conectar billetera Web3';
            setError(msg);
            return null;
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const switchNetwork = useCallback(async (targetChainId: number) => {
        setChainId(targetChainId);
        setError(null);
        const chainConfig = getChainById(targetChainId);

        if (typeof window !== 'undefined' && window.ethereum && walletProviderName !== 'WalletConnect / Sandbox EVM') {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainConfig.hexChainId }],
                });
            } catch (switchErr: unknown) {
                const errObj = switchErr as { code?: number };
                if (errObj?.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: chainConfig.hexChainId,
                                    chainName: chainConfig.name,
                                    nativeCurrency: chainConfig.nativeCurrency,
                                    rpcUrls: [chainConfig.rpcUrl],
                                    blockExplorerUrls: [chainConfig.explorerUrl],
                                },
                            ],
                        });
                    } catch {
                        // Ignore add chain rejection and keep local chain selection
                    }
                }
            }
        }
    }, [walletProviderName]);

    const sendTokenPayment = useCallback(
        async ({
            amountUsd,
            tokenSymbol,
            targetChainId,
            toAddress = TREASURY_EVM_WALLET,
            simulateIfRejected = false,
        }: {
            amountUsd: number;
            tokenSymbol: 'USDC' | 'USDT';
            targetChainId: number;
            toAddress?: string;
            simulateIfRejected?: boolean;
        }): Promise<{ txHash: string; fromAddress: string } | null> => {
            setIsSendingTx(true);
            setError(null);
            try {
                let activeAddress = address;
                if (!activeAddress) {
                    activeAddress = await connectWallet(simulateIfRejected);
                }
                if (!activeAddress) {
                    throw new Error('Debes conectar tu billetera Web3 primero');
                }

                const chain = getChainById(targetChainId);
                const tokenContract = chain.tokens[tokenSymbol];
                const dataPayload = encodeErc20Transfer(toAddress, amountUsd, 6);

                if (
                    !simulateIfRejected &&
                    typeof window !== 'undefined' &&
                    window.ethereum &&
                    walletProviderName !== 'WalletConnect / Sandbox EVM'
                ) {
                    const txHash = (await window.ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                from: activeAddress,
                                to: tokenContract,
                                data: dataPayload,
                                value: '0x0',
                            },
                        ],
                    })) as string;

                    return { txHash, fromAddress: activeAddress };
                }

                // Simulación de firma criptográfica para pruebas sin gas / Sandbox
                await new Promise((resolve) => setTimeout(resolve, 900));
                const demoHash = generateDemoTxHash();
                return { txHash: demoHash, fromAddress: activeAddress };
            } catch (err) {
                const msg =
                    err instanceof Error
                        ? err.message
                        : 'La transacción fue cancelada o falló en la billetera';
                setError(msg);
                return null;
            } finally {
                setIsSendingTx(false);
            }
        },
        [address, connectWallet, walletProviderName]
    );

    return {
        address,
        chainId,
        walletProviderName,
        isConnecting,
        isSendingTx,
        error,
        connectWallet,
        switchNetwork,
        sendTokenPayment,
        setError,
    };
}
