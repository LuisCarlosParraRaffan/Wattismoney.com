'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

export default function KYCSuccess() {
    return (
        <div className="bg-background-light text-text-main font-display antialiased min-h-screen flex flex-col">
            <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 lg:px-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                </Link>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg space-y-8 text-center">
                    <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-green-100 p-4">
                        <span className="material-symbols-outlined text-[64px] text-green-600">verified</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl">
                            ¡Verificación Completada!
                        </h1>
                        <p className="text-base text-gray-600 sm:text-lg">
                            Tu documentación ha sido recibida correctamente. Nuestro equipo la revisará en las próximas <strong>24-48 horas</strong>.
                        </p>
                    </div>

                    <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                        <div className="bg-gray-50 p-6">
                            <div className="flex flex-col gap-4">
                                <Link href="/investor-profile" className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-black shadow-sm transition-transform hover:scale-[1.02] hover:bg-primary-hover">
                                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                                    Completar Perfil de Inversor
                                </Link>
                                <Link href="/dashboard" className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-6 text-base font-semibold text-black hover:bg-gray-50">
                                    Ir al Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-2 text-sm text-gray-400">
                        <p>Estado de tu verificación:</p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-green-600">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span>Email</span>
                            </div>
                            <div className="h-px w-8 bg-green-300"></div>
                            <div className="flex items-center gap-2 text-green-600">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span>KYC</span>
                            </div>
                            <div className="h-px w-8 bg-gray-200"></div>
                            <div className="flex items-center gap-2 font-medium text-black">
                                <span className="material-symbols-outlined text-lg text-primary">pending</span>
                                <span>Invertir</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
