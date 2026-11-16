'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    SUPPORTED_EVM_CHAINS,
    TREASURY_EVM_WALLET,
    TREASURY_BANK_DETAILS,
    getChainById,
} from '@/lib/web3-config';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { FEATURES } from '@/lib/features';

interface Investment {
    id: string;
    amount: string;
    expectedReturn: string | null;
    accruedYield?: string | null;
    paymentRail?: string;
    currency?: string;
    txHash?: string | null;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED' | 'SOLD';
    createdAt: string;
    confirmedAt: string | null;
    contract: {
        id: string;
        name: string;
        annualReturn: string;
        energyType: string;
        generatorLocation: string;
        status: string;
    };
    listing?: {
        id: string;
        status: string;
        askingPrice: string;
    } | null;
}

interface WalletSummary {
    id: string;
    fiatBalance: number;
    cryptoBalanceUsdc: number;
    lockedBalance: number;
    totalAvailable: number;
    totalDeposited: number;
    totalWithdrawn: number;
    totalYieldEarned: number;
    evmWalletAddress: string | null;
    preferredChainId: number;
    bankName: string | null;
    bankAccountType: string | null;
    bankAccountNumber: string | null;
    bankRoutingOrSwift: string | null;
}

interface LedgerTransaction {
    id: string;
    type: string;
    status: string;
    paymentRail: string;
    amount: number;
    fee: number;
    netAmount: number;
    currency: string;
    description: string | null;
    txHash: string | null;
    chainId: number | null;
    networkName: string | null;
    tokenSymbol: string | null;
    receiptUrl: string | null;
    bankReference: string | null;
    contractId: string | null;
    contractName: string | null;
    createdAt: string;
}

const COMMISSION_RATE = 0.03;

