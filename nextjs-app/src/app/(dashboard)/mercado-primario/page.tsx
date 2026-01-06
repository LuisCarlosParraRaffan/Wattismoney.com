'use client';

import React from 'react';
import Link from 'next/link';

const Oportunidades: React.FC = () => {
    return (
        <div className="flex flex-col flex-1 h-full relative bg-white dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-gray-800 shrink-0 z-10">
                <div className="flex items-center gap-4 lg:hidden">
                    <button className="p-2 -ml-2 text-black dark:text-white">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <h2 className="text-lg font-bold font-display text-text-main dark:text-white">Mercado Primario</h2>
                </div>
                <div className="hidden lg:flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-black dark:text-white font-display tracking-tight">Mercado de Energía</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 h-10 w-64 hover:border-gray-300 dark:hover:border-gray-600 transition-colors focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-sm w-full text-black dark:text-white placeholder-gray-400 font-sans outline-none"
                            placeholder="Buscar activos..."
                            type="text"
                        />
                    </div>
                    <button className="size-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-white dark:border-[#1a1a2e]"></span>
                    </button>
                </div>
            </header>

            {/* Main Scrollable Area */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50 dark:bg-background-dark">
                <div className="max-w-7xl mx-auto flex flex-col gap-10 pb-12">

                    {/* Hero Banner */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-[#1a1a2e] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 translate-x-1/3 -translate-y-1/3"></div>
                        <div className="relative z-10 flex flex-col gap-3 max-w-3xl">
                            <h2 className="text-3xl font-black text-black dark:text-white font-display leading-tight">Tu liquidez genera energía real</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-2xl">
                                En Wattismoney, cada inversión conecta directamente una <span className="font-bold text-black dark:text-white">fuente de generación sostenible</span> con una <span className="font-bold text-black dark:text-white">industria productiva</span>. Tu capital financia contratos PPA (Power Purchase Agreements) que garantizan precios estables.
                            </p>
                        </div>
                        <div className="flex gap-3 shrink-0 relative z-10">
                            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-w-[110px]">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">TIR Promedio</span>
                                <span className="text-xl font-black text-black dark:text-white font-display">9.4%</span>
                            </div>
                            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-w-[110px]">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Industrias</span>
                                <span className="text-xl font-black text-black dark:text-white font-display">12+</span>
                            </div>
                        </div>
                    </div>

                    {/* Primary Market Section */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black font-display flex items-center gap-2 text-black dark:text-white">
                                    <span className="material-symbols-outlined text-primary">verified</span>
                                    Mercado Primario
                                </h3>
                                <span className="px-2.5 py-0.5 bg-primary text-black text-[10px] font-bold rounded-full uppercase tracking-wide">Nuevas Emisiones</span>
                            </div>
                            <button className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                                Ver todos
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Opportunity Card 1 */}
                            <article className="group relative flex flex-col bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden h-full">
                                <Link href="/contrato/sol-8821" className="block relative h-52 w-full overflow-hidden cursor-pointer">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCiqBdJMue9D-ai5CSYnkYLI5Quat4LvHRK8oFQwIKykRWJGD6D71ZHYWFYaORCzvpUI-FKXMkr0c6BH94x8yCU52ipQO5QkdcuzSYwa00IoEA37KSizinCzulJ3etlfLFYoi5_Aoba5c7pwX0OGd4eqYHzji4CldFur_yxmEUIDRt_equSjqQvp5XxQTlFWlyCCehMUqFjKzjA3bg3kj7RQHeewE0YUnoY6WDv-q3rsoVRsybfxguT-8WvyhskctKHShDttzCEoxA")' }}></div>
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[10px] font-bold rounded uppercase tracking-wider shadow-sm font-display">
                                            Mercado Primario
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white w-[calc(100%-32px)]">
                                        <div className="flex items-center gap-1 mb-1 text-white/80">
                                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                                            <span className="text-xs font-bold uppercase tracking-wide">Atacama, Chile</span>
                                        </div>
                                        <h3 className="text-xl font-black font-display leading-tight group-hover:text-primary transition-colors">Parque Solar Atacama IV</h3>
                                    </div>
                                </Link>
                                <div className="flex flex-col flex-1 p-5 gap-5">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Cadena de Valor Energética</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex flex-col items-center gap-1 w-1/3">
                                                <div className="size-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-orange-500 shadow-sm">
                                                    <span className="material-symbols-outlined text-[20px]">solar_power</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-center leading-tight mt-1 text-slate-700 dark:text-slate-300">Generación<br />Solar</span>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center px-1">
                                                <div className="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-600 relative top-2"></div>
                                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded relative z-10 mt-1">PPA 5 Años</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 w-1/3">
                                                <div className="size-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-sm">
                                                    <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-center leading-tight mt-1 text-slate-700 dark:text-slate-300">Industria<br />Minera</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Rentabilidad Est.</span>
                                            <span className="text-2xl font-black font-display text-black dark:text-white">8.2% <span className="text-xs font-bold text-gray-400">anual</span></span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Volumen Transado</span>
                                            <span className="text-lg font-black font-display text-black dark:text-white flex items-center gap-1">
                                                1.2 GWh
                                                <span className="material-symbols-outlined text-green-600 text-[18px]">bolt</span>
                                            </span>
                                            <span className="text-[10px] font-medium text-gray-400">Energía limpia entregada</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-black dark:text-white">75% Financiado</span>
                                            <span className="text-gray-500">$750k / $1M</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-4">
                                            <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                        <Link href="/contrato/sol-8821" className="w-full h-11 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                                            Invertir Ahora
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </article>

                            {/* Opportunity Card 2 */}
                            <article className="group relative flex flex-col bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden h-full">
                                <Link href="/contrato/wind-2034" className="block relative h-52 w-full overflow-hidden cursor-pointer">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuArBCa_KmRxBZhDf3tf5o0ICZ4J77Mz8b_8wJNjmBf4m40KTsS1d4C3NHipD3z_GqrIz0FsESg2-YDcWSmu7eH7lbuPXMhSNXJ9GQIzRw2k9AwPctundxetBR1WWxrND3aVNFulRuXXCf3Tsd_C51YavEJx6hssCQq2fGcoNfMX7H-dowLG1bdrUHOhy6S3-mXjhn5khPD5V_ItED2oMk_BGygjZh9lwwgivXl1FKURXhxGcqJWr4I3sqhVKmW2eRJaBNGjyvqnFAg")' }}></div>
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[10px] font-bold rounded uppercase tracking-wider shadow-sm font-display">
                                            Mercado Primario
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white w-[calc(100%-32px)]">
                                        <div className="flex items-center gap-1 mb-1 text-white/80">
                                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                                            <span className="text-xs font-bold uppercase tracking-wide">Oaxaca, México</span>
                                        </div>
                                        <h3 className="text-xl font-black font-display leading-tight group-hover:text-primary transition-colors">Eólica del Sur - Fase II</h3>
                                    </div>
                                </Link>
                                <div className="flex flex-col flex-1 p-5 gap-5">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Cadena de Valor Energética</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex flex-col items-center gap-1 w-1/3">
                                                <div className="size-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-blue-500 shadow-sm">
                                                    <span className="material-symbols-outlined text-[20px]">wind_power</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-center leading-tight mt-1 text-slate-700 dark:text-slate-300">Generación<br />Eólica</span>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center px-1">
                                                <div className="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-600 relative top-2"></div>
                                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded relative z-10 mt-1">PPA 10 Años</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 w-1/3">
                                                <div className="size-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-purple-600 shadow-sm">
                                                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-center leading-tight mt-1 text-slate-700 dark:text-slate-300">Cadena<br />Retail</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Rentabilidad Est.</span>
                                            <span className="text-2xl font-black font-display text-black dark:text-white">11.5% <span className="text-xs font-bold text-gray-400">anual</span></span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Volumen Transado</span>
                                            <span className="text-lg font-black font-display text-black dark:text-white flex items-center gap-1">
                                                5.4 GWh
                                                <span className="material-symbols-outlined text-green-600 text-[18px]">bolt</span>
                                            </span>
                                            <span className="text-[10px] font-medium text-gray-400">Energía limpia entregada</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-black dark:text-white">40% Financiado</span>
                                            <span className="text-gray-500">$800k / $2M</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-4">
                                            <div className="bg-primary h-full rounded-full" style={{ width: '40%' }}></div>
                                        </div>
                                        <Link href="/contrato/wind-2034" className="w-full h-11 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                                            Invertir Ahora
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </article>

                            {/* Opportunity Card 3 */}
                            <article className="group relative flex flex-col bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden h-full hidden lg:flex">
                                <Link href="/contrato/hyd-9982" className="block relative h-52 w-full overflow-hidden cursor-pointer">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClT-Ga-iIO9ITfAHMHhrNhajCMQ08lvBv7D1-mpydprVY8n2Ok0bO8zaD4ow7SeykrWgGvS5Zy5sXXwCpY-PELw_KakEAoGtXTUpL0Y0KE3kx-Hpm14ZPid9Joe7GTjF4EVIR20qfLSzgscLCumO-UcWsuf5gZD2DDt4WUZkQnilNouQI0okqa1JJBTX7wSs9d88oOZWPsL1VUj4-_NKouI1mcJRMJPfrXHgZx8cCa4Qd3_tvEuAaKEm_0pvHBb5tJ-vqxpiZd31A")' }}></div>
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 bg-primary text-black text-[10px] font-bold rounded uppercase tracking-wider shadow-sm font-display">
                                            Mercado Primario
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white w-[calc(100%-32px)]">
                                        <div className="flex items-center gap-1 mb-1 text-white/80">
                                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                                            <span className="text-xs font-bold uppercase tracking-wide">Antioquia, CO</span>
                                        </div>
                                        <h3 className="text-xl font-black font-display leading-tight group-hover:text-primary transition-colors">Central Hidro Andina</h3>
                                    </div>
                                </Link>
                                <div className="flex flex-col flex-1 p-5 gap-5">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Cadena de Valor Energética</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex flex-col items-center gap-1 w-1/3">
                                                <div className="size-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-cyan-600 shadow-sm">
                                                    <span className="material-symbols-outlined text-[20px]">water_drop</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-center leading-tight mt-1 text-slate-700 dark:text-slate-300">Generación<br />Hidro</span>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center px-1">
                                                <div className="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-600 relative top-2"></div>
                                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded relative z-10 mt-1">PPA 8 Años</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 w-1/3">
                                                <div className="size-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-teal-700 shadow-sm">
                                                    <span className="material-symbols-outlined text-[20px]">factory</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-center leading-tight mt-1 text-slate-700 dark:text-slate-300">Industria<br />Agro</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Rentabilidad Est.</span>
                                            <span className="text-2xl font-black font-display text-black dark:text-white">7.8% <span className="text-xs font-bold text-gray-400">anual</span></span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Volumen Transado</span>
                                            <span className="text-lg font-black font-display text-black dark:text-white flex items-center gap-1">
                                                3.1 GWh
                                                <span className="material-symbols-outlined text-green-600 text-[18px]">bolt</span>
                                            </span>
                                            <span className="text-[10px] font-medium text-gray-400">Energía limpia entregada</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-black dark:text-white">92% Financiado</span>
                                            <span className="text-red-500 font-bold">¡Últimos Cupos!</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-4">
                                            <div className="bg-primary h-full rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                        <Link href="/contrato/hyd-9982" className="w-full h-11 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                                            Invertir Ahora
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </article>

                        </div>
                    </div>

                    {/* Secondary Market Teaser */}
                    <div className="flex flex-col gap-5 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black font-display flex items-center gap-2 text-gray-800 dark:text-white">
                                    <span className="material-symbols-outlined text-gray-400">swap_horiz</span>
                                    Mercado Secundario
                                </h3>
                                <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-full border border-gray-200 dark:border-gray-700 uppercase tracking-wide">Posiciones a la venta</span>
                            </div>
                            <Link href="/mercado-secundario" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-primary decoration-2 underline-offset-4">
                                Ver todas las reventas
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70 hover:opacity-100 transition-opacity">
                            {/* Secondary Market Card Example */}
                            <article className="flex flex-col bg-white dark:bg-[#1a1a2e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors h-full">
                                <div className="p-5 flex flex-col gap-4 h-full">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-500 border border-yellow-100 dark:border-yellow-800">
                                                <span className="material-symbols-outlined">solar_power</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold font-display leading-tight text-black dark:text-white">Solar Norte I</h4>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Antofagasta, CL</span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase rounded">Reventa</span>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-[16px] text-gray-400">factory</span>
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Cliente: Cementera Nacional</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2">
                                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                        <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium">
                                            <span>Contrato iniciado 2021</span>
                                            <span>Fin: 2031</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-auto">
                                        <div>
                                            <span className="block text-xs text-gray-500 font-bold uppercase">Precio Venta</span>
                                            <span className="block font-black text-lg font-display text-black dark:text-white">$2,450 USD</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500 font-bold uppercase">TIR Restante</span>
                                            <span className="block font-black text-lg font-display text-green-600">7.5%</span>
                                        </div>
                                    </div>
                                    <Link href="/contrato/solar-norte-1" className="w-full py-2 border border-black dark:border-white rounded-lg text-sm font-bold text-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-black dark:text-white">
                                        Ver en Mercado Secundario
                                    </Link>
                                </div>
                            </article>

                            {/* View More Card */}
                            <Link href="/mercado-secundario" className="flex flex-col bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 h-full items-center justify-center p-6 text-center hover:bg-white dark:hover:bg-[#1a1a2e] hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all cursor-pointer group">
                                <div className="size-14 rounded-full bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 mb-3 group-hover:border-primary group-hover:text-primary transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-3xl">storefront</span>
                                </div>
                                <h4 className="font-bold text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">Ir al Mercado Secundario</h4>
                                <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 dark:group-hover:text-gray-400">Accede a oportunidades con liquidez inmediata</p>
                            </Link>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Oportunidades;
