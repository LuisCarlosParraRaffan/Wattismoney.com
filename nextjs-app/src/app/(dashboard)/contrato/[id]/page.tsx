'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WattismoneyLogo } from '@/components/Icons';

export default function ContractDetail() {
    const params = useParams();
    const contractId = params.id as string;

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark font-display text-text-main">
            {/* Header */}
            <header className="h-20 bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 md:px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/mercado-primario" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-text-main dark:text-white">Detalle del Contrato</h1>
                        <p className="text-xs text-gray-500">ID: {contractId}</p>
                    </div>
                </div>
                <Link href="/" className="hidden md:block">
                    <WattismoneyLogo className="h-8 w-auto" />
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50 dark:bg-background-dark">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Hero */}
                            <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCiqBdJMue9D-ai5CSYnkYLI5Quat4LvHRK8oFQwIKykRWJGD6D71ZHYWFYaORCzvpUI-FKXMkr0c6BH94x8yCU52ipQO5QkdcuzSYwa00IoEA37KSizinCzulJ3etlfLFYoi5_Aoba5c7pwX0OGd4eqYHzji4CldFur_yxmEUIDRt_equSjqQvp5XxQTlFWlyCCehMUqFjKzjA3bg3kj7RQHeewE0YUnoY6WDv-q3rsoVRsybfxguT-8WvyhskctKHShDttzCEoxA")' }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <span className="px-3 py-1 bg-primary text-black text-xs font-bold rounded-full mb-2 inline-block">Solar</span>
                                        <h2 className="text-3xl font-black text-white">Parque Solar Atacama IV</h2>
                                        <p className="text-gray-300 flex items-center gap-1 mt-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            Atacama, Chile
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Este proyecto solar fotovoltaico de última generación suministra energía limpia a una de las principales mineras de la región.
                                        Con un contrato PPA a 5 años, garantiza estabilidad de ingresos y contribuye significativamente a la reducción de emisiones de CO2.
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white dark:bg-[#1a1a2e] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Capacidad</p>
                                    <p className="text-xl font-black text-black dark:text-white">10 MW</p>
                                </div>
                                <div className="bg-white dark:bg-[#1a1a2e] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Plazo</p>
                                    <p className="text-xl font-black text-black dark:text-white">5 años</p>
                                </div>
                                <div className="bg-white dark:bg-[#1a1a2e] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                    <p className="text-xs text-gray-500 uppercase font-bold">TIR Estimada</p>
                                    <p className="text-xl font-black text-green-600">8.2%</p>
                                </div>
                                <div className="bg-white dark:bg-[#1a1a2e] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                    <p className="text-xs text-gray-500 uppercase font-bold">CO2 Evitado/Año</p>
                                    <p className="text-xl font-black text-black dark:text-white">850 t</p>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                                <h3 className="font-bold text-lg mb-4">Documentación del Proyecto</h3>
                                <div className="space-y-3">
                                    <a href="#" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-gray-400">description</span>
                                        <span className="font-medium">Resumen Ejecutivo</span>
                                        <span className="ml-auto text-xs text-gray-500">PDF • 2.4 MB</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-gray-400">description</span>
                                        <span className="font-medium">Contrato PPA</span>
                                        <span className="ml-auto text-xs text-gray-500">PDF • 5.1 MB</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-gray-400">description</span>
                                        <span className="font-medium">Due Diligence Técnico</span>
                                        <span className="ml-auto text-xs text-gray-500">PDF • 8.7 MB</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Investment */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-800 sticky top-6">
                                <h3 className="font-bold text-lg mb-4">Invertir en este Proyecto</h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-500">Financiado</span>
                                            <span className="font-bold">75%</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>$750,000</span>
                                            <span>$1,000,000</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Inversión Mínima</p>
                                        <p className="text-2xl font-black text-black dark:text-white">$500 USD</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block">
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Monto a invertir</span>
                                        <div className="relative mt-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                                placeholder="1,000"
                                                defaultValue={1000}
                                            />
                                        </div>
                                    </label>

                                    <button className="w-full py-4 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">bolt</span>
                                        Invertir Ahora
                                    </button>

                                    <p className="text-xs text-gray-500 text-center">
                                        Al invertir, aceptas los <a href="#" className="underline">términos y condiciones</a>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-600">verified</span>
                                    <div>
                                        <p className="font-bold text-green-800 dark:text-green-400 text-sm">Proyecto Verificado</p>
                                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">Este proyecto ha pasado nuestra auditoría técnica y legal (Due Diligence).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
