'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

const Cartera: React.FC = () => {
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
                    <p className="text-sm text-slate-500">Gestiona tu liquidez, rendimientos y aportes.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-500 hover:text-black transition-colors rounded-full hover:bg-gray-100">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="hidden md:block h-8 w-px bg-gray-200"></div>
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Valor Total</span>
                        <span className="text-sm font-bold text-text-main">$14,582.45</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-gray-50/50">
                <div className="max-w-7xl mx-auto space-y-6 pb-10">

                    {/* Top Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Liquidity Card */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-8 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute right-0 top-0 p-8 opacity-5 pointer-events-none">
                                <span className="material-symbols-outlined text-[10rem]">account_balance_wallet</span>
                            </div>
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                                    <div>
                                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Dinero Disponible</p>
                                        <h2 className="text-5xl font-bold text-text-main mt-2">$2,132.45</h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm text-slate-500">Disponible para nuevas inversiones</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 uppercase font-bold">Rendimientos Totales</span>
                                            <span className="text-xl font-bold text-green-600">+$984.00</span>
                                            <span className="text-xs text-green-700 flex items-center gap-1 mt-1 bg-green-50 px-2 py-0.5 rounded-full w-fit font-bold">
                                                <span className="material-symbols-outlined text-xs">trending_up</span> 8.4% TIR
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <button className="flex-1 bg-primary hover:bg-primary-hover text-black text-base font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3">
                                        <span className="material-symbols-outlined">add_card</span>
                                        Ingresar dinero desde banco
                                    </button>
                                    <button className="bg-white hover:bg-gray-50 text-text-main border border-gray-200 font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">move_up</span>
                                        Retirar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Dark Promo Card */}
                        <div className="bg-black rounded-xl shadow-lg p-6 relative overflow-hidden text-white flex flex-col justify-between border border-gray-800">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary rounded-full blur-[60px] opacity-20"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <p className="text-primary text-xs font-bold uppercase tracking-widest">Oportunidad Global</p>
                                </div>
                                <h3 className="text-xl font-bold mb-2 font-display">Faltan $1.2M para activar el Parque Solar Atacama</h3>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">Tu aporte ayuda a cerrar la brecha financiera y acelerar la transición energética hoy.</p>
                                <div className="mb-2 flex justify-between text-xs font-bold text-gray-400">
                                    <span>Progreso Global</span>
                                    <span>65%</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-6">
                                    <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <Link href="/mercado-primario" className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">bolt</span>
                                    Aportar Liquidez
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Active Contracts Table */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-lg text-text-main">Rendimiento de Contratos Activos</h3>
                                <Link href="/mercado-primario" className="text-sm font-bold text-slate-500 hover:text-black flex items-center gap-1 transition-colors">
                                    Ver todo <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Proyecto</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Inversión</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">TIR Actual</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ganancia</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-black">
                                                        <span className="material-symbols-outlined text-lg">solar_power</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-main">Solar Andalucía I</p>
                                                        <p className="text-xs text-slate-500">PPA #4092</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-medium text-text-main">$8,500.00</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-bold text-green-600">8.2%</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-bold text-green-600">+$692.40</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                    Generando
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-black">
                                                        <span className="material-symbols-outlined text-lg">air</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-main">Eólica del Norte</p>
                                                        <p className="text-xs text-slate-500">PPA #3105</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-medium text-text-main">$3,950.00</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-bold text-green-600">7.8%</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-bold text-green-600">+$291.60</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                    Generando
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-black">
                                                        <span className="material-symbols-outlined text-lg">wb_sunny</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-main">Biomasa Central</p>
                                                        <p className="text-xs text-slate-500">PPA #5501</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-medium text-text-main">$0.00</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-bold text-gray-400">-</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-bold text-gray-400">$0.00</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    Pendiente
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* History List */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-lg text-text-main">Historial</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-slate-500">
                                            <span className="material-symbols-outlined">arrow_downward</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-main">Retiro a Banco</span>
                                            <span className="text-xs text-slate-500">12 Oct, 2023</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-text-main">-$500.00</span>
                                </div>
                                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-black">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-main">Rendimiento Mensual</span>
                                            <span className="text-xs text-slate-500">01 Oct, 2023</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">+$124.50</span>
                                </div>
                                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-black">
                                            <span className="material-symbols-outlined">arrow_upward</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-main">Depósito Bancario</span>
                                            <span className="text-xs text-slate-500">28 Sep, 2023</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">+$2,000.00</span>
                                </div>
                                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-black">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-main">Rendimiento Mensual</span>
                                            <span className="text-xs text-slate-500">01 Sep, 2023</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">+$122.10</span>
                                </div>
                                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-slate-500">
                                            <span className="material-symbols-outlined">shopping_cart</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-main">Inversión Solar I</span>
                                            <span className="text-xs text-slate-500">15 Ago, 2023</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-text-main">-$1,000.00</span>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 text-center">
                                <button className="text-xs font-bold text-slate-500 hover:text-black uppercase tracking-wide">Ver historial completo</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="max-w-7xl mx-auto py-6 border-t border-gray-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
                    <p>© 2024 Wattismoney. Inversión responsable y transparente.</p>
                    <div className="flex gap-4 mt-2 md:mt-0">
                        <a className="hover:text-black transition-colors" href="#">Privacidad</a>
                        <a className="hover:text-black transition-colors" href="#">Términos</a>
                        <a className="hover:text-black transition-colors" href="#">Soporte</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Cartera;
