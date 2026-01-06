'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

export default function HojaDeRuta() {
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
                    <Link href="/hoja-de-ruta" className="text-black font-semibold">Hoja de Ruta</Link>
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
                <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">Roadmap 2024-2025</span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 max-w-4xl mx-auto">
                    Nuestra Hoja de Ruta hacia el Futuro
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                    Descubre los próximos hitos y funcionalidades que estamos desarrollando para mejorar tu experiencia de inversión sostenible.
                </p>
            </section>

            {/* Timeline */}
            <section className="max-w-[900px] mx-auto px-4 md:px-10 pb-20">
                <div className="relative">
                    {/* Line */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2"></div>

                    {/* Q1 2024 */}
                    <div className="relative flex flex-col md:flex-row items-start mb-12">
                        <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-2">Completado</span>
                            <h3 className="text-xl font-bold">Q1 2024</h3>
                            <p className="text-gray-600 mt-2">Lanzamiento de la plataforma de inversión con acceso al mercado primario de contratos PPA.</p>
                        </div>
                        <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 border-4 border-white"></div>
                        <div className="md:w-1/2 md:pl-12"></div>
                    </div>

                    {/* Q2 2024 */}
                    <div className="relative flex flex-col md:flex-row items-start mb-12">
                        <div className="md:w-1/2 md:pr-12"></div>
                        <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 border-4 border-white"></div>
                        <div className="md:w-1/2 md:pl-12 mb-4 md:mb-0">
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-2">Completado</span>
                            <h3 className="text-xl font-bold">Q2 2024</h3>
                            <p className="text-gray-600 mt-2">Implementación del sistema de verificación KYC y perfil de inversor automatizado.</p>
                        </div>
                    </div>

                    {/* Q3 2024 */}
                    <div className="relative flex flex-col md:flex-row items-start mb-12">
                        <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                            <span className="inline-block bg-primary text-black text-xs font-bold px-3 py-1 rounded-full mb-2">En Progreso</span>
                            <h3 className="text-xl font-bold">Q3 2024</h3>
                            <p className="text-gray-600 mt-2">Lanzamiento del mercado secundario para compra y venta de posiciones entre inversores.</p>
                        </div>
                        <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 border-4 border-white animate-pulse"></div>
                        <div className="md:w-1/2 md:pl-12"></div>
                    </div>

                    {/* Q4 2024 */}
                    <div className="relative flex flex-col md:flex-row items-start mb-12">
                        <div className="md:w-1/2 md:pr-12"></div>
                        <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-gray-300 rounded-full transform -translate-x-1/2 border-4 border-white"></div>
                        <div className="md:w-1/2 md:pl-12 mb-4 md:mb-0">
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-2">Planificado</span>
                            <h3 className="text-xl font-bold">Q4 2024</h3>
                            <p className="text-gray-600 mt-2">App móvil nativa para iOS y Android con notificaciones en tiempo real.</p>
                        </div>
                    </div>

                    {/* Q1 2025 */}
                    <div className="relative flex flex-col md:flex-row items-start">
                        <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-2">Planificado</span>
                            <h3 className="text-xl font-bold">Q1 2025</h3>
                            <p className="text-gray-600 mt-2">Expansión internacional a nuevos mercados en Europa y Latinoamérica.</p>
                        </div>
                        <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-gray-300 rounded-full transform -translate-x-1/2 border-4 border-white"></div>
                        <div className="md:w-1/2 md:pl-12"></div>
                    </div>
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
