/**
 * ============================================================================
 * LANDING_COMO_FUNCIONA - Página Pública "Cómo Funciona"
 * ============================================================================
 * 
 * Esta es la página de LANDING que explica cómo funciona Wattismoney,
 * accesible públicamente sin autenticación en la ruta /como-funciona.
 * 
 * Contenido:
 * - Hero: "Liquidez en Contratos de Energía" con botón destacado
 * - Sección visual "¿Qué es?" con imagen
 * - Sección visual "¿Por qué?" con imagen (layout invertido)
 * - Sección visual "¿Cómo?" con imagen
 * - CTA final: "¿Listo para transformar el mercado?"
 * - Footer completo con redes sociales
 * 
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

// Image components with actual URLs
const ComoFuncionaImg1 = ({ className }: { className?: string }) => (
    <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiqBdJMue9D-ai5CSYnkYLI5Quat4LvHRK8oFQwIKykRWJGD6D71ZHYWFYaORCzvpUI-FKXMkr0c6BH94x8yCU52ipQO5QkdcuzSYwa00IoEA37KSizinCzulJ3etlfLFYoi5_Aoba5c7pwX0OGd4eqYHzji4CldFur_yxmEUIDRt_equSjqQvp5XxQTlFWlyCCehMUqFjKzjA3bg3kj7RQHeewE0YUnoY6WDv-q3rsoVRsybfxguT-8WvyhskctKHShDttzCEoxA"
        alt="Solar energy panels"
        className={className}
    />
);

const ComoFuncionaImg2 = ({ className }: { className?: string }) => (
    <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuArBCa_KmRxBZhDf3tf5o0ICZ4J77Mz8b_8wJNjmBf4m40KTsS1d4C3NHipD3z_GqrIz0FsESg2-YDcWSmu7eH7lbuPXMhSNXJ9GQIzRw2k9AwPctundxetBR1WWxrND3aVNFulRuXXCf3Tsd_C51YavEJx6hssCQq2fGcoNfMX7H-dowLG1bdrUHOhy6S3-mXjhn5khPD5V_ItED2oMk_BGygjZh9lwwgivXl1FKURXhxGcqJWr4I3sqhVKmW2eRJaBNGjyvqnFAg"
        alt="Wind turbines"
        className={className}
    />
);

const ComoFuncionaImg3 = ({ className }: { className?: string }) => (
    <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuClT-Ga-iIO9ITfAHMHhrNhajCMQ08lvBv7D1-mpydprVY8n2Ok0bO8zaD4ow7SeykrWgGvS5Zy5sXXwCpY-PELw_KakEAoGtXTUpL0Y0KE3kx-Hpm14ZPid9Joe7GTjF4EVIR20qfLSzgscLCumO-UcWsuf5gZD2DDt4WUZkQnilNouQI0okqa1JJBTX7wSs9d88oOZWPsL1VUj4-_NKouI1mcJRMJPfrXHgZx8cCa4Qd3_tvEuAaKEm_0pvHBb5tJ-vqxpiZd31A"
        alt="Hydroelectric dam"
        className={className}
    />
);

export default function LandingComoFunciona() {
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
                    <Link href="/hoja-de-ruta" className="hover:text-black transition-colors">Hoja de Ruta</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-gray-600 hidden sm:block">Login</Link>
                    <Link href="/signup" className="bg-primary text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm cursor-pointer hover:opacity-90">
                        Registro
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative flex flex-col font-display">
                {/* Hero Section */}
                <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase tracking-wide mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Producto Principal
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-black leading-[1.1] mb-6 max-w-4xl mx-auto">
                        Liquidez en <span className="relative inline-block z-10 before:absolute before:-bottom-1 before:left-0 before:w-full before:h-3 before:bg-primary/60 before:-z-10 before:-skew-x-6">Contratos de Energía</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
                        Inversión en energía sostenible con confianza, profesionalismo e impacto transformador.
                    </p>
                    <div className="mt-10 flex justify-center">
                        <Link href="/contratos" className="h-14 px-8 flex items-center justify-center rounded-xl bg-primary text-black text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all border-2 border-black">
                            Explorar Oportunidades
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </section>

                {/* Visual Content Grid */}
                <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex flex-col gap-24 lg:gap-32">
                    {/* Section 1: ¿Qué es? */}
                    <section className="group flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full md:w-1/2 relative">
                            <div className="absolute inset-0 bg-primary translate-x-3 translate-y-3 rounded-2xl border-2 border-black"></div>
                            <div className="relative bg-white border-2 border-black rounded-2xl overflow-hidden aspect-[4/3]">
                                <ComoFuncionaImg1 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-black text-primary flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44.91-1.29.4-3.7-2.18-3.7-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41.7 1.15 1.11 3.3.03 4.9-1.2 1.77-2.35 2.31-2.97 3.45-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15zM14 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black tracking-tight">¿Qué es?</h2>
                            </div>
                            <p className="text-xl leading-relaxed text-gray-800 font-medium">
                                Inyección de liquidez en contratos de energía. Eres intermediario entre productores y consumidores de energía eléctrica.
                            </p>
                            <div className="h-1 w-20 bg-primary mt-2"></div>
                        </div>
                    </section>

                    {/* Section 2: ¿Por qué? (Reversed on desktop) */}
                    <section className="group flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
                        <div className="w-full md:w-1/2 relative">
                            <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 rounded-2xl"></div>
                            <div className="relative bg-gray-50 border-2 border-black rounded-2xl overflow-hidden aspect-[4/3]">
                                <ComoFuncionaImg2 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary text-black border border-black flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black tracking-tight">¿Por qué?</h2>
                            </div>
                            <p className="text-xl leading-relaxed text-gray-800 font-medium">
                                Porque las grandes empresas necesitan financiar la compra de su energía limpia, al ser montos muy representativos en su operación. Es como un factoring de energía.
                            </p>
                            <div className="h-1 w-20 bg-black mt-2"></div>
                        </div>
                    </section>

                    {/* Section 3: ¿Cómo? */}
                    <section className="group flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full md:w-1/2 relative">
                            <div className="absolute inset-0 bg-primary translate-x-3 translate-y-3 rounded-2xl border-2 border-black"></div>
                            <div className="relative bg-white border-2 border-black rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                                <ComoFuncionaImg3 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                                {/* UI Overlay Element */}
                                <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(238,255,0,1)]">
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                        Inversión Exitosa
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-black text-primary flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.21 0-.59-.34-1.15-.91-1.41z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black tracking-tight">¿Cómo?</h2>
                            </div>
                            <p className="text-xl leading-relaxed text-gray-800 font-medium">
                                A través de Wattismoney, dando 3 clics puedes aportar a la electrificación de la economía al aportar liquidez en los contratos de energía.
                            </p>
                            <div className="h-1 w-20 bg-primary mt-2"></div>
                        </div>
                    </section>
                </div>

                {/* Final CTA */}
                <section className="bg-gray-50 border-t border-gray-200 py-20 px-4">
                    <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
                        <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z" />
                        </svg>
                        <h2 className="text-3xl sm:text-4xl font-black text-black">
                            ¿Listo para transformar el mercado?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-lg">
                            Únete a los inversores que ya están generando rentabilidad mientras impulsan la energía limpia.
                        </p>
                        <Link href="/contratos" className="h-16 px-10 flex items-center justify-center rounded-xl bg-primary text-black text-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all border-2 border-black min-w-[280px]">
                            Explorar Oportunidades
                        </Link>
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
