'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const res = await fetch('/api/contracts?marketType=SECONDARY');
            if (res.ok) {
                const data = await res.json();
                setContracts(data || []);
            }
        } catch (error) {
            console.error('Error fetching contracts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getEnergyIcon = (type: string) => {
        const icons: Record<string, { icon: string; bg: string }> = {
            SOLAR: { icon: 'solar_power', bg: 'bg-yellow-100 text-yellow-700' },
            WIND: { icon: 'air', bg: 'bg-blue-100 text-blue-700' },
            WIND_ONSHORE: { icon: 'air', bg: 'bg-blue-100 text-blue-700' },
            WIND_OFFSHORE: { icon: 'air', bg: 'bg-cyan-100 text-cyan-700' },
            HYDRO: { icon: 'water_drop', bg: 'bg-cyan-100 text-cyan-700' },
            BIOMASS: { icon: 'eco', bg: 'bg-emerald-100 text-emerald-700' },
            GEOTHERMAL: { icon: 'landslide', bg: 'bg-orange-100 text-orange-700' },
        };
        return icons[type] || { icon: 'bolt', bg: 'bg-gray-100 text-gray-700' };
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getProgress = (current: number, total: number) => {
        if (!total) return 0;
        return Math.min(Math.round((current / total) * 100), 100);
    };

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-text-main">
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10">
                <div>
                    <h1 className="text-xl font-bold text-text-main">Mercado Secundario</h1>
                    <p className="text-sm text-slate-500">Oportunidades de inversión del mercado secundario</p>
                </div>
                <Link href="/mercado-primario" className="px-4 py-2 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg text-sm">
                    Ver Mercado Primario
                </Link>
            </header>

            <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && contracts.length === 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">storefront</span>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">No hay oportunidades disponibles</h2>
                            <p className="text-gray-500 mb-6">Actualmente no hay contratos en el mercado secundario.</p>
                            <Link href="/mercado-primario" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:brightness-95 transition-all">
                                <span className="material-symbols-outlined">bolt</span>
                                Invertir en Mercado Primario
                            </Link>
                        </div>
                    )}

                    {/* Contracts Grid */}
                    {!isLoading && contracts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contracts.map((contract) => {
                                const energy = getEnergyIcon(contract.energyType);
                                const progress = getProgress(Number(contract.currentRaised), Number(contract.totalCapacity));
                                return (
                                    <Link href={`/contrato/${contract.id}`} key={contract.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                        {/* Image */}
                                        <div className="w-full h-32 rounded-lg overflow-hidden mb-4 bg-gray-100">
                                            {contract.imageUrl ? (
                                                <img src={contract.imageUrl} alt={contract.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                    <span className="material-symbols-outlined text-4xl text-primary">bolt</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-lg ${energy.bg} flex items-center justify-center`}>
                                                <span className="material-symbols-outlined">{energy.icon}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-main">{contract.name}</h3>
                                                <p className="text-xs text-slate-500">{contract.generatorLocation || 'Ubicación N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex justify-between mb-4">
                                            <div>
                                                <span className="text-xs text-slate-500">Mín. Inversión</span>
                                                <p className="text-lg font-black text-text-main">{formatCurrency(Number(contract.minInvestment))}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">TIR</span>
                                                <p className="text-lg font-black text-green-600">{Number(contract.annualReturn).toFixed(1)}%</p>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Financiado</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Badge */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                                Mercado Secundario
                                            </span>
                                            <span className="text-primary font-bold text-sm">Ver detalles →</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
