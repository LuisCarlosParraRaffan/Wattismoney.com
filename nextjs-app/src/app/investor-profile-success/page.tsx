'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

export default function InvestorProfileSuccess() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main font-display min-h-screen flex flex-col">
            <header className="flex items-center justify-between border-b border-gray-100 bg-white dark:bg-[#1a1a2e] px-6 py-4 lg:px-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg text-center">
                    <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary/20 p-4 mb-6">
                        <span className="material-symbols-outlined text-[64px] text-black">psychology_alt</span>
                    </div>

                    <h1 className="text-3xl font-black mb-4 text-black dark:text-white">
                        ¡Perfil Completado!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                        Hemos configurado tu perfil como <strong className="text-black dark:text-white">Inversor Moderado</strong>.
                        Ahora puedes acceder a oportunidades personalizadas según tu tolerancia al riesgo.
                    </p>

                    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-8">
                        <h3 className="font-bold mb-4 text-black dark:text-white">Tu Perfil de Inversor</h3>
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-bold">Tolerancia</p>
                                <p className="text-lg font-bold text-black dark:text-white">Moderada</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-bold">Horizonte</p>
                                <p className="text-lg font-bold text-black dark:text-white">3-5 años</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-bold">Objetivo</p>
                                <p className="text-lg font-bold text-black dark:text-white">Crecimiento</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-bold">Proyectos Sugeridos</p>
                                <p className="text-lg font-bold text-green-600">12</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/mercado-primario" className="w-full py-4 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">bolt</span>
                            Explorar Oportunidades
                        </Link>
                        <Link href="/dashboard" className="w-full py-4 bg-white border border-gray-200 hover:bg-gray-50 text-black font-bold rounded-xl transition-colors dark:bg-[#1a1a2e] dark:border-gray-700 dark:text-white">
                            Ir al Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
