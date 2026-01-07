'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

const UserImpact: React.FC = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-background-light font-display text-text-main">
            {/* Dashboard Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
                <div className="md:hidden flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <WattismoneyLogo className="h-8 w-auto" />
                    </Link>
                </div>
                <div className="hidden md:flex flex-col">
                    <h1 className="text-xl font-bold text-text-main">Perfil de Impacto</h1>
                    <p className="text-sm text-slate-500">Visualiza cómo tus inversiones ayudan al planeta.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-primary-hover text-black text-sm font-bold transition-colors shadow-sm">
                        <span className="truncate">Descargar Reporte</span>
                    </button>
                    <div className="hidden md:block h-8 w-px bg-gray-200"></div>
                    <button className="relative p-2 text-slate-500 hover:text-black transition-colors rounded-full hover:bg-gray-100">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-gray-50/50">
                <div className="max-w-7xl mx-auto space-y-8 pb-10">

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-text-main">
                                Tu Impacto Ambiental
                            </h1>
                            <p className="text-slate-500 text-lg font-medium leading-normal">
                                Impacto generado por tus contratos activos en tiempo real.
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button className="flex h-10 items-center justify-center rounded-full bg-primary text-black px-6 shadow-sm hover:bg-primary-hover transition-colors border border-black/10">
                                <p className="text-sm font-bold">Todo el tiempo</p>
                            </button>
                            <button className="flex h-10 items-center justify-center rounded-full bg-white border border-gray-200 text-slate-500 px-6 hover:bg-gray-50 transition-colors">
                                <p className="text-sm font-semibold">Este año</p>
                            </button>
                            <button className="flex h-10 items-center justify-center rounded-full bg-white border border-gray-200 text-slate-500 px-6 hover:bg-gray-50 transition-colors">
                                <p className="text-sm font-semibold">Este mes</p>
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">CO2 Evitado</p>
                                <div className="bg-primary/20 p-2 rounded-lg text-black">
                                    <span className="material-symbols-outlined text-2xl">cloud_off</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-text-main tracking-tight text-4xl font-black">12.5 Ton</p>
                                <div className="flex items-center gap-1 mt-2 bg-green-50 w-fit px-2 py-1 rounded-md">
                                    <span className="material-symbols-outlined text-green-700 text-sm">trending_up</span>
                                    <p className="text-green-700 text-sm font-bold">+12% vs mes anterior</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Energía Generada</p>
                                <div className="bg-primary/20 p-2 rounded-lg text-black">
                                    <span className="material-symbols-outlined text-2xl">bolt</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-text-main tracking-tight text-4xl font-black">48.2 MWh</p>
                                <div className="flex items-center gap-1 mt-2 bg-green-50 w-fit px-2 py-1 rounded-md">
                                    <span className="material-symbols-outlined text-green-700 text-sm">trending_up</span>
                                    <p className="text-green-700 text-sm font-bold">+5% vs mes anterior</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Árboles Equivalentes</p>
                                <div className="bg-primary/20 p-2 rounded-lg text-black">
                                    <span className="material-symbols-outlined text-2xl">park</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-text-main tracking-tight text-4xl font-black">350 Árboles</p>
                                <div className="flex items-center gap-1 mt-2 bg-green-50 w-fit px-2 py-1 rounded-md">
                                    <span className="material-symbols-outlined text-green-700 text-sm">trending_up</span>
                                    <p className="text-green-700 text-sm font-bold">+8% vs mes anterior</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Real World Impact */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 h-full shadow-sm">
                                <div className="mb-8">
                                    <h2 className="text-text-main text-2xl font-bold leading-tight mb-2">
                                        Impacto en la Vida Real
                                    </h2>
                                    <p className="text-slate-500 text-base font-medium">
                                        Más allá de los números: así se ve tu contribución en el mundo cotidiano.
                                    </p>
                                </div>
                                <div className="grid gap-4">
                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-transparent hover:border-primary transition-all duration-300">
                                        <div className="p-3 bg-white rounded-full shadow-sm text-black border border-gray-100">
                                            <span className="material-symbols-outlined">directions_car</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-text-main text-lg font-bold">Coches fuera de la carretera</h3>
                                            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                                                Has compensado las emisiones de <span className="bg-primary/30 px-1 rounded font-bold text-black">45 coches</span> de combustión interna este año.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-transparent hover:border-primary transition-all duration-300">
                                        <div className="p-3 bg-white rounded-full shadow-sm text-black border border-gray-100">
                                            <span className="material-symbols-outlined">flight_takeoff</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-text-main text-lg font-bold">Viajes Madrid-Barcelona</h3>
                                            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                                                Ahorro de CO2 similar a evitar <span className="bg-primary/30 px-1 rounded font-bold text-black">500 vuelos</span> cortos regionales.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-transparent hover:border-primary transition-all duration-300">
                                        <div className="p-3 bg-white rounded-full shadow-sm text-black border border-gray-100">
                                            <span className="material-symbols-outlined">home</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-text-main text-lg font-bold">Casas energizadas</h3>
                                            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                                                Energía limpia suficiente para abastecer <span className="bg-primary/30 px-1 rounded font-bold text-black">12 hogares</span> completos durante 12 meses.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Investment Distribution */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 h-full shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-text-main text-xl font-bold leading-tight">
                                        Distribución de Inversión
                                    </h2>
                                    <button className="text-slate-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                                <div className="flex flex-col items-center justify-center py-4">
                                    <div
                                        className="mb-8 shadow-xl rounded-full relative"
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            background: 'conic-gradient(#eeff00 0% 45%, #000000 45% 75%, #a3a3a3 75% 90%, #e5e7eb 90% 100%)'
                                        }}
                                    >
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                                            <span className="text-3xl font-black text-text-main">100%</span>
                                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Renovable</span>
                                        </div>
                                    </div>
                                    <div className="w-full grid grid-cols-1 gap-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors bg-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded bg-[#eeff00] border border-black/10 shadow-sm"></div>
                                                <span className="text-base font-bold text-text-main">Energía Solar</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-black text-text-main">45%</p>
                                                <p className="text-xs text-slate-500 font-medium">€4,500</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors bg-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded bg-[#000000] border border-black/10 shadow-sm"></div>
                                                <span className="text-base font-bold text-text-main">Eólica</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-black text-text-main">30%</p>
                                                <p className="text-xs text-slate-500 font-medium">€3,000</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors bg-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded bg-[#a3a3a3] border border-black/10 shadow-sm"></div>
                                                <span className="text-base font-bold text-text-main">Biomasa</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-black text-text-main">15%</p>
                                                <p className="text-xs text-slate-500 font-medium">€1,500</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors bg-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded bg-[#e5e7eb] border border-black/10 shadow-sm"></div>
                                                <span className="text-base font-bold text-text-main">Hidroeléctrica</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-black text-text-main">10%</p>
                                                <p className="text-xs text-slate-500 font-medium">€1,000</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button className="w-full py-4 rounded-xl border-2 border-black bg-white text-black hover:bg-black hover:text-[#eeff00] font-black text-sm uppercase tracking-wide transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                                        Diversificar Portafolio
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default UserImpact;
