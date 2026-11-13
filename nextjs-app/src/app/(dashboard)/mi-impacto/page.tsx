'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface EnergyDistributionItem {
    type: string;
    amount: number;
    percentage: number;
}

interface ImpactStats {
    totalInvested: number;
    totalContracts: number;
    averageTIR: number;
    totalEnergy: number; // GWh
    co2Avoided: number; // Tons
    industriesImpacted: number;
    energyTypeDistribution: EnergyDistributionItem[];
}

export default function UserImpactPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<ImpactStats>({
        totalInvested: 0,
        totalContracts: 0,
        averageTIR: 0,
        totalEnergy: 0,
        co2Avoided: 0,
        industriesImpacted: 0,
        energyTypeDistribution: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showCertificateModal, setShowCertificateModal] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetch('/api/user/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Error loading impact stats:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    // Real-world equivalences derived from user's real CO2 avoided & Energy generated
    // If user has 0 investments yet, we show 0 (and a clear call to action)
    const co2Tons = stats.co2Avoided || 0;
    const energyMwh = Math.round((stats.totalEnergy || 0) * 1000 * 10) / 10; // GWh -> MWh
    const treesEquivalent = Math.round(co2Tons * 45);
    const carsRemoved = Math.max(0, Math.round(co2Tons / 4.6));
    const flightsAvoided = Math.max(0, Math.round(co2Tons * 4));
    const homesPowered = Math.max(0, Math.round(energyMwh / 3.8));

    const getEnergyLabel = (type: string) => {
        const map: Record<string, { label: string; color: string }> = {
            SOLAR: { label: 'Energía Solar', color: '#eeff00' },
            WIND_ONSHORE: { label: 'Eólica Onshore', color: '#0f172a' },
            WIND_OFFSHORE: { label: 'Eólica Offshore', color: '#0284c7' },
            HYDRO: { label: 'Hidroeléctrica', color: '#38bdf8' },
            BIOMASS: { label: 'Biomasa', color: '#10b981' },
            GEOTHERMAL: { label: 'Geotérmica', color: '#f97316' },
            HYBRID: { label: 'Híbrido Renovable', color: '#8b5cf6' },
        };
        return map[type] || { label: type, color: '#64748b' };
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background-light font-display text-text-main">
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-text-main">Perfil de Impacto Ambiental</h1>
                    <p className="text-xs md:text-sm text-slate-500">
                        Métricas auditadas de descarbonización proporcionales a tu participación en contratos PPA.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCertificateModal(true)}
                        className="flex items-center gap-2 rounded-xl h-10 px-4 bg-primary hover:brightness-95 text-black text-xs md:text-sm font-bold transition-all shadow-xs cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                        <span>Certificado de Impacto</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-gray-50/50">
                <div className="max-w-7xl mx-auto space-y-8 pb-10">
                    {/* Hero Banner */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                <span className="material-symbols-outlined text-[16px]">eco</span>
                                Trazabilidad energética en tiempo real
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-text-main">
                                Tu Huella Positiva
                            </h2>
                            <p className="text-slate-500 text-base md:text-lg font-medium">
                                Calculado automáticamente sobre tus{' '}
                                <strong>${stats.totalInvested.toLocaleString()} USD</strong> invertidos en{' '}
                                <strong>{stats.totalContracts}</strong> proyectos renovables.
                            </p>
                        </div>

                        {stats.totalInvested === 0 && !isLoading && (
                            <Link
                                href="/mercado-primario"
                                className="px-5 py-3 bg-black text-primary font-bold rounded-xl text-sm flex items-center gap-2 self-start"
                            >
                                <span className="material-symbols-outlined">bolt</span>
                                Financiar mi primer proyecto verde
                            </Link>
                        )}
                    </div>

                    {/* 3 Core Environmental KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-gray-200 shadow-xs">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    CO₂ Evitado a la Atmósfera
                                </p>
                                <div className="bg-primary/20 p-2 rounded-lg text-black">
                                    <span className="material-symbols-outlined text-2xl">cloud_off</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-text-main tracking-tight text-4xl font-black">
                                    {isLoading ? '...' : `${co2Tons.toLocaleString()} Ton`}
                                </p>
                                <div className="flex items-center gap-1 mt-2 bg-green-50 w-fit px-2.5 py-1 rounded-md">
                                    <span className="material-symbols-outlined text-green-700 text-sm">verified</span>
                                    <p className="text-green-700 text-xs font-bold">
                                        Proporcional a tu capacidad financiada
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-gray-200 shadow-xs">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    Energía Limpia Financiada
                                </p>
                                <div className="bg-primary/20 p-2 rounded-lg text-black">
                                    <span className="material-symbols-outlined text-2xl">bolt</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-text-main tracking-tight text-4xl font-black">
                                    {isLoading ? '...' : `${energyMwh.toLocaleString()} MWh`}
                                </p>
                                <div className="flex items-center gap-1 mt-2 bg-blue-50 w-fit px-2.5 py-1 rounded-md">
                                    <span className="material-symbols-outlined text-blue-700 text-sm">
                                        electric_bolt
                                    </span>
                                    <p className="text-blue-700 text-xs font-bold">
                                        {stats.totalEnergy.toFixed(3)} GWh en red industrial
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-gray-200 shadow-xs">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    Árboles Equivalentes
                                </p>
                                <div className="bg-primary/20 p-2 rounded-lg text-black">
                                    <span className="material-symbols-outlined text-2xl">park</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-text-main tracking-tight text-4xl font-black">
                                    {isLoading ? '...' : `${treesEquivalent.toLocaleString()} Árboles`}
                                </p>
                                <div className="flex items-center gap-1 mt-2 bg-emerald-50 w-fit px-2.5 py-1 rounded-md">
                                    <span className="material-symbols-outlined text-emerald-700 text-sm">forest</span>
                                    <p className="text-emerald-700 text-xs font-bold">
                                        Absorción anual equivalente
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Real World Impact */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 h-full shadow-xs">
                                <div className="mb-6">
                                    <h2 className="text-text-main text-2xl font-bold leading-tight mb-1">
                                        Equivalencias en el Mundo Real
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                        Así se traduce el impacto ambiental de tu portafolio energético hoy:
                                    </p>
                                </div>
                                <div className="grid gap-4">
                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-3 bg-white rounded-full shadow-xs text-black border border-gray-100">
                                            <span className="material-symbols-outlined">directions_car</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-text-main text-base font-bold">
                                                Vehículos de combustión retirados
                                            </h3>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Equivale a retirar de circulación{' '}
                                                <span className="bg-primary/40 px-1.5 py-0.5 rounded font-bold text-black">
                                                    {carsRemoved} automóviles
                                                </span>{' '}
                                                durante todo un año.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-3 bg-white rounded-full shadow-xs text-black border border-gray-100">
                                            <span className="material-symbols-outlined">flight_takeoff</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-text-main text-base font-bold">
                                                Vuelos comerciales compensados
                                            </h3>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Mitigación equivalente a{' '}
                                                <span className="bg-primary/40 px-1.5 py-0.5 rounded font-bold text-black">
                                                    {flightsAvoided} vuelos
                                                </span>{' '}
                                                regionales de pasajeros.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="p-3 bg-white rounded-full shadow-xs text-black border border-gray-100">
                                            <span className="material-symbols-outlined">home</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-text-main text-base font-bold">
                                                Hogares abastecidos con energía 100% limpia
                                            </h3>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Suministro eléctrico limpio suficiente para{' '}
                                                <span className="bg-primary/40 px-1.5 py-0.5 rounded font-bold text-black">
                                                    {homesPowered} hogares
                                                </span>{' '}
                                                durante 12 meses.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Investment Distribution by Energy Source */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 h-full shadow-xs flex flex-col justify-between">
                                <div>
                                    <h2 className="text-text-main text-xl font-bold leading-tight mb-6">
                                        Matriz Energética de tu Portafolio
                                    </h2>

                                    {stats.energyTypeDistribution.length === 0 ? (
                                        <div className="py-12 text-center text-slate-400">
                                            <span className="material-symbols-outlined text-5xl mb-2 block">
                                                solar_power
                                            </span>
                                            <p className="text-sm">
                                                Invierte en contratos solares, eólicos o de biomasa para visualizar tu matriz energética.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {stats.energyTypeDistribution.map((item) => {
                                                const info = getEnergyLabel(item.type);
                                                return (
                                                    <div
                                                        key={item.type}
                                                        className="p-4 rounded-xl border border-gray-100 bg-slate-50 space-y-2"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2.5">
                                                                <span
                                                                    className="w-3.5 h-3.5 rounded-full inline-block border border-black/10"
                                                                    style={{ backgroundColor: info.color }}
                                                                />
                                                                <span className="font-bold text-sm text-slate-900">
                                                                    {info.label}
                                                                </span>
                                                            </div>
                                                            <span className="font-black text-sm text-slate-900">
                                                                {item.percentage}% ($
                                                                {item.amount.toLocaleString()})
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-black rounded-full"
                                                                style={{ width: `${item.percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <Link
                                        href="/mercado-primario"
                                        className="w-full py-3.5 rounded-xl border-2 border-black bg-white text-black hover:bg-black hover:text-primary font-black text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                                        Diversificar Matriz Energética
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* CERTIFICADO DE IMPACTO AMBIENTAL MODAL */}
            {showCertificateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border-4 border-black relative">
                        <button
                            onClick={() => setShowCertificateModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-black"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-black mx-auto shadow-xs">
                                <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Wattismoney Green Energy SPV • Certificado Oficial
                            </p>
                            <h3 className="text-2xl font-black text-slate-900">
                                Certificado de Descarbonización e Impacto PPA
                            </h3>
                            <p className="text-sm text-slate-600">
                                Se certifica que <strong>{session?.user?.name || session?.user?.email}</strong> ha
                                financiado activamente infraestructura de energía renovable con los siguientes indicadores:
                            </p>

                            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-gray-200 my-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-400">Energía Limpia</p>
                                    <p className="text-lg font-black text-slate-900">{energyMwh} MWh</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-400">CO₂ Mitigado</p>
                                    <p className="text-lg font-black text-emerald-600">{co2Tons} Ton</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-400">Contratos PPA</p>
                                    <p className="text-lg font-black text-slate-900">{stats.totalContracts}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 py-3 bg-primary hover:brightness-95 text-black font-black rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[18px]">print</span>
                                    Imprimir / Guardar PDF
                                </button>
                                <button
                                    onClick={() => setShowCertificateModal(false)}
                                    className="px-5 py-3 border border-gray-300 rounded-xl text-sm font-bold text-slate-700"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
