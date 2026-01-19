'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Type definitions matching the API response
type Contract = {
    id: string;
    name: string;
    imageUrl: string | null;
    generatorLocation: string | null;
    contractSubtype: string | null;
    energyType: string;
    annualReturn: string; // Decimal comes as string from JSON
    energyAmount: string; // Decimal
    financingGoal: string; // Decimal
    minInvestment: string; // Decimal
    maxInvestment: string; // Decimal
    currentRaised: string; // Decimal
    totalCapacity: string; // Decimal
    termMonths: number;
    buyerIndustry: string;
    buyer: string;
};

export default function MercadoPrimarioPage() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                // Ensure we call the public API
                const response = await fetch('/api/contracts', { cache: 'no-store' });
                if (response.ok) {
                    const data = await response.json();
                    setContracts(data);
                }
            } catch (error) {
                console.error("Failed to fetch contracts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContracts();
    }, []);

    // Helper to format currency
    const formatCurrency = (val: string | number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(Number(val));
    };

    // Helper to calculate progress
    const calculateProgress = (raised: string | number, total: string | number) => {
        const r = Number(raised);
        const t = Number(total);
        if (t === 0) return 0;
        return Math.min(Math.round((r / t) * 100), 100);
    };

    return (
        <div className="flex flex-col flex-1 h-full relative bg-white overflow-hidden">
            {/* Header */}
            <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white border-b border-gray-200 shrink-0 z-10">
                <div className="flex items-center gap-4 lg:hidden">
                    <button className="p-2 -ml-2 text-black">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <h2 className="text-lg font-bold font-display text-text-main">Mercado Primario</h2>
                </div>
                <div className="hidden lg:flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-black font-display tracking-tight">Mercado de Energía</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 h-10 w-64 hover:border-gray-300 transition-colors focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-sm w-full text-black placeholder-gray-400 font-sans outline-none"
                            placeholder="Buscar activos..."
                            type="text"
                        />
                    </div>
                    <button className="size-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
            </header>

            {/* Main Scrollable Area */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50">
                <div className="max-w-7xl mx-auto flex flex-col gap-10 pb-12">

                    {/* Hero Banner (Static for now) */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 translate-x-1/3 -translate-y-1/3"></div>
                        <div className="relative z-10 flex flex-col gap-3 max-w-3xl">
                            <h2 className="text-3xl font-black text-black font-display leading-tight">Tu liquidez genera energía real</h2>
                            <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                                En Wattismoney, cada inversión conecta directamente una <span className="font-bold text-black">fuente de generación sostenible</span> con una <span className="font-bold text-black">industria productiva</span>. Tu capital financia contratos PPA (Power Purchase Agreements) que garantizan precios estables.
                            </p>
                        </div>
                        <div className="flex gap-3 shrink-0 relative z-10">
                            <div className="px-5 py-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-w-[110px]">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">TIR Promedio</span>
                                <span className="text-xl font-black text-black font-display">9.4%</span>
                            </div>
                            <div className="px-5 py-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-w-[110px]">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Industrias</span>
                                <span className="text-xl font-black text-black font-display">12+</span>
                            </div>
                        </div>
                    </div>

                    {/* Primary Market Section */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black font-display flex items-center gap-2 text-black">
                                    <span className="material-symbols-outlined text-primary">verified</span>
                                    Mercado Primario
                                </h3>
                                <span className="px-2.5 py-0.5 bg-primary text-black text-[10px] font-bold rounded-full uppercase tracking-wide">Nuevas Emisiones</span>
                            </div>
                        </div>

                        {/* Real Data Grid */}
                        {isLoading ? (
                            <div className="w-full h-40 flex items-center justify-center">
                                <span className="text-gray-400">Cargando oportunidades...</span>
                            </div>
                        ) : contracts.length === 0 ? (
                            <div className="w-full py-10 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">solar_power</span>
                                <p className="text-gray-500 font-bold">No hay oportunidades activas en este momento.</p>
                                <p className="text-sm text-gray-400">Vuelve pronto para ver nuevos proyectos.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {contracts.map((contract) => (
                                    <article key={contract.id} className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-gray-200 overflow-hidden h-full">
                                        <Link href={`/contrato/${contract.id}`} className="block relative h-52 w-full overflow-hidden cursor-pointer">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url("${contract.imageUrl || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}")` }} // Fallback image
                                            ></div>
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                            <div className="absolute top-3 left-3">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[10px] font-bold rounded uppercase tracking-wider shadow-sm font-display">
                                                    Mercado Primario
                                                </span>
                                            </div>
                                            <div className="absolute bottom-4 left-4 text-white w-[calc(100%-32px)]">
                                                <div className="flex items-center gap-1 mb-1 text-white/80">
                                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                    <span className="text-xs font-bold uppercase tracking-wide">{contract.generatorLocation || 'Ubicación General'}</span>
                                                </div>
                                                <h3 className="text-xl font-black font-display leading-tight group-hover:text-primary transition-colors">{contract.name}</h3>
                                            </div>
                                        </Link>
                                        <div className="flex flex-col flex-1 p-5 gap-5">
                                            {/* Energy Value Chain - Dynamic Data */}
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Cadena de Valor Energética</p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex flex-col items-center gap-1 w-1/3">
                                                        <div className="size-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-orange-500 shadow-sm">
                                                            <span className="material-symbols-outlined text-[20px]">
                                                                {contract.energyType === 'WIND_ONSHORE' || contract.energyType === 'WIND_OFFSHORE' ? 'wind_power' :
                                                                    contract.energyType === 'HYDRO' ? 'water_drop' : 'solar_power'}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-center leading-tight mt-1 text-slate-700">
                                                            Generación<br />
                                                            {contract.energyType === 'SOLAR' ? 'Solar' :
                                                                contract.energyType === 'HYDRO' ? 'Hidro' : 'Eólica'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 flex flex-col items-center px-1">
                                                        <div className="w-full border-t-2 border-dashed border-gray-300 relative top-2"></div>
                                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded relative z-10 mt-1">PPA {Math.round(contract.termMonths / 12)} Años</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 w-1/3">
                                                        <div className="size-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 shadow-sm">
                                                            <span className="material-symbols-outlined text-[20px]">factory</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-center leading-tight mt-1 text-slate-700">
                                                            Industria<br />
                                                            {contract.buyerIndustry || 'General'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Rentabilidad Est.</span>
                                                    <span className="text-2xl font-black font-display text-black">{contract.annualReturn}% <span className="text-xs font-bold text-gray-400">anual</span></span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Volumen Transado</span>
                                                    <span className="text-lg font-black font-display text-black flex items-center gap-1">
                                                        {contract.energyAmount} GWh
                                                        <span className="material-symbols-outlined text-green-600 text-[18px]">bolt</span>
                                                    </span>
                                                    <span className="text-[10px] font-medium text-gray-400">Energía limpia entregada</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex justify-between text-xs font-bold mb-2">
                                                    <span className="text-black">
                                                        {calculateProgress(contract.currentRaised, contract.totalCapacity)}% Financiado
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {formatCurrency(contract.currentRaised)} / {formatCurrency(contract.totalCapacity)}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-4">
                                                    <div
                                                        className="bg-primary h-full rounded-full transition-all duration-1000"
                                                        style={{ width: `${calculateProgress(contract.currentRaised, contract.totalCapacity)}%` }}
                                                    ></div>
                                                </div>
                                                <Link href={`/contrato/${contract.id}`} className="w-full h-11 rounded-xl bg-black text-white hover:bg-gray-800 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                                                    Invertir Ahora
                                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Secondary Market Teaser (Static) */}
                    <div className="flex flex-col gap-5 pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black font-display flex items-center gap-2 text-gray-800">
                                    <span className="material-symbols-outlined text-gray-400">swap_horiz</span>
                                    Mercado Secundario
                                </h3>
                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200 uppercase tracking-wide">Posiciones a la venta</span>
                            </div>
                            <Link href="/mercado-secundario" className="text-sm font-bold text-gray-500 hover:text-black transition-colors underline decoration-primary decoration-2 underline-offset-4">
                                Ver todas las reventas
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70 hover:opacity-100 transition-opacity">
                            {/* View More Card */}
                            <Link href="/mercado-secundario" className="flex flex-col bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 h-40 items-center justify-center p-6 text-center hover:bg-white hover:border-primary hover:text-primary transition-all cursor-pointer group">
                                <div className="size-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-3 group-hover:border-primary group-hover:text-primary transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-3xl">storefront</span>
                                </div>
                                <h4 className="font-bold text-gray-600 group-hover:text-black">Ir al Mercado Secundario</h4>
                                <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-500">Accede a oportunidades con liquidez inmediata</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
