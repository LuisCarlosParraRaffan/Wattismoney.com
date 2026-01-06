'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

export default function Contratos() {
    return (
        <div className="bg-background-light text-text-main antialiased overflow-x-hidden font-display min-h-screen">
            {/* Navigation */}
            <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 font-sans">
                <Link href="/" className="flex items-center gap-3 group">
                    <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="/contratos" className="text-black font-semibold transition-colors">Contratos</Link>
                    <Link href="/impacto" className="hover:text-black transition-colors">Impacto</Link>
                    <Link href="/hoja-de-ruta" className="hover:text-black transition-colors">Hoja de Ruta</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-gray-600 hidden sm:block">Login</Link>
                    <Link href="/signup" className="bg-primary text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm">
                        Registro
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">Contratos PPA</span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Inversiones en Energía Renovable</h1>
                    <p className="text-gray-600 text-lg">
                        Explora los contratos de compra de energía disponibles para inversión. Cada contrato conecta generadores sostenibles con industrias productivas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Contract Card 1 */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                        <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCiqBdJMue9D-ai5CSYnkYLI5Quat4LvHRK8oFQwIKykRWJGD6D71ZHYWFYaORCzvpUI-FKXMkr0c6BH94x8yCU52ipQO5QkdcuzSYwa00IoEA37KSizinCzulJ3etlfLFYoi5_Aoba5c7pwX0OGd4eqYHzji4CldFur_yxmEUIDRt_equSjqQvp5XxQTlFWlyCCehMUqFjKzjA3bg3kj7RQHeewE0YUnoY6WDv-q3rsoVRsybfxguT-8WvyhskctKHShDttzCEoxA")' }}>
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 text-xs font-bold rounded uppercase">Solar</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg mb-2">Parque Solar Atacama IV</h3>
                            <p className="text-sm text-gray-500 mb-4">Atacama, Chile • 10 MW</p>
                            <div className="flex justify-between mb-4">
                                <div>
                                    <span className="text-xs text-gray-500 block">TIR Estimada</span>
                                    <span className="text-lg font-black text-green-600">8.2%</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block">Plazo</span>
                                    <span className="text-lg font-black">5 años</span>
                                </div>
                            </div>
                            <Link href="/contrato/sol-8821" className="w-full py-2.5 bg-black text-white rounded-lg font-bold text-sm text-center block hover:bg-gray-800 transition-colors">
                                Ver Detalles
                            </Link>
                        </div>
                    </div>

                    {/* Contract Card 2 */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                        <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuArBCa_KmRxBZhDf3tf5o0ICZ4J77Mz8b_8wJNjmBf4m40KTsS1d4C3NHipD3z_GqrIz0FsESg2-YDcWSmu7eH7lbuPXMhSNXJ9GQIzRw2k9AwPctundxetBR1WWxrND3aVNFulRuXXCf3Tsd_C51YavEJx6hssCQq2fGcoNfMX7H-dowLG1bdrUHOhy6S3-mXjhn5khPD5V_ItED2oMk_BGygjZh9lwwgivXl1FKURXhxGcqJWr4I3sqhVKmW2eRJaBNGjyvqnFAg")' }}>
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 text-xs font-bold rounded uppercase">Eólica</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg mb-2">Eólica del Sur - Fase II</h3>
                            <p className="text-sm text-gray-500 mb-4">Oaxaca, México • 25 MW</p>
                            <div className="flex justify-between mb-4">
                                <div>
                                    <span className="text-xs text-gray-500 block">TIR Estimada</span>
                                    <span className="text-lg font-black text-green-600">11.5%</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block">Plazo</span>
                                    <span className="text-lg font-black">10 años</span>
                                </div>
                            </div>
                            <Link href="/contrato/wind-2034" className="w-full py-2.5 bg-black text-white rounded-lg font-bold text-sm text-center block hover:bg-gray-800 transition-colors">
                                Ver Detalles
                            </Link>
                        </div>
                    </div>

                    {/* Contract Card 3 */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                        <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClT-Ga-iIO9ITfAHMHhrNhajCMQ08lvBv7D1-mpydprVY8n2Ok0bO8zaD4ow7SeykrWgGvS5Zy5sXXwCpY-PELw_KakEAoGtXTUpL0Y0KE3kx-Hpm14ZPid9Joe7GTjF4EVIR20qfLSzgscLCumO-UcWsuf5gZD2DDt4WUZkQnilNouQI0okqa1JJBTX7wSs9d88oOZWPsL1VUj4-_NKouI1mcJRMJPfrXHgZx8cCa4Qd3_tvEuAaKEm_0pvHBb5tJ-vqxpiZd31A")' }}>
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-primary text-xs font-bold rounded uppercase">Hidro</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg mb-2">Central Hidro Andina</h3>
                            <p className="text-sm text-gray-500 mb-4">Antioquia, Colombia • 15 MW</p>
                            <div className="flex justify-between mb-4">
                                <div>
                                    <span className="text-xs text-gray-500 block">TIR Estimada</span>
                                    <span className="text-lg font-black text-green-600">7.8%</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block">Plazo</span>
                                    <span className="text-lg font-black">8 años</span>
                                </div>
                            </div>
                            <Link href="/contrato/hyd-9982" className="w-full py-2.5 bg-black text-white rounded-lg font-bold text-sm text-center block hover:bg-gray-800 transition-colors">
                                Ver Detalles
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

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
