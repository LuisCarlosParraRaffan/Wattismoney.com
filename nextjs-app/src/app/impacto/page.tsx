'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';
import { ImpactoHeroImage } from '@/components/AppImages';

const Impacto: React.FC = () => {
    return (
        <div className="bg-background-light text-text-main antialiased overflow-x-hidden font-display">
            <div className="relative flex min-h-screen w-full flex-col">
                {/* Navigation */}
                <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm md:shadow-none border-b border-gray-100 md:border-none font-sans">
                    <Link href="/" className="flex items-center gap-3 group">
                        <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <Link href="/contratos" className="hover:text-black transition-colors">Contratos</Link>
                        <Link href="/impacto" className="text-black font-semibold transition-colors">Impacto</Link>
                        <Link href="/hoja-de-ruta" className="hover:text-black transition-colors">Hoja de Ruta</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium hover:text-gray-600 hidden sm:block">Login</Link>
                        <Link href="/signup" className="bg-primary text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm">
                            Registro
                        </Link>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="w-full bg-white flex justify-center">
                    <div className="w-full max-w-[1280px] px-4 md:px-10 py-12 md:py-20">
                        <div className="flex flex-col-reverse lg:flex-row gap-10 items-center">
                            <div className="flex flex-col gap-6 flex-1 lg:pr-10">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-green-50 px-3 py-1">
                                    <span className="material-symbols-outlined text-green-600 text-sm">eco</span>
                                    <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Impacto Real</span>
                                </div>
                                <h1 className="text-text-main text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                                    Transformando el futuro con energía e inversión
                                </h1>
                                <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-[600px]">
                                    Wattismoney conecta la necesidad de financiación de grandes consumidores con inversores que buscan rentabilidad y propósito. Aceleramos la transición energética democratizando el acceso a proyectos sostenibles.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                    <Link href="/signup" className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-primary-hover text-text-main text-base font-bold shadow-sm transition-transform active:scale-95">
                                        Únete al Cambio
                                    </Link>
                                    <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-white border border-gray-200 hover:bg-gray-50 text-text-main text-base font-bold transition-colors">
                                        Ver Reporte 2024
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200">
                                    <div>
                                        <p className="text-3xl font-black text-text-main">100%</p>
                                        <p className="text-sm font-medium text-gray-500">Financiación Sostenible</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-text-main">+250</p>
                                        <p className="text-sm font-medium text-gray-500">Hogares Equivalentes</p>
                                    </div>
                                </div>
                            </div>
                            {/* Hero Image */}
                            <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100 relative group">
                                <ImpactoHeroImage className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                                    <div className="text-white">
                                        <p className="font-bold text-xl mb-1">Uniendo riqueza y sostenibilidad</p>
                                        <p className="text-sm opacity-90 leading-relaxed">Generamos valor financiero mientras construimos un planeta más limpio para las futuras generaciones.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission / Triple Impact Section */}
                <div className="w-full bg-gray-50 border-y border-gray-200 flex justify-center">
                    <div className="w-full max-w-[1280px] px-4 md:px-10 py-16">
                        <div className="flex flex-col gap-10">
                            <div className="text-center max-w-3xl mx-auto mb-6">
                                <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">Nuestra Misión</span>
                                <h2 className="text-text-main text-3xl md:text-4xl font-black tracking-tight mb-4">Triple Impacto: Ambiental, Social y Económico</h2>
                                <p className="text-gray-600 text-lg">
                                    Nuestra plataforma no solo busca el retorno financiero. Facilitamos la transición energética creando un ecosistema de abundancia compartida.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl hover:border-green-400 transition-all group">
                                    <div className="size-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-3xl">forest</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main mb-3">Impacto Ambiental</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Reducimos toneladas de CO2 al año facilitando la adopción de energías renovables en industrias de alto consumo.
                                    </p>
                                </div>
                                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl hover:border-primary transition-all group">
                                    <div className="size-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
                                        <span className="material-symbols-outlined text-3xl">savings</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main mb-3">Impacto Económico</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Generamos riqueza real para nuestros inversores con rendimientos competitivos, mientras optimizamos los costos energéticos.
                                    </p>
                                </div>
                                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl hover:border-blue-400 transition-all group">
                                    <div className="size-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-3xl">groups</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main mb-3">Impacto Social</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Democratizamos el acceso a la financiación de grandes infraestructuras. Cualquier persona puede ser partícipe de la revolución energética.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="w-full bg-[#f4f4f0] flex justify-center border-t border-gray-200">
                    <div className="w-full max-w-[1280px] px-4 md:px-10 py-24">
                        <div className="rounded-3xl bg-black overflow-hidden relative">
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: 'radial-gradient(#ecec13 1px, transparent 1px)',
                                    backgroundSize: '32px 32px'
                                }}
                            ></div>
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-10 md:p-20 gap-8">
                                <div className="size-16 rounded-full bg-white/10 flex items-center justify-center text-primary mb-2">
                                    <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                                </div>
                                <h2 className="text-white text-3xl md:text-5xl font-black tracking-tight max-w-3xl">
                                    Construye un futuro de abundancia sostenible
                                </h2>
                                <p className="text-gray-400 text-lg max-w-xl">
                                    Tu inversión impulsa la industria, protege el medio ambiente y hace crecer tu patrimonio. Sé parte de la solución.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                                    <Link href="/mercado-primario" className="flex items-center justify-center rounded-lg h-14 px-10 bg-primary hover:bg-primary-hover text-text-main text-lg font-bold shadow-lg transition-all hover:translate-y-[-2px]">
                                        Invertir en Impacto
                                    </Link>
                                    <button className="flex items-center justify-center rounded-lg h-14 px-10 bg-transparent border-2 border-white hover:bg-white/10 text-white text-lg font-bold transition-all">
                                        Solicitar Financiación
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full bg-white border-t border-gray-200 flex justify-center py-10">
                    <div className="w-full max-w-[1280px] px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <WattismoneyLogo className="h-6 w-auto opacity-50 hover:opacity-100 transition-all text-gray-900" />
                            <span className="text-sm font-bold text-gray-900">Wattismoney</span>
                        </div>
                        <div className="flex gap-6 text-sm text-gray-500">
                            <a className="hover:text-black" href="#">Términos</a>
                            <a className="hover:text-black" href="#">Privacidad</a>
                            <a className="hover:text-black" href="#">Contacto</a>
                        </div>
                        <p className="text-sm text-gray-400">© 2024 Wattismoney. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Impacto;
