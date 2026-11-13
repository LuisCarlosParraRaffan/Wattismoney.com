'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SUPPORTED_EVM_CHAINS, TREASURY_EVM_WALLET } from '@/lib/web3-config';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';

interface SecondaryListingItem {
    id: string;
    investmentId: string;
    sellerId: string;
    askingPrice: string;
    originalAmount: string;
    commission: string;
    status: string;
    createdAt: string;
    investment: {
        id: string;
        amount: string;
        expectedReturn: string | null;
        contract: {
            id: string;
            name: string;
            imageUrl: string | null;
            energyType: string;
            annualReturn: string;
            generatorLocation: string | null;
            buyerIndustry?: string | null;
            termMonths?: number | null;
        };
    };
    seller: {
        id: string;
        firstName: string | null;
        lastName?: string | null;
        level?: string | null;
    };
}

interface Contract {
    id: string;
    name: string;
    imageUrl: string | null;
    energyType: string;
    annualReturn: number;
    totalCapacity: number;
    currentRaised: number;
    minInvestment: number;
    generatorLocation: string | null;
}

export default function MercadoSecundario() {
    const [listings, setListings] = useState<SecondaryListingItem[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [walletAvailable, setWalletAvailable] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Buy Modal States
    const [selectedListing, setSelectedListing] = useState<SecondaryListingItem | null>(null);
    const [buyRail, setBuyRail] = useState<'INTERNAL_WALLET' | 'STRIPE' | 'LATAM_GATEWAY' | 'WEB3_DIRECT'>(
        'INTERNAL_WALLET'
    );
    const [cryptoToken, setCryptoToken] = useState<'USDC' | 'USDT'>('USDC');
    const [isBuying, setIsBuying] = useState(false);

    const {
        address: connectedWeb3Address,
        chainId: selectedWeb3Chain,
        isSendingTx,
        connectWallet,
        switchNetwork,
        sendTokenPayment,
    } = useWeb3Wallet(137);

    const fetchMarketData = async () => {
        setIsLoading(true);
        try {
            const [listingsRes, contractsRes, walletRes] = await Promise.all([
                fetch('/api/listings'),
                fetch('/api/contracts?marketType=SECONDARY'),
                fetch('/api/wallet'),
            ]);

            if (listingsRes.ok) {
                const lData = await listingsRes.json();
                setListings(lData.listings || []);
            }

            if (contractsRes.ok) {
                const cData = await contractsRes.json();
                setContracts(Array.isArray(cData) ? cData : cData.contracts || []);
            }

            if (walletRes.ok) {
                const wData = await walletRes.json();
                const avail = Number(wData.wallet?.totalAvailable || 0);
                setWalletAvailable(avail);
                if (avail <= 0) {
                    setBuyRail('STRIPE');
                }
            }
        } catch (error) {
            console.error('Error fetching secondary market:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketData();
    }, []);

    const handleBuyListing = async (simulateWeb3 = false) => {
        if (!selectedListing) return;
        setIsBuying(true);
        setFeedback(null);

        try {
            const price = Number(selectedListing.askingPrice);
            let txHash: string | undefined;

            if (buyRail === 'WEB3_DIRECT') {
                const payment = await sendTokenPayment({
                    amountUsd: price,
                    tokenSymbol: cryptoToken,
                    targetChainId: selectedWeb3Chain,
                    toAddress: TREASURY_EVM_WALLET,
                    simulateIfRejected: simulateWeb3,
                });
                if (!payment) {
                    setIsBuying(false);
                    return;
                }
                txHash = payment.txHash;
            }

            const res = await fetch(`/api/listings/${selectedListing.id}/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentRail: buyRail,
                    txHash,
                    chainId: selectedWeb3Chain,
                    tokenSymbol: cryptoToken,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al adquirir la posición');

            setSelectedListing(null);
            setFeedback({ type: 'success', text: data.message });
            await fetchMarketData();
        } catch (err) {
            setFeedback({
                type: 'error',
                text: err instanceof Error ? err.message : 'Error al procesar compra',
            });
        } finally {
            setIsBuying(false);
        }
    };

    const getEnergyIcon = (type: string) => {
        const icons: Record<string, { icon: string; bg: string; label: string }> = {
            SOLAR: { icon: 'solar_power', bg: 'bg-yellow-100 text-yellow-800', label: 'Solar' },
            WIND: { icon: 'air', bg: 'bg-blue-100 text-blue-700', label: 'Eólica' },
            WIND_ONSHORE: { icon: 'air', bg: 'bg-blue-100 text-blue-700', label: 'Eólica Onshore' },
            WIND_OFFSHORE: { icon: 'wind_power', bg: 'bg-cyan-100 text-cyan-700', label: 'Eólica Offshore' },
            HYDRO: { icon: 'water_drop', bg: 'bg-cyan-100 text-cyan-700', label: 'Hidroeléctrica' },
            BIOMASS: { icon: 'eco', bg: 'bg-emerald-100 text-emerald-700', label: 'Biomasa' },
            GEOTHERMAL: { icon: 'landslide', bg: 'bg-orange-100 text-orange-700', label: 'Geotérmica' },
        };
        return icons[type] || { icon: 'bolt', bg: 'bg-gray-100 text-gray-700', label: type };
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-text-main">
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-black text-text-main">Mercado Secundario P2P</h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                            Liquidez Instantánea
                        </span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500">
                        Adquiere posiciones activas de otros inversores con descuento o liquida tus contratos antes del vencimiento.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/cartera"
                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-slate-800 font-bold rounded-xl text-xs"
                    >
                        <span className="material-symbols-outlined text-[16px]">sell</span>
                        Vender una Posición
                    </Link>
                    <Link
                        href="/mercado-primario"
                        className="px-4 py-2 bg-primary hover:brightness-95 text-black font-bold rounded-xl text-xs md:text-sm"
                    >
                        Mercado Primario
                    </Link>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
                <div className="max-w-7xl mx-auto space-y-8">
                    {feedback && (
                        <div
                            className={`p-4 rounded-xl border flex items-center justify-between ${
                                feedback.type === 'success'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                    : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                        >
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <span className="material-symbols-outlined">
                                    {feedback.type === 'success' ? 'check_circle' : 'error'}
                                </span>
                                <span>{feedback.text}</span>
                            </div>
                            <button onClick={() => setFeedback(null)}>
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Active P2P Secondary Listings */}
                    {!isLoading && listings.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-600">swap_horiz</span>
                                    Posiciones en Venta por Inversores ({listings.length})
                                </h2>
                                <span className="text-xs text-slate-500">
                                    Liquidación atómica • Comisión plataforma 3% (a cargo del vendedor)
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((item) => {
                                    const contract = item.investment.contract;
                                    const energy = getEnergyIcon(contract.energyType);
                                    const original = Number(item.originalAmount);
                                    const asking = Number(item.askingPrice);
                                    const expectedReturn =
                                        Number(item.investment.expectedReturn) ||
                                        original * (1 + Number(contract.annualReturn) / 100);
                                    const buyerNetProfit = Math.max(0, expectedReturn - asking);
                                    const buyerEffectiveRoi = asking > 0 ? (buyerNetProfit / asking) * 100 : 0;
                                    const discountPct =
                                        original > 0 ? Math.round(((original - asking) / original) * 100) : 0;

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                {/* Card Header Image */}
                                                <div className="h-36 bg-slate-900 relative overflow-hidden">
                                                    {contract.imageUrl ? (
                                                        <img
                                                            src={contract.imageUrl}
                                                            alt={contract.name}
                                                            className="w-full h-full object-cover opacity-85"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                                                            <span className="material-symbols-outlined text-5xl text-primary">
                                                                {energy.icon}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                    <div className="absolute top-3 left-3 flex gap-2">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${energy.bg}`}
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">
                                                                {energy.icon}
                                                            </span>
                                                            {energy.label}
                                                        </span>
                                                    </div>
                                                    {discountPct > 0 && (
                                                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-400 text-black shadow-xs">
                                                            -{discountPct}% Descuento
                                                        </span>
                                                    )}
                                                    <div className="absolute bottom-3 left-4 right-4 text-white">
                                                        <h3 className="font-black text-base truncate">
                                                            {contract.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-300 truncate">
                                                            {contract.generatorLocation || 'Colombia'} • Vendedor:{' '}
                                                            {item.seller.firstName || 'Inversor Verificado'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Pricing & Yield Breakdown */}
                                                <div className="p-5 space-y-4">
                                                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-100">
                                                        <div>
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase block">
                                                                Precio de Venta
                                                            </span>
                                                            <span className="text-xl font-black text-slate-900">
                                                                {formatCurrency(asking)}
                                                            </span>
                                                            {asking !== original && (
                                                                <span className="block text-[11px] text-slate-400 line-through">
                                                                    Valor orig.: {formatCurrency(original)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase block">
                                                                ROI Comprador
                                                            </span>
                                                            <span className="text-xl font-black text-emerald-600">
                                                                +{buyerEffectiveRoi.toFixed(1)}%
                                                            </span>
                                                            <span className="block text-[11px] text-slate-500">
                                                                Recibes: {formatCurrency(expectedReturn)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                                                        <span>Ganancia neta proyectada:</span>
                                                        <span className="font-bold text-emerald-700">
                                                            +{formatCurrency(buyerNetProfit)} USD
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5 pt-0 flex gap-2">
                                                <Link
                                                    href={`/contrato/${contract.id}`}
                                                    className="px-3.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-slate-700"
                                                >
                                                    Ver PPA
                                                </Link>
                                                <button
                                                    onClick={() => setSelectedListing(item)}
                                                    className="flex-1 py-2.5 bg-primary hover:brightness-95 text-black font-black rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        shopping_cart_checkout
                                                    </span>
                                                    Comprar Posición
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty State if neither listings nor secondary contracts exist */}
                    {!isLoading && listings.length === 0 && contracts.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">
                                storefront
                            </span>
                            <h2 className="text-xl font-black text-gray-800 mb-2">
                                No hay posiciones en venta en este momento
                            </h2>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
                                Cuando un inversor publique su participación desde su Cartera, aparecerá aquí para compra inmediata con Fiat o Crypto.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link
                                    href="/mercado-primario"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:brightness-95 transition-all"
                                >
                                    <span className="material-symbols-outlined">bolt</span>
                                    Invertir en Mercado Primario
                                </Link>
                                <Link
                                    href="/cartera"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-slate-800 font-bold rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Vender una Posición de mi Cartera
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL DE COMPRA P2P EN MERCADO SECUNDARIO */}
            {selectedListing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                                    Liquidación P2P Secundario
                                </span>
                                <h3 className="text-lg font-black text-slate-900 mt-1">
                                    Adquirir Posición en {selectedListing.investment.contract.name}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedListing(null)}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Valor original del contrato:</span>
                                <span className="font-bold">
                                    {formatCurrency(Number(selectedListing.originalAmount))}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Precio de compra hoy:</span>
                                <span className="font-black text-slate-900 text-base">
                                    {formatCurrency(Number(selectedListing.askingPrice))}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="text-slate-600 font-medium">Derecho de cobro al vencimiento:</span>
                                <span className="font-black text-emerald-600">
                                    {formatCurrency(
                                        Number(selectedListing.investment.expectedReturn) ||
                                            Number(selectedListing.originalAmount) *
                                                (1 + Number(selectedListing.investment.contract.annualReturn) / 100)
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                                Selecciona Riel de Pago
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(
                                    [
                                        {
                                            key: 'INTERNAL_WALLET',
                                            label: `Mi Billetera ($${walletAvailable.toLocaleString()})`,
                                            icon: 'account_balance_wallet',
                                        },
                                        { key: 'STRIPE', label: 'Tarjeta Stripe USD', icon: 'credit_card' },
                                        { key: 'LATAM_GATEWAY', label: 'PSE / Nequi', icon: 'payments' },
                                        { key: 'WEB3_DIRECT', label: 'Crypto USDC/USDT', icon: 'token' },
                                    ] as const
                                ).map((r) => (
                                    <button
                                        key={r.key}
                                        type="button"
                                        onClick={() => setBuyRail(r.key)}
                                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                                            buyRail === r.key
                                                ? 'bg-black text-primary border-black'
                                                : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">{r.icon}</span>
                                        <span className="truncate">{r.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {buyRail === 'WEB3_DIRECT' && (
                            <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2.5 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-primary font-bold">Red & Stablecoin</span>
                                    {!connectedWeb3Address && (
                                        <button
                                            type="button"
                                            onClick={() => connectWallet(false)}
                                            className="px-2 py-0.5 bg-primary text-black rounded font-bold"
                                        >
                                            Conectar Wallet
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={selectedWeb3Chain}
                                        onChange={(e) => switchNetwork(Number(e.target.value))}
                                        className="h-9 px-2 rounded bg-slate-800 border border-slate-700 text-white"
                                    >
                                        {SUPPORTED_EVM_CHAINS.map((c) => (
                                            <option key={c.chainId} value={c.chainId}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={cryptoToken}
                                        onChange={(e) => setCryptoToken(e.target.value as 'USDC' | 'USDT')}
                                        className="h-9 px-2 rounded bg-slate-800 border border-slate-700 text-white"
                                    >
                                        <option value="USDC">USDC</option>
                                        <option value="USDT">USDT</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <button
                                type="button"
                                disabled={
                                    isBuying ||
                                    isSendingTx ||
                                    (buyRail === 'INTERNAL_WALLET' &&
                                        walletAvailable < Number(selectedListing.askingPrice))
                                }
                                onClick={() => handleBuyListing(false)}
                                className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
                            >
                                {isBuying || isSendingTx
                                    ? 'Liquidando Operación...'
                                    : `Pagar ${formatCurrency(Number(selectedListing.askingPrice))} y Adquirir Contrato`}
                            </button>

                            {buyRail === 'WEB3_DIRECT' && (
                                <button
                                    type="button"
                                    disabled={isBuying || isSendingTx}
                                    onClick={() => handleBuyListing(true)}
                                    className="w-full h-9 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl cursor-pointer"
                                >
                                    ⚡ Simular Firma On-Chain (Modo Demo / Testnet)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
