/**
 * ============================================================================
 * LANDING_HOJA_DE_RUTA - Página Pública "Hoja de Ruta"
 * ============================================================================
 * 
 * Esta es la página de LANDING que muestra el roadmap de Wattismoney,
 * accesible públicamente sin autenticación en la ruta /hoja-de-ruta.
 * 
 * Contenido:
 * - Título: "Hoja de Ruta de Wattismoney es sostenible"
 * - Timeline visual con 4 pasos horizontales conectados:
 *   - Inversión en parques solares (Q3 2024)
 *   - Inversión en parques eólicos (Q4 2024)
 *   - Inversión en infraestructura de carga EV (2025)
 *   - Inversión en redes inteligentes (2025)
 * - Newsletter CTA: "Mantente informado del lanzamiento"
 * - Footer completo con redes sociales
 * 
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

// SVG Icons for Roadmap steps
const SolarIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm11-4.19V1.5h-2v4.81C10.21 6.94 8.5 8.78 8.5 11c0 2.76 2.24 5 5 5 2.76 0 5-2.24 5-5 0-2.22-1.71-4.06-4-4.69zM20 10.5v2h3v-2h-3zm-8-5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm5.36 14.65l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM18.54 5.96l1.8-1.79-1.41-1.41-1.79 1.8 1.4 1.4z" />
    </svg>
);

const WindIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.5 17c0 1.65-1.35 3-3 3s-3-1.35-3-3h2c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1H2v-2h9.5c1.65 0 3 1.35 3 3zM19 6.5C19 4.57 17.43 3 15.5 3S12 4.57 12 6.5h2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S16.33 8 15.5 8H2v2h13.5C17.43 10 19 8.43 19 6.5zm-.5 4.5H2v2h16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5v2c1.93 0 3.5-1.57 3.5-3.5S20.43 11 18.5 11z" />
    </svg>
);

const ChargeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM8 18v-4.5H6L10 6v5h2l-4 7z" />
    </svg>
);

const NetworkIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 16l-4-4V8.82C14.16 8.4 15 7.3 15 6c0-1.66-1.34-3-3-3S9 4.34 9 6c0 1.3.84 2.4 2 2.82V12l-4 4H3v5h5v-3.05l4-4.2 4 4.2V21h5v-5h-4z" />
    </svg>
);

export default function LandingHojaDeRuta() {
    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* Navigation - Same as Landing page */}
            <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm md:shadow-none border-b border-gray-100 md:border-none">
                <Link href="/" className="flex items-center gap-3 group">
                    <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="/contratos" className="hover:text-black transition-colors">Contratos</Link>
                    <Link href="/impacto" className="hover:text-black transition-colors">Impacto</Link>
                    <Link href="/hoja-de-ruta" className="text-black font-semibold transition-colors">Hoja de Ruta</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-gray-600 hidden sm:block">Login</Link>
                    <Link href="/signup" className="bg-primary text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm cursor-pointer hover:opacity-90">
                        Registro
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-7xl mx-auto px-6 md:px-12 md:py-20 py-20">
                {/* Section: Headline and Intro */}
                <section className="mb-32">
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 bg-black text-primary px-3 py-1.5 rounded-full text-xs font-bold tracking-wide mb-6">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path clipRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" fillRule="evenodd"></path>
                        </svg>
                        HOJA DE RUTA
                    </div>
                    {/* Headline */}
                    <h1 className="font-extrabold leading-tight tracking-tight text-gray-900 max-w-4xl text-5xl md:text-7xl">
                        Hoja de Ruta de Wattismoney <br />
                        <span className="bg-primary px-1 inline-block">es sostenible</span>
                    </h1>
                </section>

                {/* Section: Timeline Visual */}
                <section className="relative mb-16">
                    {/* Timeline Connector Line Container */}
                    <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-4 z-0">
                        {/* The yellow line connecting the circles */}
                        <div className="w-full h-3 bg-primary border-y-2 border-black"></div>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left group">
                            {/* Large Icon Circle */}
                            <div className="w-[120px] h-[120px] md:mx-auto mb-10 relative flex items-center justify-center bg-white rounded-full border-4 border-primary shadow-xl">
                                <SolarIcon className="w-10 h-10 z-10 opacity-80" />
                            </div>
                            {/* Content Block */}
                            <div className="flex flex-col h-full">
                                {/* Small Icon */}
                                <div className="mb-4 mx-auto md:mx-0 bg-primary w-10 h-10 rounded-lg border border-black flex items-center justify-center">
                                    <SolarIcon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 leading-tight">Inversión en parques solares</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                    Invierta en la fuente de energía más abundante. Proyectos fotovoltaicos a gran escala con contratos de venta de energía a largo plazo.
                                </p>
                                {/* Pill Date Tag */}
                                <span className="inline-block bg-primary py-1 rounded text-xs font-bold border border-transparent self-center md:self-start px-5 text-black">
                                    Q3 2024
                                </span>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left group">
                            {/* Large Icon Circle */}
                            <div className="w-[120px] h-[120px] md:mx-auto mb-10 relative flex items-center justify-center bg-white rounded-full border-4 border-primary shadow-xl">
                                <WindIcon className="w-10 h-10 z-10 opacity-80" />
                            </div>
                            {/* Content Block */}
                            <div className="flex flex-col h-full">
                                <div className="mb-4 mx-auto md:mx-0 bg-primary w-10 h-10 rounded-lg border border-black flex items-center justify-center">
                                    <WindIcon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 leading-tight">Inversión en parques eólicos</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                    Aproveche la fuerza del viento. Turbinas de última generación en ubicaciones estratégicas offshore y onshore de alto rendimiento.
                                </p>
                                <span className="inline-block bg-primary py-1 rounded text-xs font-bold border border-transparent self-center md:self-start px-5 text-black">
                                    Q4 2024
                                </span>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left group">
                            {/* Large Icon Circle */}
                            <div className="w-[120px] h-[120px] md:mx-auto mb-10 relative flex items-center justify-center bg-white rounded-full border-4 border-primary shadow-xl">
                                <ChargeIcon className="w-10 h-10 z-10 opacity-80" />
                            </div>
                            {/* Content Block */}
                            <div className="flex flex-col h-full">
                                <div className="mb-4 mx-auto md:mx-0 bg-primary w-10 h-10 rounded-lg border border-black flex items-center justify-center">
                                    <ChargeIcon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 leading-tight">Inversión en infraestructura de carga de vehículos eléctricos</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                    Infraestructura crítica para el mañana. Redes de estaciones de carga rápida para vehículos eléctricos en corredores urbanos.
                                </p>
                                <span className="inline-block bg-primary py-1 rounded text-xs font-bold border border-transparent self-center md:self-start px-5 text-black">
                                    2025
                                </span>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left group">
                            {/* Large Icon Circle */}
                            <div className="w-[120px] h-[120px] md:mx-auto mb-10 relative flex items-center justify-center bg-white rounded-full border-4 border-primary shadow-xl">
                                <NetworkIcon className="w-10 h-10 z-10 opacity-80" />
                            </div>
                            {/* Content Block */}
                            <div className="flex flex-col h-full">
                                <div className="mb-4 mx-auto md:mx-0 bg-primary w-10 h-10 rounded-lg border border-black flex items-center justify-center">
                                    <NetworkIcon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 leading-tight">Inversión en redes inteligentes</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                    La columna vertebral de la eficiencia. Tecnología de distribución y almacenamiento optimizada mediante Inteligencia Artificial.
                                </p>
                                <span className="inline-block bg-primary py-1 rounded text-xs font-bold border border-transparent self-center md:self-start px-5 text-black">
                                    2025
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Newsletter CTA */}
                <section className="mt-32">
                    <div className="w-full rounded-2xl p-8 md:p-16 text-white relative overflow-hidden group shadow-neon bg-black" style={{ boxShadow: '0 0 0 1px #333, 0 20px 50px -10px rgba(0,0,0,0.5)' }}>
                        {/* Subtle Glow Effect within card */}
                        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary opacity-5 blur-[100px] pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                            {/* Text Content */}
                            <div className="max-w-xl">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Mantente informado del lanzamiento</h2>
                                <p className="text-gray-400 text-lg">
                                    Sé el primero en saber cuando estos nuevos activos estén disponibles para inversión en la plataforma.
                                </p>
                            </div>
                            {/* Form Content */}
                            <div className="w-full max-w-md">
                                <form className="flex flex-col sm:flex-row gap-3 bg-gray-900/50 p-2 rounded-xl border border-gray-700 focus-within:border-gray-500 transition-colors">
                                    <input
                                        className="border-none text-white placeholder-gray-500 flex-grow px-4 py-3 bg-gray-800 focus:ring-0 focus:outline-none focus:shadow-[0_0_0_2px_#EAFF04] rounded-lg"
                                        placeholder="Ingresa tu correo electrónico"
                                        type="email"
                                    />
                                    <button className="bg-primary text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors whitespace-nowrap" type="submit">
                                        Notificarme
                                    </button>
                                </form>
                                <p className="text-xs text-gray-500 mt-3 pl-2">
                                    Al suscribirte aceptas nuestros <Link href="/terminos" className="underline hover:text-white">Términos</Link> y <Link href="/privacidad" className="underline hover:text-white">Privacidad</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Same as Landing page */}
            <footer className="max-w-7xl mx-auto px-6 md:px-12 py-10 border-t border-gray-100 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Logo & Copyright */}
                    <div className="flex items-center gap-4">
                        <WattismoneyLogo className="h-8 w-auto" />
                        <span className="text-sm text-gray-400 font-normal">© 2025</span>
                    </div>

                    {/* Links */}
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="/terminos" className="hover:text-black transition-colors">Términos</Link>
                        <Link href="/privacidad" className="hover:text-black transition-colors">Privacidad</Link>
                        <Link href="/cookies" className="hover:text-black transition-colors">Cookies</Link>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-3">
                        <a className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600" href="#">
                            <span className="sr-only">Facebook</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                            </svg>
                        </a>
                        <a className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600" href="#">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600" href="#">
                            <span className="sr-only">Twitter</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
