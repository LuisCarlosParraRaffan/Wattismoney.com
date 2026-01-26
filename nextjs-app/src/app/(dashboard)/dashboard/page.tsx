'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

interface DashboardStats {
    totalInvested: number;
    totalContracts: number;
    averageTIR: number;
    expectedReturn: number;
    netGain: number;
    totalEnergy: number;
    co2Avoided: number;
    industriesImpacted: number;
    energyTypeDistribution: {
        type: string;
        amount: number;
        percentage: number;
    }[];
    activeInvestments: {
        id: string;
        contractId: string;
        contractName: string;
        contractLocation: string;
        energyType: string;
        investmentAmount: number;
        expectedReturn: number;
        annualReturn: number;
        status: string;
        contractStatus: string;
        industry: string;
        createdAt: string;
    }[];
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/user/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Use explicit locale to prevent hydration mismatch
    const formatNumber = (value: number, decimals: number = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    };

    const getEnergyIcon = (type: string) => {
        switch (type) {
            case 'SOLAR': return 'sunny';
            case 'WIND': return 'air';
            case 'HYDRO': return 'water_drop';
            default: return 'bolt';
        }
    };

    const limitIndustryName = (name: string) => {
        if (!name) return 'General';
        if (name.length > 20) return name.substring(0, 20) + '...';
        return name;
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Default values if no stats (new user)
    const data = stats || {
        totalInvested: 0,
        totalContracts: 0,
        averageTIR: 0,
        expectedReturn: 0,
        netGain: 0,
        totalEnergy: 0,
        co2Avoided: 0,
        industriesImpacted: 0,
        energyTypeDistribution: [],
        activeInvestments: []
    };

    return (
        <>
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                {/* Mobile Logo */}
                <div className="md:hidden flex items-center gap-2">
                    <WattismoneyLogo className="h-8 w-auto" />
                </div>

                {/* Page Title */}
                <div className="hidden md:flex flex-col">
                    <h1 className="text-xl font-bold text-text-main">Resumen de Cartera</h1>
                    <p className="text-sm text-slate-500">Impacto energético y financiero al día de hoy.</p>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-500 hover:text-black transition-colors rounded-full hover:bg-gray-100">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <Link href="/mercado-primario" className="bg-primary hover:bg-primary-hover text-text-main px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span>Nueva Inversión</span>
                    </Link>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth bg-white">
                <div className="max-w-7xl mx-auto space-y-8 pb-10">

                    {/* Metrics Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Energy Transactioned */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-5">
                                <span className="material-symbols-outlined text-9xl">bolt</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Energía Financiada</p>
                                <div className="flex items-baseline gap-1">
                                    <h3 className="text-3xl font-bold text-text-main">{formatNumber(data.totalEnergy, 2)} GWh</h3>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">energy_savings_leaf</span>
                                        Renovable
                                    </div>
                                    <span className="text-xs text-slate-500">Estimado total</span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-full opacity-50"></div>
                            </div>
                        </div>

                        {/* Industries Supported */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-5">
                                <span className="material-symbols-outlined text-9xl">factory</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Industrias Apoyadas</p>
                                <div className="flex items-baseline gap-1">
                                    <h3 className="text-3xl font-bold text-text-main">{data.industriesImpacted}</h3>
                                </div>
                                <div className="mt-4 flex -space-x-2 overflow-hidden h-6">
                                    {/* Placeholder avatars if count > 0 */}
                                    {data.industriesImpacted > 0 && (
                                        <>
                                            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs">🏭</div>
                                            {data.industriesImpacted > 1 && <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs">🏢</div>}
                                            {data.industriesImpacted > 2 && <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs text-slate-500 text-[10px] font-bold">+{data.industriesImpacted - 2}</div>}
                                        </>
                                    )}
                                    {data.industriesImpacted === 0 && <span className="text-xs text-slate-400">Sin industrias aún</span>}
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
                                <div className="h-full bg-black w-2/4"></div>
                            </div>
                        </div>

                        {/* Environmental Impact */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Impacto Ambiental</p>
                                <div className="flex items-baseline gap-1">
                                    <h3 className="text-3xl font-bold text-text-main">{formatNumber(data.co2Avoided, 1)} Ton</h3>
                                    <span className="text-sm font-medium text-slate-500">CO2e</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                                    Equivalente a retirar <span className="font-bold text-text-main">{Math.round(data.co2Avoided / 4.6)} autos</span> de circulación por un año.
                                </p>
                            </div>
                        </div>

                        {/* Financial Performance */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Inversión Total</p>
                                <div className="flex items-baseline gap-1">
                                    <h3 className="text-3xl font-bold text-text-main">{formatCurrency(data.totalInvested)}</h3>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">TIR Prom.</span>
                                        <span className="text-sm font-bold text-green-600">{data.averageTIR}%</span>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200 mx-2"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Ganancia Est.</span>
                                        <span className="text-sm font-bold text-text-main">{formatCurrency(data.netGain)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Visualization Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Impact Flow */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-text-main">Flujo de Impacto</h2>
                                    <p className="text-sm text-slate-500">Tu inversión conectando generación limpia con consumo industrial.</p>
                                </div>
                                <Link href="/mi-impacto" className="text-xs font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">Ver Detalles</Link>
                            </div>

                            <div className="relative w-full h-64 flex items-center justify-between px-4">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                                <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-gradient-to-r from-primary to-transparent -z-0"></div>

                                {/* Node 1: Generation */}
                                <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-white border-4 border-primary shadow-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl text-black">solar_power</span>
                                    </div>
                                    <div className="text-center bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                        <p className="font-bold text-sm">Generación</p>
                                        <p className="text-xs text-slate-500">Solar &amp; Eólica</p>
                                    </div>
                                </div>

                                {/* Node 2: Investment (User) */}
                                <div className="relative z-10 flex flex-col items-center -mt-12">
                                    <div className="bg-black text-primary px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-lg animate-bounce">
                                        TU APORTE
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-black shadow-xl flex items-center justify-center border-4 border-white">
                                        <span className="material-symbols-outlined text-xl text-primary">account_balance_wallet</span>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className="text-xs font-bold">{formatCurrency(data.totalInvested / 1000)}k Invertidos</p>
                                    </div>
                                </div>

                                {/* Node 3: Industry */}
                                <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-200 shadow-lg flex items-center justify-center mb-3 group-hover:border-black transition-colors group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl text-black">domain</span>
                                    </div>
                                    <div className="text-center bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                        <p className="font-bold text-sm">Industria</p>
                                        <p className="text-xs text-slate-500">{data.industriesImpacted} Sectores</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-4 bg-gray-50 rounded-lg p-4">
                                <div className="text-center border-r border-gray-200">
                                    <p className="text-xs text-slate-500">Origen</p>
                                    <p className="font-bold text-sm">100% Renovable</p>
                                </div>
                                <div className="text-center border-r border-gray-200">
                                    <p className="text-xs text-slate-500">Contratos Activos</p>
                                    <p className="font-bold text-sm">{data.totalContracts} PPAs</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-slate-500">Destino</p>
                                    <p className="font-bold text-sm">Empresas Locales</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefited Sectors Distribution */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <h3 className="text-lg font-bold text-text-main mb-6">Distribución de Energía</h3>
                            <div className="flex-1 flex flex-col justify-center space-y-6">
                                {data.energyTypeDistribution.length > 0 ? (
                                    data.energyTypeDistribution.map((item, index) => (
                                        <div className="group" key={index}>
                                            <div className="flex justify-between items-end mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="p-1.5 bg-gray-100 rounded-md text-black">
                                                        <span className="material-symbols-outlined text-sm">{getEnergyIcon(item.type)}</span>
                                                    </span>
                                                    <span className="text-sm font-semibold">{item.type}</span>
                                                </div>
                                                <span className="text-sm font-bold">{item.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-black' : 'bg-gray-400'}`}
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-400 py-10">
                                        <p>No hay datos de distribución aún.</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs text-slate-500 italic">
                                    *Distribución basada en tus inversiones actuales.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Active Contracts Table */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text-main">Mis Inversiones Recientes</h2>
                            <Link href="/cartera" className="text-text-main underline decoration-primary decoration-2 text-sm font-bold hover:text-black flex items-center gap-1">
                                Ver cartera completa <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Fuente de Energía</th>
                                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Industria Receptora</th>
                                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Mi Inversión</th>
                                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">TIR Contrato</th>
                                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.activeInvestments.length > 0 ? (
                                            data.activeInvestments.slice(0, 5).map((investment) => (
                                                <tr key={investment.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-text-main">
                                                                <span className="material-symbols-outlined">{getEnergyIcon(investment.energyType)}</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-text-main">{investment.contractName}</p>
                                                                <p className="text-xs text-slate-500">{investment.contractLocation}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-gray-400 text-lg">factory</span>
                                                            <span className="text-sm font-medium text-text-main">{limitIndustryName(investment.industry)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="text-sm font-bold text-text-main">{formatCurrency(investment.investmentAmount)}</div>
                                                        <div className="text-xs text-green-600">Esp: {formatCurrency(investment.expectedReturn)}</div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className="text-sm text-slate-500 font-medium">{investment.annualReturn}%</span>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-black border border-primary/20 text-xs font-bold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                            Activo
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="p-10 text-center text-slate-400">
                                                    Aún no tienes inversiones activas. ¡Explora el mercado primario!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Simple Footer */}
                <footer className="max-w-7xl mx-auto py-6 border-t border-gray-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
                    <p>© 2024 Wattismoney. Inversión responsable y transparente.</p>
                    <div className="flex gap-4 mt-2 md:mt-0">
                        <a className="hover:text-black transition-colors" href="#">Privacidad</a>
                        <a className="hover:text-black transition-colors" href="#">Términos</a>
                        <a className="hover:text-black transition-colors" href="#">Soporte</a>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Dashboard;
