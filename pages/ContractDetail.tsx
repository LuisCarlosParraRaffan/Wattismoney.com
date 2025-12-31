import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const ContractDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main relative">
      
      {/* Mobile Header (Hidden on Desktop) */}
      <header className="h-20 bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 md:hidden shrink-0 z-10">
        <div className="flex items-center gap-2">
           <Link to="/" className="flex items-center gap-3 group">
             <WattismoneyLogo className="h-8 w-auto" />
           </Link>
        </div>
        <button className="p-2 text-slate-500">
            <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50 dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto w-full pb-20">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                <Link to="/mercado-primario" className="hover:text-black dark:hover:text-white hover:underline">Inversiones</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="hover:text-black dark:hover:text-white">Energía Solar</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-black dark:text-white font-bold">Parque Industrial Andalucía IV</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Hero Image Card */}
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm group">
                        <div className="h-72 w-full bg-gray-100 dark:bg-gray-800 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 to-primary/10 mix-blend-overlay z-10"></div>
                            <img 
                                alt="Parque solar" 
                                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG9DIwcRGbKIwwABVP6DDpEFkHvdGtlo4lOFbPCRiPzAgX19XDZxG0NHRBXXAGNCwWYiavBXtKmrJz9TSkF7NduhP4gTXGCsrfj6cz1m4jBCJSRY8tutZPHzsT76_NZeVGXjjyKIpuX3Ne1k9iAsi6W1yKXwh83_T2NIqibVFSc-3G1eD_Q-9Cj-piHusKG32x4FecFOkKWon17O8pmNoJX9MgeMn8ACE63f_fELLcLRkVLH8IlBH5fQLZLhJbYOvGJydKNs3Hz2M"
                            />
                            <div className="absolute top-4 left-4 z-20 bg-primary px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black border border-black/10 shadow-sm">
                                <span className="material-symbols-outlined text-sm">wb_sunny</span>
                                Solar PPA
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
                                <h1 className="text-white text-3xl font-bold leading-tight tracking-tight mb-1">PPA Solar: Parque Industrial Andalucía IV</h1>
                                <p className="text-gray-200 text-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    Córdoba, España • ID #2024-SP-AND-IV
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Key Details Table */}
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div className="p-2 bg-primary rounded-md text-black">
                                <span className="material-symbols-outlined">table_chart</span>
                            </div>
                            <h2 className="text-xl font-bold text-black dark:text-white">Detalles Clave del PPA</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-black dark:border-white">
                                        <th className="py-3 px-4 text-xs uppercase tracking-wider text-black dark:text-white font-bold">Vendedor (Generador)</th>
                                        <th className="py-3 px-4 text-xs uppercase tracking-wider text-black dark:text-white font-bold">Comprador (Off-taker)</th>
                                        <th className="py-3 px-4 text-xs uppercase tracking-wider text-black dark:text-white font-bold text-right">Duración</th>
                                        <th className="py-3 px-4 text-xs uppercase tracking-wider text-black dark:text-white font-bold text-right">Perfil de Riesgo</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-5 px-4 font-medium text-black dark:text-white">
                                            <div className="flex items-center gap-2">
                                                SunTech Solutions SL
                                                <span className="material-symbols-outlined text-primary text-[18px]" title="Verificado">verified</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 text-slate-800 dark:text-slate-300">
                                            Manufacturing Corp SA
                                            <span className="block text-xs text-slate-500 dark:text-slate-500 mt-1 font-mono bg-gray-100 dark:bg-gray-800 w-fit px-1 rounded">AA Credit Rating</span>
                                        </td>
                                        <td className="py-5 px-4 text-right text-black dark:text-white font-bold">10 Años</td>
                                        <td className="py-5 px-4 text-right">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                Bajo (A)
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20">
                                    <span className="material-symbols-outlined text-4xl dark:text-white">euro</span>
                                </div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Precio de Energía Fijo</p>
                                <p className="text-2xl font-bold text-black dark:text-white">€45.50 <span className="text-lg text-slate-600 dark:text-slate-400 font-normal">/ MWh</span></p>
                            </div>
                            <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20">
                                    <span className="material-symbols-outlined text-4xl dark:text-white">calendar_month</span>
                                </div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Pagos Estimados</p>
                                <p className="text-2xl font-bold text-black dark:text-white">Mensual</p>
                            </div>
                        </div>
                    </div>

                    {/* Impact Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow group">
                            <div className="size-14 rounded-full bg-primary text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-black dark:border-white">
                                <span className="material-symbols-outlined text-3xl">co2</span>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-black dark:text-white">450 Ton</p>
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mt-1">CO2 Evitado Anual</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow group">
                            <div className="size-14 rounded-full bg-primary text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-black dark:border-white">
                                <span className="material-symbols-outlined text-3xl">electric_bolt</span>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-black dark:text-white">1,250 MWh</p>
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mt-1">Producción Estimada</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow group">
                            <div className="size-14 rounded-full bg-primary text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-black dark:border-white">
                                <span className="material-symbols-outlined text-3xl">forest</span>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-black dark:text-white">15,000</p>
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mt-1">Árboles Equivalentes</p>
                            </div>
                        </div>
                    </div>

                    {/* Documentation */}
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-black dark:bg-white rounded-md text-primary dark:text-black">
                                    <span className="material-symbols-outlined">folder_open</span>
                                </div>
                                <h2 className="text-xl font-bold text-black dark:text-white">Documentación y Transparencia</h2>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <a className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d2d42] hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-black dark:hover:border-white transition-all group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-black dark:text-white group-hover:underline transition-all">Contrato PPA Firmado (Anonimizado)</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF • 2.4 MB • Actualizado hace 2 días</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-black dark:group-hover:text-white">download</span>
                            </a>
                            <a className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d2d42] hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-black dark:hover:border-white transition-all group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <span className="material-symbols-outlined">engineering</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-black dark:text-white group-hover:underline transition-all">Informe Técnico de Auditoría</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF • 5.1 MB • 10 Oct 2023</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-black dark:group-hover:text-white">download</span>
                            </a>
                            <a className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d2d42] hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-black dark:hover:border-white transition-all group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <span className="material-symbols-outlined">gavel</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-black dark:text-white group-hover:underline transition-all">Nota Legal y Riesgos</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF • 1.2 MB • 05 Oct 2023</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-black dark:group-hover:text-white">download</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        
                        {/* Investment Card */}
                        <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Rentabilidad Anual (APY)</p>
                                    <p className="text-5xl font-black text-black dark:text-white tracking-tight">7.5%</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-primary text-black border border-black dark:border-white text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
                                    Abierto
                                </span>
                            </div>
                            <div className="flex flex-col gap-3 mb-8">
                                <div className="flex gap-6 justify-between items-end">
                                    <p className="text-black dark:text-white text-sm font-bold leading-normal">Progreso de Financiación</p>
                                    <p className="text-black text-sm font-black leading-normal bg-primary px-1">75%</p>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 h-4 border border-black dark:border-white relative">
                                    <div className="h-full bg-primary relative border-r border-black dark:border-white" style={{width: '75%'}}>
                                        <div className="absolute inset-0 w-full h-full" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)'}}></div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs mt-1">
                                    <p className="text-black dark:text-white font-bold">€375,000 <span className="text-slate-500 dark:text-slate-400 font-normal">recaudados</span></p>
                                    <p className="text-slate-500 dark:text-slate-400">Meta: €500,000</p>
                                </div>
                            </div>
                            <hr className="border-gray-200 dark:border-gray-700 mb-6 border-dashed"/>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Inversión Mínima</span>
                                    <span className="font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">€100</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Cierre de Ronda</span>
                                    <span className="font-bold text-black dark:text-white">15 Días</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Pagos de Intereses</span>
                                    <span className="font-bold text-black dark:text-white">Trimestral</span>
                                </div>
                            </div>
                            <button className="w-full cursor-pointer flex items-center justify-center rounded-none border-2 border-black dark:border-white h-14 px-6 bg-primary text-black text-lg font-bold leading-normal tracking-[0.015em] hover:bg-black hover:text-primary dark:hover:bg-white dark:hover:text-black active:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-none mb-4 uppercase">
                                Invertir Ahora
                            </button>
                            <p className="text-center text-[10px] uppercase tracking-wide text-slate-400">Capital en riesgo. Lee la documentación legal.</p>
                        </div>

                        {/* Support Card */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm text-black dark:text-white">
                                    <span className="material-symbols-outlined">support_agent</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-black dark:text-white mb-1">¿Tienes dudas?</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">Agenda una llamada con nuestro equipo de expertos en energía.</p>
                                    <button className="text-sm font-bold text-black dark:text-white hover:bg-primary hover:text-black px-2 py-1 rounded transition-all inline-block -ml-2">
                                        Agendar Llamada -&gt;
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
};

export default ContractDetail;