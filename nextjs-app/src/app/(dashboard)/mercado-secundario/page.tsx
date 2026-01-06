'use client';

import React from 'react';
import Link from 'next/link';

export default function MercadoSecundario() {
    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark font-display text-text-main">
            <header className="h-20 bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 md:px-10">
                <div>
                    <h1 className="text-xl font-bold text-text-main dark:text-white">Mercado Secundario</h1>
                    <p className="text-sm text-slate-500">Posiciones de otros inversores disponibles para compra</p>
                </div>
                <Link href="/mercado-primario" className="px-4 py-2 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg text-sm">
                    Ver Mercado Primario
                </Link>
            </header>
            <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder cards */}
                        <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-yellow-700">solar_power</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white">Solar Norte I</h3>
                                    <p className="text-xs text-slate-500">Antofagasta, CL</p>
                                </div>
                            </div>
                            <div className="flex justify-between mb-4">
                                <div>
                                    <span className="text-xs text-slate-500">Precio</span>
                                    <p className="text-lg font-black text-text-main dark:text-white">$2,450</p>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500">TIR</span>
                                    <p className="text-lg font-black text-green-600">7.5%</p>
                                </div>
                            </div>
                            <button className="w-full py-2 border border-black dark:border-white rounded-lg font-bold text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                Ver Detalles
                            </button>
                        </div>
                        <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-700">wind_power</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white">Eólica Central II</h3>
                                    <p className="text-xs text-slate-500">Galicia, ES</p>
                                </div>
                            </div>
                            <div className="flex justify-between mb-4">
                                <div>
                                    <span className="text-xs text-slate-500">Precio</span>
                                    <p className="text-lg font-black text-text-main dark:text-white">$3,200</p>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500">TIR</span>
                                    <p className="text-lg font-black text-green-600">8.1%</p>
                                </div>
                            </div>
                            <button className="w-full py-2 border border-black dark:border-white rounded-lg font-bold text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
