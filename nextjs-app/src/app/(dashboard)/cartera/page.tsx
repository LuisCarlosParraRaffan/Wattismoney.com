'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

interface Investment {
    id: string;
    amount: number;
    status: string;
    expectedReturn: number | null;
    createdAt: string;
    contract: {
        id: string;
        name: string;
        imageUrl: string | null;
        energyType: string;
        annualReturn: number;
        generatorLocation: string | null;
    };
    listing: {
        id: string;
        status: string;
        askingPrice: number;
    } | null;
}

const Cartera: React.FC = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingListing, setIsCreatingListing] = useState<string | null>(null);
    const [sellPrice, setSellPrice] = useState<Record<string, string>>({});
    const [showSellModal, setShowSellModal] = useState<string | null>(null);

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            const res = await fetch('/api/user/investments');
            if (res.ok) {
                const data = await res.json();
                setInvestments(data.investments || []);
            }
        } catch (error) {
            console.error('Error fetching investments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateListing = async (investmentId: string) => {
        const price = sellPrice[investmentId];
        if (!price || Number(price) <= 0) {
            alert('Ingresa un precio válido');
            return;
        }

        setIsCreatingListing(investmentId);
        try {
            const res = await fetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    investmentId,
                    askingPrice: Number(price),
                }),
            });

            if (res.ok) {
                setShowSellModal(null);
                fetchInvestments();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al crear el listado');
            }
        } catch (error) {
            alert('Error al crear el listado');
        } finally {
            setIsCreatingListing(null);
        }
    };

    const getEnergyIcon = (type: string) => {
        const icons: Record<string, string> = {
            SOLAR: 'solar_power',
            WIND: 'air',
            WIND_ONSHORE: 'air',
            WIND_OFFSHORE: 'air',
            HYDRO: 'water_drop',
            BIOMASS: 'eco',
            GEOTHERMAL: 'landslide',
        };
        return icons[type] || 'bolt';
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const getStatusBadge = (status: string, listing: Investment['listing']) => {
        if (listing?.status === 'ACTIVE') {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    En Venta
                </span>
            );
        }
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activa' },
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
            SOLD: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Vendida' },
        };
        const badge = badges[status] || badges.PENDING;
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${badge.bg} ${badge.text} border`}>
                {badge.label}
            </span>
        );
    };

    const totalValue = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const confirmedInvestments = investments.filter(inv => inv.status === 'CONFIRMED' && !inv.listing);

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background-light font-display text-text-main">
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
                <div className="md:hidden flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <WattismoneyLogo className="h-8 w-auto" />
                    </Link>
                </div>
                <div className="hidden md:flex flex-col">
                    <h1 className="text-xl font-bold text-text-main">Cartera de Inversiones</h1>
                    <p className="text-sm text-slate-500">Gestiona tus inversiones y véndelas en el mercado secundario.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block h-8 w-px bg-gray-200"></div>
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Valor Total</span>
                        <span className="text-sm font-bold text-text-main">{formatCurrency(totalValue)}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-gray-50/50">
                <div className="max-w-7xl mx-auto space-y-6 pb-10">

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && investments.length === 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">account_balance_wallet</span>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">No tienes inversiones aún</h2>
                            <p className="text-gray-500 mb-6">Explora las oportunidades en el Mercado Primario</p>
                            <Link href="/mercado-primario" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:brightness-95 transition-all">
                                <span className="material-symbols-outlined">bolt</span>
                                Ver Oportunidades
                            </Link>
                        </div>
                    )}

                    {/* Investments Table */}
                    {!isLoading && investments.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-lg text-text-main">Mis Inversiones</h3>
                                <Link href="/mercado-secundario" className="text-sm font-bold text-slate-500 hover:text-black flex items-center gap-1 transition-colors">
                                    Mercado Secundario <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Proyecto</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Inversión</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">TIR</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {investments.map((investment) => (
                                            <tr key={investment.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-black">
                                                            <span className="material-symbols-outlined text-lg">{getEnergyIcon(investment.contract.energyType)}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-text-main">{investment.contract.name}</p>
                                                            <p className="text-xs text-slate-500">{investment.contract.generatorLocation || 'Ubicación N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="text-sm font-medium text-text-main">{formatCurrency(Number(investment.amount))}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="text-sm font-bold text-green-600">{Number(investment.contract.annualReturn).toFixed(1)}%</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {getStatusBadge(investment.status, investment.listing)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {investment.status === 'CONFIRMED' && !investment.listing && (
                                                        <button
                                                            onClick={() => {
                                                                setSellPrice({ ...sellPrice, [investment.id]: String(Number(investment.amount)) });
                                                                setShowSellModal(investment.id);
                                                            }}
                                                            className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors"
                                                        >
                                                            Vender
                                                        </button>
                                                    )}
                                                    {investment.listing?.status === 'ACTIVE' && (
                                                        <span className="text-xs text-purple-600 font-bold">
                                                            {formatCurrency(Number(investment.listing.askingPrice))}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sell Modal */}
            {showSellModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-xl font-bold mb-4">Vender Posición</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Tu posición se listará en el Mercado Secundario. Wattismoney cobrará <span className="font-bold">3% de comisión</span> al completar la venta.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Precio de venta</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        value={sellPrice[showSellModal] || ''}
                                        onChange={(e) => setSellPrice({ ...sellPrice, [showSellModal]: e.target.value })}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSellModal(null)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleCreateListing(showSellModal)}
                                    disabled={isCreatingListing === showSellModal}
                                    className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                                >
                                    {isCreatingListing === showSellModal ? 'Publicando...' : 'Publicar Venta'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cartera;