export default function CarteraPage() {
    const [wallet, setWallet] = useState<WalletSummary>({
        id: '',
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
        bankAccountType: 'Ahorros',
        bankAccountNumber: null,
        bankRoutingOrSwift: null,
    });
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'investments' | 'ledger' | 'settings'>('investments');
    const [feedbackBanner, setFeedbackBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Deposit Modal States
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositTab, setDepositTab] = useState<'STRIPE' | 'LATAM_GATEWAY' | 'BANK_TRANSFER' | 'WEB3_DIRECT'>('STRIPE');
    const [depositAmount, setDepositAmount] = useState('500');
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [latamMethod, setLatamMethod] = useState('PSE - Bancolombia');
    const [bankReference, setBankReference] = useState('');
    const [receiptUrl, setReceiptUrl] = useState('');
    const [cryptoToken, setCryptoToken] = useState<'USDC' | 'USDT'>('USDC');
    const [manualTxHash, setManualTxHash] = useState('');
    const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);

    // Withdraw Modal States
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawRail, setWithdrawRail] = useState<'BANK_TRANSFER' | 'WEB3_DIRECT'>('BANK_TRANSFER');
    const [withdrawAmount, setWithdrawAmount] = useState('100');
    const [withdrawBankName, setWithdrawBankName] = useState('');
    const [withdrawAccountType, setWithdrawAccountType] = useState('Ahorros');
    const [withdrawAccountNumber, setWithdrawAccountNumber] = useState('');
    const [withdrawEvmAddress, setWithdrawEvmAddress] = useState('');
    const [withdrawChainId, setWithdrawChainId] = useState(137);
    const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

    // Sell Modal States
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [askingPrice, setAskingPrice] = useState<string>('');
    const [isSelling, setIsSelling] = useState(false);
    const [sellError, setSellError] = useState<string | null>(null);

    // Settings Form States
    const [settingsBankName, setSettingsBankName] = useState('');
    const [settingsAccountType, setSettingsAccountType] = useState('Ahorros');
    const [settingsAccountNumber, setSettingsAccountNumber] = useState('');
    const [settingsSwift, setSettingsSwift] = useState('');
    const [settingsEvmAddress, setSettingsEvmAddress] = useState('');
    const [settingsChainId, setSettingsChainId] = useState(137);
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    // Web3 Hook
    const {
        address: connectedWeb3Address,
        chainId: selectedWeb3Chain,
        walletProviderName,
        isConnecting: isConnectingWeb3,
        isSendingTx,
        error: web3Error,
        connectWallet,
        switchNetwork,
        sendTokenPayment,
    } = useWeb3Wallet(137);

    const fetchWalletData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/wallet');
            if (res.ok) {
                const data = await res.json();
                if (data.wallet) {
                    setWallet(data.wallet);
                    setWithdrawBankName(data.wallet.bankName || '');
                    setWithdrawAccountType(data.wallet.bankAccountType || 'Ahorros');
                    setWithdrawAccountNumber(data.wallet.bankAccountNumber || '');
                    setWithdrawEvmAddress(data.wallet.evmWalletAddress || '');
                    setWithdrawChainId(data.wallet.preferredChainId || 137);

                    setSettingsBankName(data.wallet.bankName || '');
                    setSettingsAccountType(data.wallet.bankAccountType || 'Ahorros');
                    setSettingsAccountNumber(data.wallet.bankAccountNumber || '');
                    setSettingsSwift(data.wallet.bankRoutingOrSwift || '');
                    setSettingsEvmAddress(data.wallet.evmWalletAddress || '');
                    setSettingsChainId(data.wallet.preferredChainId || 137);
                }
                setInvestments(data.investments || []);
                setTransactions(data.transactions || []);
            }
        } catch (err) {
            console.error('Error fetching wallet:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleFiatDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = Number(depositAmount);
        if (!numAmount || numAmount <= 0) return;

        setIsProcessingDeposit(true);
        setFeedbackBanner(null);

        try {
            const methodLabel =
                depositTab === 'STRIPE'
                    ? `Tarjeta •••• ${cardNumber.slice(-4) || '4242'}`
                    : depositTab === 'LATAM_GATEWAY'
                    ? latamMethod
                    : bankReference;

            const res = await fetch('/api/payments/fiat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: numAmount,
                    rail: depositTab,
                    purpose: 'WALLET_DEPOSIT',
                    paymentMethodDetail: methodLabel,
                    bankReference: depositTab === 'BANK_TRANSFER' ? bankReference : methodLabel,
                    receiptUrl: receiptUrl || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al procesar depósito Fiat');

            setShowDepositModal(false);
            setBankReference('');
            setReceiptUrl('');
            setFeedbackBanner({ type: 'success', text: data.message });
            await fetchWalletData();
        } catch (err) {
            setFeedbackBanner({
                type: 'error',
                text: err instanceof Error ? err.message : 'Error al procesar depósito',
            });
        } finally {
            setIsProcessingDeposit(false);
        }
    };

    const handleCryptoDeposit = async (simulateMode = false) => {
        const numAmount = Number(depositAmount);
        if (!numAmount || numAmount <= 0) return;

        setIsProcessingDeposit(true);
        setFeedbackBanner(null);

        try {
            let finalHash = manualTxHash.trim();
            let senderAddress = connectedWeb3Address || wallet.evmWalletAddress || '';

            if (!finalHash) {
                const paymentResult = await sendTokenPayment({
                    amountUsd: numAmount,
                    tokenSymbol: cryptoToken,
                    targetChainId: selectedWeb3Chain,
                    toAddress: TREASURY_EVM_WALLET,
                    simulateIfRejected: simulateMode,
                });

                if (!paymentResult) {
                    setIsProcessingDeposit(false);
                    return;
                }
                finalHash = paymentResult.txHash;
                senderAddress = paymentResult.fromAddress;
            }

            const res = await fetch('/api/payments/crypto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: numAmount,
                    chainId: selectedWeb3Chain,
                    tokenSymbol: cryptoToken,
                    txHash: finalHash,
                    fromAddress: senderAddress,
                    purpose: 'WALLET_DEPOSIT',
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al verificar depósito cripto');

            setShowDepositModal(false);
            setManualTxHash('');
            setFeedbackBanner({ type: 'success', text: data.message });
            await fetchWalletData();
        } catch (err) {
            setFeedbackBanner({
                type: 'error',
                text: err instanceof Error ? err.message : 'Error en depósito Web3',
            });
        } finally {
            setIsProcessingDeposit(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessingWithdraw(true);
        setFeedbackBanner(null);

        try {
            const res = await fetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Number(withdrawAmount),
                    rail: withdrawRail,
                    bankName: withdrawBankName,
                    bankAccountType: withdrawAccountType,
                    bankAccountNumber: withdrawAccountNumber,
                    evmWalletAddress: withdrawEvmAddress || connectedWeb3Address,
                    chainId: withdrawChainId,
                    tokenSymbol: 'USDC',
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al solicitar retiro');

            setShowWithdrawModal(false);
            setFeedbackBanner({ type: 'success', text: data.message });
            await fetchWalletData();
        } catch (err) {
            setFeedbackBanner({
                type: 'error',
                text: err instanceof Error ? err.message : 'Error al procesar retiro',
            });
        } finally {
            setIsProcessingWithdraw(false);
        }
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSettings(true);
        setFeedbackBanner(null);
        try {
            const res = await fetch('/api/wallet', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bankName: settingsBankName,
                    bankAccountType: settingsAccountType,
                    bankAccountNumber: settingsAccountNumber,
                    bankRoutingOrSwift: settingsSwift,
                    evmWalletAddress: settingsEvmAddress || connectedWeb3Address,
                    preferredChainId: settingsChainId,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al guardar configuración');
            setFeedbackBanner({
                type: 'success',
                text: 'Configuración de cuentas bancarias y billetera Web3 guardada correctamente.',
            });
            await fetchWalletData();
        } catch (err) {
            setFeedbackBanner({
                type: 'error',
                text: err instanceof Error ? err.message : 'Error al guardar',
            });
        } finally {
            setIsSavingSettings(false);
        }
    };

    const openSellModal = (investment: Investment) => {
        setSelectedInvestment(investment);
        setAskingPrice(Number(investment.amount).toString());
        setSellError(null);
    };

    const handleSell = async () => {
        if (!selectedInvestment || !askingPrice) return;
        setIsSelling(true);
        setSellError(null);

        try {
            const res = await fetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    investmentId: selectedInvestment.id,
                    askingPrice: parseFloat(askingPrice),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al poner en venta');

            setSelectedInvestment(null);
            setFeedbackBanner({
                type: 'success',
                text: 'Tu posición ha sido publicada en el Mercado Secundario. Recibirás el 97% directo en tu Billetera en cuanto un inversor la adquiera.',
            });
            await fetchWalletData();
        } catch (err) {
            setSellError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSelling(false);
        }
    };

    const handleCancelListing = async (listingId: string) => {
        try {
            const res = await fetch(`/api/listings/${listingId}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al cancelar venta');
            setFeedbackBanner({ type: 'success', text: data.message });
            await fetchWalletData();
        } catch (err) {
            setFeedbackBanner({
                type: 'error',
                text: err instanceof Error ? err.message : 'Error al cancelar listado',
            });
        }
    };

    const activeInvestments = investments.filter((i) => i.status === 'CONFIRMED');
    const totalInvested = activeInvestments.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExpectedReturn = activeInvestments.reduce((sum, i) => sum + Number(i.expectedReturn || 0), 0);
    const priceNum = parseFloat(askingPrice) || 0;
    const commissionAmount = priceNum * COMMISSION_RATE;
    const netReceived = priceNum - commissionAmount;

    const getEnergyIcon = (type: string) => {
        const icons: Record<string, string> = {
            SOLAR: 'solar_power',
            WIND_ONSHORE: 'air',
            WIND_OFFSHORE: 'wind_power',
            HYDRO: 'water_drop',
            BIOMASS: 'eco',
        };
        return icons[type] || 'bolt';
    };

    const getStatusBadge = (inv: Investment) => {
        if (inv.listing && inv.listing.status === 'ACTIVE') {
            return (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                    En Venta (${Number(inv.listing.askingPrice).toLocaleString()})
                </span>
            );
        }
        const map: Record<string, { bg: string; label: string }> = {
            CONFIRMED: { bg: 'bg-green-100 text-green-800 border-green-200', label: 'Activa • Generando' },
            PENDING: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pendiente Aprobación' },
            SOLD: { bg: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Vendida (Secundario)' },
            CANCELLED: { bg: 'bg-red-100 text-red-700 border-red-200', label: 'Cancelada' },
        };
        const c = map[inv.status] || { bg: 'bg-gray-100 text-gray-700', label: inv.status };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${c.bg}`}>{c.label}</span>;
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/30 text-black uppercase tracking-wider">
                                Inversiones en pesos colombianos
                            </span>
                            {(connectedWeb3Address || wallet.evmWalletAddress) && (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                    EVM: {(connectedWeb3Address || wallet.evmWalletAddress)?.slice(0, 6)}...
                                    {(connectedWeb3Address || wallet.evmWalletAddress)?.slice(-4)}
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                            Mi Cartera y Liquidez Energética
                        </h1>
                        <p className="text-sm text-slate-500">
                            Consulta tus inversiones en pesos colombianos (COP) y el estado de cada transferencia.
                        </p>
                    </div>

                    {(FEATURES.walletDeposits || FEATURES.withdrawals) && (
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => {
                                setDepositTab('STRIPE');
                                setShowDepositModal(true);
                            }}
                            className="px-5 py-2.5 bg-primary hover:brightness-95 text-black font-bold rounded-xl shadow-xs flex items-center gap-2 text-sm transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">add_card</span>
                            Depositar Fondos
                        </button>
                        <button
                            onClick={() => {
                                setDepositTab('WEB3_DIRECT');
                                setShowDepositModal(true);
                            }}
                            className="px-4 py-2.5 bg-black hover:bg-slate-800 text-primary font-bold rounded-xl shadow-xs flex items-center gap-2 text-sm transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">token</span>
                            Depositar Crypto
                        </button>
                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-slate-800 font-bold rounded-xl flex items-center gap-2 text-sm transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">north_east</span>
                            Retirar
                        </button>
                    </div>
                    )}
                </div>

                {/* Feedback Banner */}
                {feedbackBanner && (
                    <div
                        className={`p-4 rounded-xl border flex items-center justify-between ${
                            feedbackBanner.type === 'success'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                    >
                        <div className="flex items-center gap-2.5 text-sm font-medium">
                            <span className="material-symbols-outlined">
                                {feedbackBanner.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            <span>{feedbackBanner.text}</span>
                        </div>
                        <button onClick={() => setFeedbackBanner(null)} className="opacity-70 hover:opacity-100">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}

                {/* 4 Financial Summary Cards */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${FEATURES.internalWallet ? 'lg:grid-cols-4' : ''}`}>
                    {FEATURES.internalWallet && (
                    <>
                    {/* Card 1: Fiat Liquidity */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Liquidez Fiat (USD)
                            </span>
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <span className="material-symbols-outlined text-[20px]">account_balance</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-slate-900">
                                ${wallet.fiatBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Tarjeta / PSE / Transferencia Bancaria
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Crypto Liquidity */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Liquidez Web3 (USDC)
                            </span>
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                                <span className="material-symbols-outlined text-[20px]">currency_bitcoin</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-slate-900">
                                ${wallet.cryptoBalanceUsdc.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                <span className="text-xs font-bold text-purple-600 ml-1.5">USDC</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Polygon • Base • Arbitrum • Ethereum
                            </p>
                        </div>
                    </div>

                    </>
                    )}

                    {/* Card 3: Active PPA Portfolio */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Capital en Contratos PPA
                            </span>
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <span className="material-symbols-outlined text-[20px]">solar_power</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-slate-900">
                                ${totalInvested.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {activeInvestments.length} contrato{activeInvestments.length !== 1 ? 's' : ''} activo{activeInvestments.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {/* Card 4: Returns & Accrued Yield */}
                    <div className="bg-black text-white rounded-2xl p-6 border border-slate-800 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Retorno Proyectado Total
                            </span>
                            <div className="p-2 rounded-lg bg-primary text-black">
                                <span className="material-symbols-outlined text-[20px]">trending_up</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-primary">
                                ${totalExpectedReturn.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                                Ganancia neta est.: +${Math.max(0, totalExpectedReturn - totalInvested).toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                    <button
                        onClick={() => setActiveTab('investments')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                            activeTab === 'investments'
                                ? 'bg-black text-primary shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        Mis Inversiones PPA ({investments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('ledger')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                            activeTab === 'ledger'
                                ? 'bg-black text-primary shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        Historial de Transacciones ({transactions.length})
                    </button>
                    {FEATURES.withdrawals && (
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                            activeTab === 'settings'
                                ? 'bg-black text-primary shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                        Cuentas de Retiro y Wallet Web3
                    </button>
                    )}
                </div>

                {/* TAB 1: MIS INVERSIONES */}
                {activeTab === 'investments' && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Portafolio de Contratos Energéticos</h2>
                                <p className="text-xs text-slate-500">
                                    Aquí ves cada inversión y su estado: pendiente mientras Tesorería valida tu transferencia, confirmada cuando el abono queda verificado.
                                </p>
                            </div>
                            <Link
                                href="/mercado-primario"
                                className="px-4 py-2 bg-primary hover:brightness-95 text-black text-xs font-bold rounded-lg inline-flex items-center gap-1.5 self-start sm:self-auto"
                            >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                                Invertir en Nuevo Proyecto
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center text-slate-400">Cargando portafolio...</div>
                        ) : investments.length === 0 ? (
                            <div className="p-12 text-center">
                                <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
                                    solar_power
                                </span>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Aún no tienes inversiones activas</h3>
                                <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                                    Deposita fondos en USD o USDC, o invierte directamente en un contrato de compra de energía (PPA) verificada.
                                </p>
                                <Link
                                    href="/mercado-primario"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:brightness-95"
                                >
                                    Explorar Mercado Primario
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-gray-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                                            <th className="px-6 py-4">Contrato PPA</th>
                                            <th className="px-6 py-4">Capital Invertido</th>
                                            <th className="px-6 py-4">TIR Anual</th>
                                            <th className="px-6 py-4">Retorno Esperado</th>
                                            <th className="px-6 py-4">Riel de Pago</th>
                                            <th className="px-6 py-4">Estado</th>
                                            <th className="px-6 py-4 text-right">Liquidez / Secundario</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {investments.map((inv) => {
                                            const canSell =
                                                inv.status === 'CONFIRMED' &&
                                                (!inv.listing || inv.listing.status !== 'ACTIVE');
                                            const hasActiveListing = inv.listing && inv.listing.status === 'ACTIVE';

                                            return (
                                                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={`/contrato/${inv.contract.id}`}
                                                            className="flex items-center gap-3 group"
                                                        >
                                                            <div className="p-2.5 bg-primary/20 rounded-xl text-black">
                                                                <span className="material-symbols-outlined">
                                                                    {getEnergyIcon(inv.contract.energyType)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                                    {inv.contract.name}
                                                                </div>
                                                                <div className="text-xs text-slate-500">
                                                                    {inv.contract.generatorLocation}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 font-black text-slate-900">
                                                        ${Number(inv.amount).toLocaleString('es-CO', { maximumFractionDigits: 0 })}{' '}
                                                        <span className="text-xs font-normal text-slate-500">
                                                            {inv.currency || 'USD'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                                        {Number(inv.contract.annualReturn)}%
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-800">
                                                        ${Number(inv.expectedReturn || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                                                            {inv.paymentRail === 'WEB3_DIRECT'
                                                                ? 'Web3 On-Chain'
                                                                : inv.paymentRail === 'STRIPE'
                                                                ? 'Stripe Card'
                                                                : inv.paymentRail === 'LATAM_GATEWAY'
                                                                ? 'PSE / LATAM'
                                                                : inv.paymentRail === 'BANK_TRANSFER'
                                                                ? 'Transferencia'
                                                                : 'Billetera Watt'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">{getStatusBadge(inv)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        {FEATURES.secondaryMarket && canSell && (
                                                            <button
                                                                onClick={() => openSellModal(inv)}
                                                                className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                            >
                                                                Vender Posición
                                                            </button>
                                                        )}
                                                        {hasActiveListing && inv.listing && (
                                                            <button
                                                                onClick={() => handleCancelListing(inv.listing!.id)}
                                                                className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                            >
                                                                Cancelar Venta
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: LIBRO MAYOR DE TRANSACCIONES */}
                {activeTab === 'ledger' && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-slate-900">
                                Libro Mayor de Movimientos (Fiat + Blockchain)
                            </h2>
                            <p className="text-xs text-slate-500">
                                Registro auditable de depósitos, retiros, inversiones en contratos PPA, mercado secundario y pago de rendimientos.
                            </p>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
                                No hay movimientos registrados aún en tu billetera.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-gray-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                                            <th className="px-6 py-4">Fecha</th>
                                            <th className="px-6 py-4">Concepto</th>
                                            <th className="px-6 py-4">Riel / Red</th>
                                            <th className="px-6 py-4">Monto Neto</th>
                                            <th className="px-6 py-4">Estado</th>
                                            <th className="px-6 py-4">Verificación</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {transactions.map((tx) => {
                                            const isPositive = [
                                                'DEPOSIT_FIAT',
                                                'DEPOSIT_CRYPTO',
                                                'SECONDARY_SALE',
                                                'YIELD_DISTRIBUTION',
                                                'REFUND',
                                            ].includes(tx.type);
                                            const chain = tx.chainId ? getChainById(tx.chainId) : null;

                                            return (
                                                <tr key={tx.id} className="hover:bg-slate-50/80">
                                                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                                                        {new Date(tx.createdAt).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900">
                                                            {tx.description || tx.type}
                                                        </div>
                                                        {tx.contractName && (
                                                            <div className="text-xs text-slate-500">
                                                                Proyecto: {tx.contractName}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                                                            {tx.paymentRail}
                                                            {tx.networkName ? ` • ${tx.networkName}` : ''}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className={`px-6 py-4 font-black whitespace-nowrap ${
                                                            isPositive ? 'text-emerald-600' : 'text-slate-900'
                                                        }`}
                                                    >
                                                        {isPositive ? '+' : '-'}$
                                                        {tx.netAmount.toLocaleString('en-US', {
                                                            minimumFractionDigits: 2,
                                                        })}{' '}
                                                        <span className="text-xs font-bold">{tx.currency}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                                tx.status === 'COMPLETED'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : tx.status === 'PENDING'
                                                                    ? 'bg-amber-100 text-amber-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}
                                                        >
                                                            {tx.status === 'COMPLETED'
                                                                ? 'Confirmado'
                                                                : tx.status === 'PENDING'
                                                                ? 'En Revisión'
                                                                : tx.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs">
                                                        {tx.txHash && chain ? (
                                                            <a
                                                                href={`${chain.explorerUrl}/tx/${tx.txHash}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 font-mono text-purple-700 hover:underline bg-purple-50 px-2 py-1 rounded"
                                                            >
                                                                {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
                                                                <span className="material-symbols-outlined text-[14px]">
                                                                    open_in_new
                                                                </span>
                                                            </a>
                                                        ) : tx.bankReference ? (
                                                            <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                                Ref: {tx.bankReference}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400">Liquidación Interna</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: CONFIGURACIÓN BANCARIA & WEB3 */}
                {activeTab === 'settings' && (
                    <form
                        onSubmit={handleSaveSettings}
                        className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 md:p-8 space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cuenta Bancaria para Retiros Fiat */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="material-symbols-outlined text-emerald-600">account_balance</span>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Cuenta Bancaria para Retiros Fiat
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Configura la cuenta donde recibirás tus retiros en moneda local o USD vía transferencia ACH/SWIFT.
                                </p>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        Entidad Bancaria
                                    </label>
                                    <input
                                        type="text"
                                        value={settingsBankName}
                                        onChange={(e) => setSettingsBankName(e.target.value)}
                                        placeholder="Ej. Bancolombia, BBVA, Mercury, Chase..."
                                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            Tipo de Cuenta
                                        </label>
                                        <select
                                            value={settingsAccountType}
                                            onChange={(e) => setSettingsAccountType(e.target.value)}
                                            className="w-full h-11 px-3 rounded-xl border border-gray-300 text-sm bg-white"
                                        >
                                            <option value="Ahorros">Ahorros</option>
                                            <option value="Corriente">Corriente / Checking</option>
                                            <option value="IBAN">IBAN Europeo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            ABA / SWIFT (Opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={settingsSwift}
                                            onChange={(e) => setSettingsSwift(e.target.value)}
                                            placeholder="COLOCOBM / Routing"
                                            className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        Número de Cuenta / CLABE / IBAN
                                    </label>
                                    <input
                                        type="text"
                                        value={settingsAccountNumber}
                                        onChange={(e) => setSettingsAccountNumber(e.target.value)}
                                        placeholder="000-000000-00"
                                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm font-mono"
                                    />
                                </div>
                            </div>

                            {/* Billetera Web3 para Retiros y Dividendos USDC */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-purple-600">token</span>
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Billetera Web3 EVM (USDC / USDT)
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const addr = await connectWallet();
                                            if (addr) setSettingsEvmAddress(addr);
                                        }}
                                        className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        {isConnectingWeb3 ? 'Conectando...' : 'Autocompletar con MetaMask'}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Dirección compatible con redes EVM para recibir rendimientos en USDC y retiros instantáneos.
                                </p>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        Dirección Pública EVM (0x...)
                                    </label>
                                    <input
                                        type="text"
                                        value={settingsEvmAddress}
                                        onChange={(e) => setSettingsEvmAddress(e.target.value)}
                                        placeholder="0x..."
                                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        Red Blockchain Preferida para Pagos
                                    </label>
                                    <select
                                        value={settingsChainId}
                                        onChange={(e) => setSettingsChainId(Number(e.target.value))}
                                        className="w-full h-11 px-3 rounded-xl border border-gray-300 text-sm bg-white font-medium"
                                    >
                                        {SUPPORTED_EVM_CHAINS.map((c) => (
                                            <option key={c.chainId} value={c.chainId}>
                                                {c.name} (Chain ID: {c.chainId})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSavingSettings}
                                className="px-6 py-3 bg-primary hover:brightness-95 text-black font-bold rounded-xl shadow-xs text-sm disabled:opacity-50 cursor-pointer"
                            >
                                {isSavingSettings ? 'Guardando...' : 'Guardar Configuración Financiera'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* MODAL 1: DEPOSITAR FONDOS (FIAT + CRYPTO) */}
            {showDepositModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-gray-200 my-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Depositar Fondos en Billetera</h3>
                                <p className="text-xs text-slate-500">
                                    Elige tu riel de fondeo preferido: Fiat tradicional o Criptomonedas Web3.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDepositModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Selector de Riel */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                            {([
                                { key: 'STRIPE', label: 'Tarjeta / ACH', icon: 'credit_card' },
                                { key: 'LATAM_GATEWAY', label: 'PSE / Nequi', icon: 'Bolt' },
                                { key: 'BANK_TRANSFER', label: 'Transferencia', icon: 'account_balance' },
                                { key: 'WEB3_DIRECT', label: 'Crypto Web3', icon: 'token' },
                            ] as const).map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setDepositTab(tab.key)}
                                    className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                                        depositTab === tab.key
                                            ? 'bg-black text-primary border-black font-bold shadow-xs'
                                            : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                                    <span className="text-xs font-bold">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Input de Monto Común */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                Monto a Depositar ({depositTab === 'WEB3_DIRECT' ? cryptoToken : 'USD Equivalent'})
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                                    $
                                </span>
                                <input
                                    type="number"
                                    min="10"
                                    step="10"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    className="w-full h-13 pl-9 pr-20 rounded-xl border border-gray-300 text-xl font-black text-slate-900 focus:ring-2 focus:ring-primary"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                                    {depositTab === 'WEB3_DIRECT' ? cryptoToken : 'USD'}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                {[100, 500, 1000, 5000].map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setDepositAmount(String(preset))}
                                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-primary/30 text-xs font-bold text-slate-700 transition-colors"
                                    >
                                        +${preset.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {depositTab !== 'WEB3_DIRECT' ? (
                            <form onSubmit={handleFiatDeposit} className="space-y-4">
                                {depositTab === 'STRIPE' && (
                                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-700">
                                                Pasarela Global Stripe (Visa, Mastercard, Amex, Apple Pay)
                                            </span>
                                            <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                                                Acreditación Instantánea
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={cardHolder}
                                            onChange={(e) => setCardHolder(e.target.value)}
                                            placeholder="Nombre en la tarjeta"
                                            className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm"
                                        />
                                        <input
                                            type="text"
                                            required
                                            maxLength={19}
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            placeholder="4242 •••• •••• 4242"
                                            className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-mono"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                required
                                                placeholder="MM/AA"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-mono"
                                            />
                                            <input
                                                type="text"
                                                required
                                                maxLength={4}
                                                placeholder="CVC"
                                                value={cardCvc}
                                                onChange={(e) => setCardCvc(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-mono"
                                            />
                                        </div>
                                    </div>
                                )}

                                {depositTab === 'LATAM_GATEWAY' && (
                                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-700">
                                                Wompi / MercadoPago (PSE, Nequi, Bancolombia, SPEI)
                                            </span>
                                            <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                                                0% Comisión
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Selecciona tu medio de pago local:
                                            </label>
                                            <select
                                                value={latamMethod}
                                                onChange={(e) => setLatamMethod(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-medium"
                                            >
                                                <option value="PSE - Bancolombia">PSE — Bancolombia</option>
                                                <option value="PSE - Davivienda">PSE — Davivienda</option>
                                                <option value="PSE - Banco de Bogotá">PSE — Banco de Bogotá</option>
                                                <option value="Nequi Instantáneo">Billetera Nequi</option>
                                                <option value="SPEI México">Transferencia SPEI (México)</option>
                                            </select>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Equivalente aproximado en moneda local:{' '}
                                            <strong className="text-slate-800">
                                                ${(Number(depositAmount || 0) * 4150).toLocaleString()} COP
                                            </strong>{' '}
                                            (Tasa TRM referencial: $4,150 COP/USD).
                                        </p>
                                    </div>
                                )}

                                {depositTab === 'BANK_TRANSFER' && (
                                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                                        <div className="text-xs space-y-1 bg-white p-3 rounded-lg border border-gray-200">
                                            <p className="font-bold text-slate-900">
                                                Datos de Tesorería Wattismoney SPV:
                                            </p>
                                            <p className="text-slate-600">
                                                <strong>Banco:</strong> {TREASURY_BANK_DETAILS.bankName}
                                            </p>
                                            <p className="text-slate-600">
                                                <strong>Cuenta:</strong> {TREASURY_BANK_DETAILS.accountNumber}
                                            </p>
                                            <p className="text-slate-600">
                                                <strong>Beneficiario:</strong> {TREASURY_BANK_DETAILS.beneficiary} (NIT{' '}
                                                {TREASURY_BANK_DETAILS.beneficiaryId})
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Número de Referencia / Comprobante Bancario *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={bankReference}
                                                onChange={(e) => setBankReference(e.target.value)}
                                                placeholder="Ej. CUS-99481023 o # de comprobante"
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Enlace al Comprobante PDF/Imagen (Opcional)
                                            </label>
                                            <input
                                                type="url"
                                                value={receiptUrl}
                                                onChange={(e) => setReceiptUrl(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isProcessingDeposit}
                                    className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isProcessingDeposit
                                        ? 'Procesando Depósito...'
                                        : depositTab === 'BANK_TRANSFER'
                                        ? 'Notificar Transferencia a Tesorería'
                                        : `Depositar $${Number(depositAmount || 0).toLocaleString()} USD Ahora`}
                                </button>
                            </form>
                        ) : (
                            /* WEB3 DIRECT DEPOSIT */
                            <div className="space-y-4">
                                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                            Smart Contract / Tesorería Web3
                                        </span>
                                        {connectedWeb3Address ? (
                                            <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded text-emerald-300">
                                                {walletProviderName}: {connectedWeb3Address.slice(0, 6)}...
                                                {connectedWeb3Address.slice(-4)}
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => connectWallet(false)}
                                                className="text-xs bg-primary text-black font-bold px-3 py-1 rounded-lg hover:brightness-95"
                                            >
                                                {isConnectingWeb3 ? 'Conectando...' : 'Conectar MetaMask / Wallet'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">
                                                Red Blockchain
                                            </label>
                                            <select
                                                value={selectedWeb3Chain}
                                                onChange={(e) => switchNetwork(Number(e.target.value))}
                                                className="w-full h-10 px-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                                            >
                                                {SUPPORTED_EVM_CHAINS.map((c) => (
                                                    <option key={c.chainId} value={c.chainId}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">
                                                Stablecoin
                                            </label>
                                            <select
                                                value={cryptoToken}
                                                onChange={(e) => setCryptoToken(e.target.value as 'USDC' | 'USDT')}
                                                className="w-full h-10 px-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                                            >
                                                <option value="USDC">USDC (USD Coin)</option>
                                                <option value="USDT">USDT (Tether USD)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="text-[11px] text-gray-300 bg-black/40 p-2.5 rounded-lg font-mono break-all">
                                        Tesorería Destino: {TREASURY_EVM_WALLET}
                                    </div>
                                </div>

                                {web3Error && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                                        {web3Error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        disabled={isProcessingDeposit || isSendingTx}
                                        onClick={() => handleCryptoDeposit(false)}
                                        className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                                        {isSendingTx || isProcessingDeposit
                                            ? 'Firmando en Billetera Web3...'
                                            : `Firmar y Depositar ${Number(depositAmount || 0).toLocaleString()} ${cryptoToken}`}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isProcessingDeposit || isSendingTx}
                                        onClick={() => handleCryptoDeposit(true)}
                                        className="w-full h-10 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                                    >
                                        ⚡ Simular Firma On-Chain Instantánea (Modo Demo / Testnet sin Gas)
                                    </button>
                                </div>

                                <div className="pt-3 border-t border-gray-200">
                                    <label className="block text-xs font-bold text-slate-600 mb-1">
                                        ¿Ya enviaste los {cryptoToken} desde un Exchange (Binance/Coinbase)? Pega tu txHash:
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={manualTxHash}
                                            onChange={(e) => setManualTxHash(e.target.value)}
                                            placeholder="0x..."
                                            className="flex-1 h-10 px-3 rounded-lg border border-gray-300 text-xs font-mono"
                                        />
                                        {manualTxHash && (
                                            <button
                                                type="button"
                                                onClick={() => handleCryptoDeposit(false)}
                                                className="px-4 h-10 bg-black text-primary text-xs font-bold rounded-lg"
                                            >
                                                Verificar Hash
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL 2: RETIRAR FONDOS */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black text-slate-900">Retirar Fondos</h3>
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-5">
                            <button
                                type="button"
                                onClick={() => setWithdrawRail('BANK_TRANSFER')}
                                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                                    withdrawRail === 'BANK_TRANSFER'
                                        ? 'bg-black text-primary border-black'
                                        : 'bg-slate-50 text-slate-600 border-gray-200'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[16px]">account_balance</span>
                                Banco Fiat (${wallet.fiatBalance.toLocaleString()})
                            </button>
                            <button
                                type="button"
                                onClick={() => setWithdrawRail('WEB3_DIRECT')}
                                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                                    withdrawRail === 'WEB3_DIRECT'
                                        ? 'bg-black text-primary border-black'
                                        : 'bg-slate-50 text-slate-600 border-gray-200'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[16px]">token</span>
                                Wallet USDC (${wallet.cryptoBalanceUsdc.toLocaleString()})
                            </button>
                        </div>

                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Monto a Retirar ({withdrawRail === 'WEB3_DIRECT' ? 'USDC' : 'USD'})
                                </label>
                                <input
                                    type="number"
                                    min="10"
                                    step="0.01"
                                    required
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-lg font-black"
                                />
                            </div>

                            {withdrawRail === 'BANK_TRANSFER' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            Banco Destino
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={withdrawBankName}
                                            onChange={(e) => setWithdrawBankName(e.target.value)}
                                            placeholder="Bancolombia, BBVA, Mercury..."
                                            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            Número de Cuenta / IBAN
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={withdrawAccountNumber}
                                            onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                                            placeholder="Número de cuenta bancaria"
                                            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm font-mono"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            Red EVM Destino
                                        </label>
                                        <select
                                            value={withdrawChainId}
                                            onChange={(e) => setWithdrawChainId(Number(e.target.value))}
                                            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm bg-white"
                                        >
                                            {SUPPORTED_EVM_CHAINS.map((c) => (
                                                <option key={c.chainId} value={c.chainId}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            Dirección de Billetera EVM (0x...)
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={withdrawEvmAddress}
                                            onChange={(e) => setWithdrawEvmAddress(e.target.value)}
                                            placeholder="0x..."
                                            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm font-mono"
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={isProcessingWithdraw}
                                className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                            >
                                {isProcessingWithdraw ? 'Procesando...' : 'Solicitar Retiro de Fondos'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: VENDER POSICIÓN EN MERCADO SECUNDARIO */}
            {selectedInvestment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Vender Posición en Mercado Secundario</h3>
                            <button
                                onClick={() => setSelectedInvestment(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="font-bold text-gray-900">{selectedInvestment.contract.name}</p>
                                <p className="text-sm text-gray-500">
                                    Valor original invertido: ${Number(selectedInvestment.amount).toLocaleString()} USD
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Precio de Venta Solicitado (USD)
                                </label>
                                <input
                                    type="number"
                                    value={askingPrice}
                                    onChange={(e) => setAskingPrice(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary font-bold"
                                    min="1"
                                    step="0.01"
                                />
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Precio de publicación:</span>
                                    <span className="font-medium">${priceNum.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-amber-800">
                                    <span>Comisión de liquidación (3%):</span>
                                    <span>-${commissionAmount.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-amber-200 pt-2 flex justify-between font-bold">
                                    <span>Recibirás en tu Billetera:</span>
                                    <span className="text-green-700">${netReceived.toFixed(2)} USD</span>
                                </div>
                            </div>

                            {sellError && (
                                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{sellError}</div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedInvestment(null)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-bold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSell}
                                    disabled={isSelling || priceNum <= 0}
                                    className="flex-1 px-4 py-2.5 bg-primary text-black font-bold rounded-xl hover:brightness-95 disabled:opacity-50"
                                >
                                    {isSelling ? 'Publicando...' : 'Publicar en Secundario'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
