'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

export default function ComoFunciona() {
    return (
        <div className="bg-background-light text-text-main antialiased overflow-x-hidden font-display min-h-screen">
            {/* Navigation */}
            <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 font-sans">
                <Link href="/" className="flex items-center gap-3 group">
                    <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="/contratos" className="hover:text-black transition-colors">Contratos</Link>
                    <Link href="/impacto" className="hover:text-black transition-colors">Impacto</Link>
                    <Link href="/como-funciona" className="text-black font-semibold">Cómo Funciona</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-gray-600 hidden sm:block">Login</Link>
                    <Link href="/signup" className="bg-primary text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm">
                        Registro
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24 text-center">
                <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">¿Cómo Funciona?</span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 max-w-4xl mx-auto">
                    Invierte en energía sostenible en 3 simples pasos
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Wattismoney te permite participar en la financiación de proyectos de energía renovable con total transparencia y rendimientos atractivos.
                </p>
            </section>

            {/* Steps */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-10 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all">
                        <div className="absolute -top-4 left-8">
                            <span className="bg-primary text-black text-lg font-black px-4 py-2 rounded-full">01</span>
                        </div>
                        <div className="pt-6">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">person_add</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Regístrate y Verifica</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Crea tu cuenta en minutos. Completa el proceso de verificación KYC para cumplir con las regulaciones y proteger tu inversión.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all">
                        <div className="absolute -top-4 left-8">
                            <span className="bg-primary text-black text-lg font-black px-4 py-2 rounded-full">02</span>
                        </div>
                        <div className="pt-6">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">search</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Explora Oportunidades</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Navega por los proyectos disponibles. Analiza rendimientos, plazos, riesgos y el impacto ambiental de cada contrato PPA.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all">
                        <div className="absolute -top-4 left-8">
                            <span className="bg-primary text-black text-lg font-black px-4 py-2 rounded-full">03</span>
                        </div>
                        <div className="pt-6">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">trending_up</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Invierte y Gana</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Selecciona el monto y confirma tu inversión. Recibe rendimientos mensuales mientras contribuyes a un futuro más limpio.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-16">
                    <Link href="/signup" className="inline-flex items-center justify-center rounded-lg h-14 px-10 bg-primary hover:bg-primary-hover text-black text-lg font-bold shadow-lg transition-all">
                        Comenzar Ahora
                        <span className="material-symbols-outlined ml-2">arrow_forward</span>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full bg-white border-t border-gray-200 py-10">
                <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <WattismoneyLogo className="h-6 w-auto opacity-50" />
                        <span className="text-sm font-bold text-gray-900">Wattismoney</span>
                    </div>
                    <p className="text-sm text-gray-400">© 2024 Wattismoney. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
