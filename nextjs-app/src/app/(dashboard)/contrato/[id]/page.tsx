'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WattismoneyLogo } from '@/components/Icons';
import {
    SUPPORTED_EVM_CHAINS,
    TREASURY_EVM_WALLET,
    TREASURY_BANK_DETAILS,
} from '@/lib/web3-config';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';

interface ContractDocument {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number | null;
}

interface Contract {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    annualReturn: number;
    totalCapacity: number;
    currentRaised: number;
    minInvestment: number;
    maxInvestment: number;
    generator: string | null;
    generatorLocation: string | null;
    buyer: string | null;
    buyerIndustry: string | null;
    energyType: string;
    energyAmount: number;
    termMonths: number | null;
    co2Emissions: number | null;
    status: string;
    documents: ContractDocument[];
}

type CheckoutRail =
    | 'INTERNAL_WALLET'
    | 'STRIPE'
    | 'LATAM_GATEWAY'
    | 'BANK_TRANSFER'
    | 'WEB3_DIRECT';

export default function ContractDetail() {
    const params = useParams();
    const contractId = params.id as string;

    const [contract, setContract] = useState<Contract | null>(null);
    const [walletBalance, setWalletBalance] = useState<{
        fiatBalance: number;
        cryptoBalanceUsdc: number;
        totalAvailable: number;
    }>({ fiatBalance: 0, cryptoBalanceUsdc: 0, totalAvailable: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [investAmount, setInvestAmount] = useState(1000);

    // Multi-Rail Checkout Modal State
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedRail, setSelectedRail] = useState<CheckoutRail>('INTERNAL_WALLET');
    const [walletSource, setWalletSource] = useState<'FIAT' | 'CRYPTO'>('FIAT');
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [latamMethod, setLatamMethod] = useState('PSE - Bancolombia');
    const [bankReference, setBankReference] = useState('');
    const [receiptUrl, setReceiptUrl] = useState('');
    const [cryptoToken, setCryptoToken] = useState<'USDC' | 'USDT'>('USDC');
    const [manualTxHash, setManualTxHash] = useState('');

    const [isInvesting, setIsInvesting] = useState(false);
    const [investError, setInvestError] = useState<string | null>(null);
    const [investSuccess, setInvestSuccess] = useState<{
        amount: number;
        expectedReturn: number;
        railLabel: string;
        status: string;
        earnedXp?: number;
        explorerLink?: string;
    } | null>(null);

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

    useEffect(() => {
        fetchContractAndWallet();
    }, [contractId]);

    const fetchContractAndWallet = async () => {
        try {
            const [contractRes, walletRes] = await Promise.all([
                fetch(`/api/contracts/${contractId}`),
                fetch('/api/wallet'),
            ]);

            if (!contractRes.ok) {
                if (contractRes.status === 404) throw new Error('Contrato no encontrado');
                throw new Error('Error al cargar el contrato');
            }

            const contractData = await contractRes.json();
            setContract(contractData.contract);
            const minInv = Number(contractData.contract?.minInvestment || 500);
            setInvestAmount(Math.max(minInv, 1000));

            if (walletRes.ok) {
                const walletData = await walletRes.json();
                if (walletData.wallet) {
                    setWalletBalance({
                        fiatBalance: Number(walletData.wallet.fiatBalance || 0),
                        cryptoBalanceUsdc: Number(walletData.wallet.cryptoBalanceUsdc || 0),
                        totalAvailable: Number(walletData.wallet.totalAvailable || 0),
                    });
                    if (Number(walletData.wallet.totalAvailable || 0) <= 0) {
                        setSelectedRail('STRIPE');
                    }
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const getEnergyLabel = (type: string) => {
        const labels: Record<string, string> = {
            SOLAR: 'Solar Fotovoltaica',
            WIND: 'Eólica',
            WIND_ONSHORE: 'Eólica Onshore',
            WIND_OFFSHORE: 'Eólica Offshore',
            HYDRO: 'Hidroeléctrica',
            BIOMASS: 'Biomasa',
            GEOTHERMAL: 'Geotérmica',
            HYBRID: 'Híbrido Renovable',
        };
        return labels[type] || type;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatTerm = (months: number | null) => {
        if (!months) return '12 meses';
        if (months >= 12 && months % 12 === 0) {
            const years = months / 12;
            return `${years} ${years === 1 ? 'año' : 'años'}`;
        }
        return `${months} meses`;
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando contrato energético...</p>
                </div>
            </div>
        );
    }

    if (error || !contract) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error_outline</span>
                    <h2 className="text-xl font-bold text-gray-700">{error || 'Contrato no encontrado'}</h2>
                    <Link href="/mercado-primario" className="text-primary hover:underline mt-2 inline-block">
                        Volver al mercado primario
                    </Link>
                </div>
            </div>
        );
    }

    const totalCapacity = Number(contract.totalCapacity);
    const currentRaised = Number(contract.currentRaised);
    const remainingCapacity = Math.max(0, totalCapacity - currentRaised);
    const minInvestment = Number(contract.minInvestment);
    const maxInvestment =
        Number(contract.maxInvestment) > 0
            ? Math.min(Number(contract.maxInvestment), remainingCapacity)
            : remainingCapacity;
    const progress = Math.min(Math.round((currentRaised / totalCapacity) * 100), 100);

    // Interactive Simulator Calculations
    const annualRate = Number(contract.annualReturn) / 100;
    const termMonths = Number(contract.termMonths || 12);
    const estimatedAnnualGain = investAmount * annualRate;
    const estimatedMonthlyDividend = estimatedAnnualGain / 12;
    const totalExpectedReturn = investAmount * (1 + annualRate * (termMonths / 12));
    const shareOfProject = totalCapacity > 0 ? investAmount / totalCapacity : 0;
    const estimatedMwhFinanced = Number(contract.energyAmount || 0) * 1000 * shareOfProject;
    const estimatedCo2Tons = Number(contract.co2Emissions || 0) * shareOfProject;

    const handleExecuteCheckout = async (simulateWeb3 = false) => {
        setIsInvesting(true);
        setInvestError(null);

        try {
            if (selectedRail === 'INTERNAL_WALLET') {
                const res = await fetch('/api/investments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contractId,
                        amount: investAmount,
                        walletSource,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al invertir con Billetera');

                setShowCheckoutModal(false);
                setInvestSuccess({
                    amount: investAmount,
                    expectedReturn: Number(data.investment?.expectedReturn || totalExpectedReturn),
                    railLabel: `Billetera Wattismoney (${walletSource === 'CRYPTO' ? 'USDC' : 'USD Fiat'})`,
                    status: 'CONFIRMED',
                    earnedXp: data.earnedXp,
                });
                fetchContractAndWallet();
                return;
            }

            if (
                selectedRail === 'STRIPE' ||
                selectedRail === 'LATAM_GATEWAY' ||
                selectedRail === 'BANK_TRANSFER'
            ) {
                const methodDetail =
                    selectedRail === 'STRIPE'
                        ? `Tarjeta •••• ${cardNumber.slice(-4) || '4242'}`
                        : selectedRail === 'LATAM_GATEWAY'
                        ? latamMethod
                        : bankReference;

                const res = await fetch('/api/payments/fiat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: investAmount,
                        rail: selectedRail,
                        purpose: 'CONTRACT_INVESTMENT',
                        contractId,
                        paymentMethodDetail: methodDetail,
                        bankReference: selectedRail === 'BANK_TRANSFER' ? bankReference : methodDetail,
                        receiptUrl: receiptUrl || undefined,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al procesar pago Fiat');

                setShowCheckoutModal(false);
                setInvestSuccess({
                    amount: investAmount,
                    expectedReturn: totalExpectedReturn,
                    railLabel:
                        selectedRail === 'STRIPE'
                            ? 'Stripe (Tarjeta Internacional / ACH)'
                            : selectedRail === 'LATAM_GATEWAY'
                            ? `Pasarela LATAM (${latamMethod})`
                            : `Transferencia Bancaria (Ref: ${bankReference})`,
                    status: data.status || 'CONFIRMED',
                    earnedXp: data.earnedXp,
                });
                fetchContractAndWallet();
                return;
            }

            if (selectedRail === 'WEB3_DIRECT') {
                let finalTxHash = manualTxHash.trim();
                let senderAddr = connectedWeb3Address || '';

                if (!finalTxHash) {
                    const payment = await sendTokenPayment({
                        amountUsd: investAmount,
                        tokenSymbol: cryptoToken,
                        targetChainId: selectedWeb3Chain,
                        toAddress: TREASURY_EVM_WALLET,
                        simulateIfRejected: simulateWeb3,
                    });
                    if (!payment) {
                        setIsInvesting(false);
                        return;
                    }
                    finalTxHash = payment.txHash;
                    senderAddr = payment.fromAddress;
                }

                const res = await fetch('/api/payments/crypto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: investAmount,
                        chainId: selectedWeb3Chain,
                        tokenSymbol: cryptoToken,
                        txHash: finalTxHash,
                        fromAddress: senderAddr,
                        purpose: 'CONTRACT_INVESTMENT',
                        contractId,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error en verificación Web3');

                setShowCheckoutModal(false);
                setInvestSuccess({
                    amount: investAmount,
                    expectedReturn: totalExpectedReturn,
                    railLabel: `Web3 Directo (${cryptoToken})`,
                    status: 'CONFIRMED',
                    earnedXp: data.earnedXp,
                    explorerLink: data.explorerLink,
                });
                fetchContractAndWallet();
            }
        } catch (err) {
            setInvestError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsInvesting(false);
        }
    };

    if (investSuccess) {
        return (
            <div className="flex flex-col h-full bg-background-light font-display text-text-main">
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/cartera" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-text-main">Comprobante de Inversión PPA</h1>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center border border-gray-200">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-5xl text-green-600">
                                {investSuccess.status === 'PENDING' ? 'schedule' : 'verified'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">
                            {investSuccess.status === 'PENDING'
                                ? 'Transferencia en Verificación'
                                : '¡Inversión Energética Confirmada!'}
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            Has financiado{' '}
                            <span className="font-bold text-black">{formatCurrency(investSuccess.amount)}</span> en el
                            proyecto <strong>{contract.name}</strong> mediante <strong>{investSuccess.railLabel}</strong>.
                        </p>

                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-left">
                            <div>
                                <p className="text-[11px] text-slate-500 uppercase font-bold">Retorno Proyectado</p>
                                <p className="text-lg font-black text-emerald-600">
                                    {formatCurrency(investSuccess.expectedReturn)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 uppercase font-bold">Dividendo Mensual Est.</p>
                                <p className="text-lg font-black text-slate-900">
                                    {formatCurrency(estimatedMonthlyDividend)}/mes
                                </p>
                            </div>
                            {investSuccess.earnedXp ? (
                                <div className="col-span-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">Recompensa Gamificación:</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-primary text-black text-xs font-black">
                                        +{investSuccess.earnedXp} XP Ganados
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        {investSuccess.explorerLink && (
                            <a
                                href={investSuccess.explorerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-2 rounded-lg mb-6 hover:underline"
                            >
                                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                Ver Transacción en Block Explorer
                            </a>
                        )}

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/cartera"
                                className="w-full py-3.5 bg-primary hover:brightness-95 text-black font-black rounded-xl transition-colors"
                            >
                                Ir a mi Cartera e Historial
                            </Link>
                            <Link
                                href="/mercado-primario"
                                className="w-full py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                Explorar más Contratos PPA
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-text-main">
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/mercado-primario" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-text-main">{contract.name}</h1>
                        <p className="text-xs text-gray-500">
                            Contrato PPA Verificado • Liquidación Híbrida Fiat (USD) & Web3 (USDC/USDT)
                        </p>
                    </div>
                </div>
                <Link href="/" className="hidden md:block">
                    <WattismoneyLogo className="h-8 w-auto" />
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Contract Info & Simulator */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Hero */}
                            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs">
                                <div
                                    className="h-64 bg-cover bg-center relative"
                                    style={{
                                        backgroundImage: contract.imageUrl
                                            ? `url("${contract.imageUrl}")`
                                            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-3 py-1 bg-primary text-black text-xs font-bold rounded-full">
                                                {getEnergyLabel(contract.energyType)}
                                            </span>
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-xs text-white text-xs font-bold rounded-full">
                                                TIR {Number(contract.annualReturn).toFixed(1)}% E.A.
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-black text-white">{contract.name}</h2>
                                        {contract.generatorLocation && (
                                            <p className="text-gray-300 flex items-center gap-1 mt-1 text-sm">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                {contract.generatorLocation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                        {contract.description ||
                                            `Contrato de compra de energía (PPA) de fuente ${getEnergyLabel(
                                                contract.energyType
                                            ).toLowerCase()} operado por ${
                                                contract.generator || 'generador certificado'
                                            }. Suministro eléctrico garantizado para ${
                                                contract.buyer || 'consumidor industrial'
                                            } en el sector ${
                                                contract.buyerIndustry || 'industrial'
                                            } por un plazo de ${formatTerm(contract.termMonths)}.`}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-gray-100">
                                            <span className="material-symbols-outlined text-amber-600 bg-amber-100 p-2 rounded-lg">
                                                solar_power
                                            </span>
                                            <div>
                                                <p className="text-[11px] uppercase font-bold text-slate-400">
                                                    Generador Energético
                                                </p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {contract.generator || 'Generadora Renovable SPV'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-gray-100">
                                            <span className="material-symbols-outlined text-blue-600 bg-blue-100 p-2 rounded-lg">
                                                factory
                                            </span>
                                            <div>
                                                <p className="text-[11px] uppercase font-bold text-slate-400">
                                                    Off-Taker (Comprador PPA)
                                                </p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {contract.buyer || 'Industria Certificada'}{' '}
                                                    {contract.buyerIndustry ? `(${contract.buyerIndustry})` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Volumen Energía</p>
                                    <p className="text-xl font-black text-black">
                                        {Number(contract.energyAmount).toLocaleString()} GWh
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Plazo PPA</p>
                                    <p className="text-xl font-black text-black">{formatTerm(contract.termMonths)}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">TIR Anual</p>
                                    <p className="text-xl font-black text-green-600">
                                        {Number(contract.annualReturn).toFixed(1)}%
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">CO₂ Evitado/Año</p>
                                    <p className="text-xl font-black text-black">
                                        {contract.co2Emissions
                                            ? `${Number(contract.co2Emissions).toLocaleString()} Ton`
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Interactive Financial & Environmental Simulator */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary bg-black p-1.5 rounded-lg text-base">
                                                calculate
                                            </span>
                                            Simulador de Rendimientos e Impacto
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Desliza el monto para proyectar tus dividendos energéticos e impacto ambiental.
                                        </p>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900">
                                        {formatCurrency(investAmount)}
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min={minInvestment}
                                    max={Math.max(minInvestment * 2, maxInvestment)}
                                    step={50}
                                    value={investAmount}
                                    onChange={(e) => setInvestAmount(Number(e.target.value))}
                                    className="w-full accent-black cursor-pointer h-2 bg-gray-200 rounded-lg"
                                />

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                                        <p className="text-[11px] font-bold text-emerald-800 uppercase">
                                            Flujo Mensual Est.
                                        </p>
                                        <p className="text-lg font-black text-emerald-700">
                                            +{formatCurrency(estimatedMonthlyDividend)}
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-900 text-white">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase">
                                            Retorno Total ({formatTerm(contract.termMonths)})
                                        </p>
                                        <p className="text-lg font-black text-primary">
                                            {formatCurrency(totalExpectedReturn)}
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                                        <p className="text-[11px] font-bold text-blue-800 uppercase">
                                            Energía Financiada
                                        </p>
                                        <p className="text-lg font-black text-blue-900">
                                            {estimatedMwhFinanced.toFixed(1)} MWh
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                                        <p className="text-[11px] font-bold text-amber-900 uppercase">
                                            CO₂ Mitigado
                                        </p>
                                        <p className="text-lg font-black text-amber-900">
                                            {estimatedCo2Tons.toFixed(1)} Ton
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                                <h3 className="font-bold text-lg mb-4">Respaldo Legal y Técnico (Due Diligence)</h3>
                                {contract.documents.length > 0 ? (
                                    <div className="space-y-3">
                                        {contract.documents.map((doc) => (
                                            <a
                                                key={doc.id}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-red-500">
                                                    picture_as_pdf
                                                </span>
                                                <span className="font-medium text-sm">{doc.name}</span>
                                                <span className="ml-auto text-xs text-gray-500">
                                                    PDF {doc.size ? `• ${formatFileSize(doc.size)}` : ''}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                                        <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-emerald-600">
                                                verified_user
                                            </span>
                                            <span>Contrato PPA Firmado en Fideicomiso SPV</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-blue-600">bolt</span>
                                            <span>Garantía de Despacho Eléctrico XM / CREG</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar - Investment Action */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-black text-lg text-slate-900">Financiar Contrato</h3>
                                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                                        Abierto
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-500">Progreso de Fondeo</span>
                                            <span className="font-bold">{progress}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                                            <span>Recaudado: {formatCurrency(currentRaised)}</span>
                                            <span>Meta: {formatCurrency(totalCapacity)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                                Ticket Mínimo
                                            </p>
                                            <p className="text-lg font-black text-black">
                                                {formatCurrency(minInvestment)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                                Tu Liquidez
                                            </p>
                                            <p className="text-lg font-black text-emerald-700">
                                                {formatCurrency(walletBalance.totalAvailable)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-xs font-bold text-gray-700 uppercase">
                                            Monto a Invertir (USD / USDC)
                                        </span>
                                        <div className="relative mt-1.5">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary font-black text-lg outline-none"
                                                value={investAmount}
                                                onChange={(e) => setInvestAmount(Number(e.target.value))}
                                                min={minInvestment}
                                                max={maxInvestment}
                                            />
                                        </div>
                                    </label>

                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 space-y-1.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Rieles habilitados:</span>
                                            <span className="font-bold text-slate-800">
                                                Fiat (USD/PSE) + Crypto (USDC/USDT)
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Retorno estimado al vencimiento:</span>
                                            <span className="font-black text-emerald-700">
                                                {formatCurrency(totalExpectedReturn)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setInvestError(null);
                                            setShowCheckoutModal(true);
                                        }}
                                        disabled={contract.status !== 'ACTIVE'}
                                        className="w-full py-4 bg-primary hover:brightness-95 disabled:bg-gray-300 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined">bolt</span>
                                        Elegir Método de Pago e Invertir
                                    </button>

                                    <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-400 font-medium">
                                        <span>Stripe</span>•<span>PSE / Nequi</span>•<span>Polygon / Base USDC</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MULTI-RAIL CHECKOUT MODAL */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-gray-200 my-8">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-primary/30 text-black rounded-full">
                                    Checkout Híbrido Fiat + Web3
                                </span>
                                <h3 className="text-xl font-black text-slate-900 mt-1">
                                    Financiar {contract.name}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Monto de inversión: <strong>{formatCurrency(investAmount)}</strong> • Retorno
                                    esperado: <strong className="text-emerald-700">{formatCurrency(totalExpectedReturn)}</strong>
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCheckoutModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Selector de los 5 Rieles de Pago */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
                            {(
                                [
                                    {
                                        key: 'INTERNAL_WALLET',
                                        label: 'Mi Billetera',
                                        sub: `$${walletBalance.totalAvailable.toLocaleString()}`,
                                        icon: 'account_balance_wallet',
                                    },
                                    {
                                        key: 'STRIPE',
                                        label: 'Tarjeta / ACH',
                                        sub: 'Stripe USD',
                                        icon: 'credit_card',
                                    },
                                    {
                                        key: 'LATAM_GATEWAY',
                                        label: 'PSE / Nequi',
                                        sub: 'Local LATAM',
                                        icon: 'payments',
                                    },
                                    {
                                        key: 'BANK_TRANSFER',
                                        label: 'Transferencia',
                                        sub: 'ACH / SWIFT',
                                        icon: 'account_balance',
                                    },
                                    {
                                        key: 'WEB3_DIRECT',
                                        label: 'Crypto Web3',
                                        sub: 'USDC / USDT',
                                        icon: 'token',
                                    },
                                ] as const
                            ).map((rail) => (
                                <button
                                    key={rail.key}
                                    type="button"
                                    onClick={() => {
                                        setSelectedRail(rail.key);
                                        setInvestError(null);
                                    }}
                                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                                        selectedRail === rail.key
                                            ? 'bg-black text-primary border-black shadow-xs'
                                            : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[18px] mb-1">{rail.icon}</span>
                                    <div>
                                        <div className="text-xs font-bold leading-tight">{rail.label}</div>
                                        <div
                                            className={`text-[10px] ${
                                                selectedRail === rail.key ? 'text-gray-300' : 'text-slate-400'
                                            }`}
                                        >
                                            {rail.sub}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {investError && (
                            <div className="p-3.5 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                                {investError}
                            </div>
                        )}

                        {/* RIEL 1: BILLETERA INTERNA */}
                        {selectedRail === 'INTERNAL_WALLET' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">Saldo Fiat Disponible (USD):</span>
                                        <span className="font-bold text-slate-900">
                                            ${walletBalance.fiatBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">
                                            Saldo Crypto Disponible (USDC):
                                        </span>
                                        <span className="font-bold text-purple-700">
                                            ${walletBalance.cryptoBalanceUsdc.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setWalletSource('FIAT')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                                                walletSource === 'FIAT'
                                                    ? 'bg-white border-black text-black shadow-2xs'
                                                    : 'border-transparent text-slate-500'
                                            }`}
                                        >
                                            Priorizar Saldo Fiat USD
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setWalletSource('CRYPTO')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                                                walletSource === 'CRYPTO'
                                                    ? 'bg-white border-purple-700 text-purple-800 shadow-2xs'
                                                    : 'border-transparent text-slate-500'
                                            }`}
                                        >
                                            Priorizar Saldo USDC
                                        </button>
                                    </div>
                                </div>

                                {walletBalance.totalAvailable < investAmount && (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                                        <span>
                                            Tu saldo en billetera (${walletBalance.totalAvailable.toLocaleString()}) es
                                            menor al monto a invertir.
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRail('STRIPE')}
                                            className="font-bold underline ml-2 shrink-0"
                                        >
                                            Usar Tarjeta/Web3 →
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    disabled={isInvesting || walletBalance.totalAvailable < investAmount}
                                    onClick={() => handleExecuteCheckout(false)}
                                    className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {isInvesting
                                        ? 'Confirmando Inversión...'
                                        : `Confirmar Inversión de ${formatCurrency(investAmount)}`}
                                </button>
                            </div>
                        )}

                        {/* RIEL 2: STRIPE CARD / ACH */}
                        {selectedRail === 'STRIPE' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700">
                                            Pago Seguro con Tarjeta Internacional (Stripe)
                                        </span>
                                        <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                            Confirmación Inmediata
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value)}
                                        placeholder="Titular de la tarjeta"
                                        className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm"
                                    />
                                    <input
                                        type="text"
                                        maxLength={19}
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        placeholder="4242 •••• •••• 4242"
                                        className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-mono"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-mono"
                                        />
                                        <input
                                            type="text"
                                            maxLength={4}
                                            placeholder="CVC"
                                            value={cardCvc}
                                            onChange={(e) => setCardCvc(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-mono"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    disabled={isInvesting}
                                    onClick={() => handleExecuteCheckout(false)}
                                    className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                                >
                                    {isInvesting
                                        ? 'Procesando con Stripe...'
                                        : `Pagar e Invertir ${formatCurrency(investAmount)} USD`}
                                </button>
                            </div>
                        )}

                        {/* RIEL 3: PASARELA LATAM (PSE / NEQUI / SPEI) */}
                        {selectedRail === 'LATAM_GATEWAY' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700">
                                            Wompi / MercadoPago (PSE, Nequi, Bancolombia, SPEI)
                                        </span>
                                        <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                            Acreditación Inmediata
                                        </span>
                                    </div>
                                    <select
                                        value={latamMethod}
                                        onChange={(e) => setLatamMethod(e.target.value)}
                                        className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-medium"
                                    >
                                        <option value="PSE - Bancolombia">PSE — Bancolombia</option>
                                        <option value="PSE - Davivienda">PSE — Davivienda</option>
                                        <option value="PSE - Banco de Bogotá">PSE — Banco de Bogotá</option>
                                        <option value="Billetera Nequi">Billetera Nequi</option>
                                        <option value="Transferencia SPEI">SPEI (México)</option>
                                    </select>
                                    <p className="text-xs text-slate-500">
                                        Total estimado en moneda local:{' '}
                                        <strong className="text-slate-900">
                                            ${(investAmount * 4150).toLocaleString()} COP
                                        </strong>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    disabled={isInvesting}
                                    onClick={() => handleExecuteCheckout(false)}
                                    className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                                >
                                    {isInvesting
                                        ? 'Autorizando PSE / Nequi...'
                                        : `Invertir ${formatCurrency(investAmount)} con ${latamMethod}`}
                                </button>
                            </div>
                        )}

                        {/* RIEL 4: TRANSFERENCIA BANCARIA DIRECTA */}
                        {selectedRail === 'BANK_TRANSFER' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
                                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs space-y-1">
                                        <p className="font-bold text-slate-900">Cuenta Fideicomiso / SPV:</p>
                                        <p className="text-slate-600">{TREASURY_BANK_DETAILS.bankName}</p>
                                        <p className="font-mono text-slate-800">{TREASURY_BANK_DETAILS.accountNumber}</p>
                                        <p className="text-slate-500">
                                            Beneficiario: {TREASURY_BANK_DETAILS.beneficiary}
                                        </p>
                                    </div>
                                    <input
                                        type="text"
                                        value={bankReference}
                                        onChange={(e) => setBankReference(e.target.value)}
                                        placeholder="Número de referencia o comprobante bancario *"
                                        className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm font-mono"
                                    />
                                    <input
                                        type="url"
                                        value={receiptUrl}
                                        onChange={(e) => setReceiptUrl(e.target.value)}
                                        placeholder="URL del comprobante PDF/Imagen (opcional)"
                                        className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm"
                                    />
                                </div>
                                <button
                                    type="button"
                                    disabled={isInvesting || !bankReference}
                                    onClick={() => handleExecuteCheckout(false)}
                                    className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                                >
                                    {isInvesting
                                        ? 'Registrando...'
                                        : 'Registrar Comprobante y Reservar Cupo'}
                                </button>
                            </div>
                        )}

                        {/* RIEL 5: WEB3 DIRECTO (USDC / USDT) */}
                        {selectedRail === 'WEB3_DIRECT' && (
                            <div className="space-y-4">
                                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-primary uppercase">
                                            Financiamiento On-Chain (0% Fee)
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
                                                className="text-xs bg-primary text-black font-bold px-3 py-1 rounded-lg"
                                            >
                                                {isConnectingWeb3 ? 'Conectando...' : 'Conectar MetaMask / Wallet'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">
                                                Red EVM
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
                                                <option value="USDC">USDC</option>
                                                <option value="USDT">USDT</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {web3Error && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                                        {web3Error}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    disabled={isInvesting || isSendingTx}
                                    onClick={() => handleExecuteCheckout(false)}
                                    className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[20px]">token</span>
                                    {isSendingTx || isInvesting
                                        ? 'Firmando Transacción...'
                                        : `Invertir ${investAmount.toLocaleString()} ${cryptoToken} con Billetera Web3`}
                                </button>

                                <button
                                    type="button"
                                    disabled={isInvesting || isSendingTx}
                                    onClick={() => handleExecuteCheckout(true)}
                                    className="w-full h-10 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                                >
                                    ⚡ Simular Firma On-Chain Instantánea (Modo Demo / Testnet)
                                </button>

                                <div className="pt-2 border-t border-gray-200">
                                    <input
                                        type="text"
                                        value={manualTxHash}
                                        onChange={(e) => setManualTxHash(e.target.value)}
                                        placeholder="O pega aquí el txHash (0x...) si transferiste manualmente"
                                        className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-mono"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
