import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const Dashboard: React.FC = () => {
  return (
    <>
      {/* Header */}
      <header className="h-20 bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 md:px-10 shrink-0">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
           <WattismoneyLogo className="h-8 w-auto" />
        </div>
        
        {/* Page Title */}
        <div className="hidden md:flex flex-col">
          <h1 className="text-xl font-bold text-text-main dark:text-white">Resumen de Cartera</h1>
          <p className="text-sm text-slate-500">Impacto energético y financiero al día de hoy.</p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:text-black transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1a2e]"></span>
          </button>
          <Link to="/oportunidades" className="bg-primary hover:bg-primary-hover text-text-main px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Nueva Inversión</span>
          </Link>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
          
          {/* Metrics Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Energy Transactioned */}
            <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 opacity-5">
                <span className="material-symbols-outlined text-9xl">bolt</span>
              </div>
              <div className="relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Energía Transaccionada</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold text-text-main dark:text-white">12.5 GWh</h3>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> +15%
                  </div>
                  <span className="text-xs text-slate-500">vs mes anterior</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4"></div>
              </div>
            </div>

            {/* Industries Supported */}
            <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 opacity-5">
                <span className="material-symbols-outlined text-9xl">factory</span>
              </div>
              <div className="relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Industrias Apoyadas</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold text-text-main dark:text-white">8</h3>
                </div>
                <div className="mt-4 flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs" title="Agro">🌾</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs" title="Textil">👕</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs" title="Manufactura">🏭</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs text-slate-500 text-[10px] font-bold">+5</div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-black w-2/4"></div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Impacto Ambiental</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold text-text-main dark:text-white">450 Ton</h3>
                  <span className="text-sm font-medium text-slate-500">CO2e</span>
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  Equivalente a retirar <span className="font-bold text-text-main">98 autos</span> de circulación por un año.
                </p>
              </div>
            </div>

            {/* Financial Performance */}
            <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Rendimiento Financiero</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold text-text-main dark:text-white">$12,450</h3>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">TIR Promedio</span>
                    <span className="text-sm font-bold text-green-600">8.4%</span>
                  </div>
                  <div className="h-8 w-px bg-gray-200 mx-2"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Ganancia Neta</span>
                    <span className="text-sm font-bold text-text-main">$984.00</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Visualization Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Impact Flow */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1a1a2e] p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-bold text-text-main dark:text-white">Flujo de Impacto</h2>
                  <p className="text-sm text-slate-500">Tu inversión conectando generación limpia con consumo industrial.</p>
                </div>
                <button className="text-xs font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">Ver Detalles</button>
              </div>
              
              <div className="relative w-full h-64 flex items-center justify-between px-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-gradient-to-r from-primary to-transparent -z-0"></div>
                
                {/* Node 1: Generation */}
                <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-primary shadow-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-black">solar_power</span>
                  </div>
                  <div className="text-center bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <p className="font-bold text-sm">Generación</p>
                    <p className="text-xs text-slate-500">Solar &amp; Eólica</p>
                  </div>
                </div>

                {/* Node 2: Investment (User) */}
                <div className="relative z-10 flex flex-col items-center -mt-12">
                  <div className="bg-black text-primary px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-lg animate-bounce">
                      TU APORTE
                  </div>
                  <div className="w-12 h-12 rounded-full bg-black shadow-xl flex items-center justify-center border-4 border-white">
                    <span className="material-symbols-outlined text-xl text-primary">account_balance_wallet</span>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-bold">$12.4k Invertidos</p>
                  </div>
                </div>

                {/* Node 3: Industry */}
                <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-200 shadow-lg flex items-center justify-center mb-3 group-hover:border-black transition-colors group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-black">domain</span>
                  </div>
                  <div className="text-center bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <p className="font-bold text-sm">Industria</p>
                    <p className="text-xs text-slate-500">Manufactura</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 bg-gray-50 rounded-lg p-4">
                <div className="text-center border-r border-gray-200">
                  <p className="text-xs text-slate-500">Origen</p>
                  <p className="font-bold text-sm">100% Renovable</p>
                </div>
                <div className="text-center border-r border-gray-200">
                  <p className="text-xs text-slate-500">Contratos Activos</p>
                  <p className="font-bold text-sm">4 PPAs</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Destino</p>
                  <p className="font-bold text-sm">Empresas Locales</p>
                </div>
              </div>
            </div>

            {/* Benefited Sectors */}
            <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-text-main dark:text-white mb-6">Sectores Beneficiados</h3>
              <div className="flex-1 flex flex-col justify-center space-y-6">
                
                <div className="group">
                  <div className="flex justify-between items-end mb-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-primary/20 rounded-md text-black">
                        <span className="material-symbols-outlined text-sm">agriculture</span>
                      </span>
                      <span className="text-sm font-semibold">Agroindustria</span>
                    </div>
                    <span className="text-sm font-bold">45%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000 w-[45%]"></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Riego solar y procesamiento.</p>
                </div>

                <div className="group">
                  <div className="flex justify-between items-end mb-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-gray-100 rounded-md text-black">
                        <span className="material-symbols-outlined text-sm">checkroom</span>
                      </span>
                      <span className="text-sm font-semibold">Textil</span>
                    </div>
                    <span className="text-sm font-bold">30%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-black h-full rounded-full transition-all duration-1000 w-[30%]"></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Fábricas de confección.</p>
                </div>

                <div className="group">
                  <div className="flex justify-between items-end mb-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-gray-100 rounded-md text-black">
                        <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
                      </span>
                      <span className="text-sm font-semibold">Metalmecánica</span>
                    </div>
                    <span className="text-sm font-bold">25%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gray-400 h-full rounded-full transition-all duration-1000 w-[25%]"></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Maquinaria pesada.</p>
                </div>

              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-slate-500 italic">
                  *Porcentaje de la energía total distribuida a cada sector.
                </p>
              </div>
            </div>
          </section>

          {/* Active Contracts Table */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-main dark:text-white">Contratos Activos (PPA)</h2>
              <Link to="/cartera" className="text-text-main underline decoration-primary decoration-2 text-sm font-bold hover:text-black flex items-center gap-1">
                Ver cartera completa <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Fuente de Energía</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Industria Receptora</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Energía Suministrada</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Impacto CO2</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-text-main">
                            <span className="material-symbols-outlined">sunny</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-text-main dark:text-white">Solar Andalucía I</p>
                            <p className="text-xs text-slate-500">Sevilla, España</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-gray-400 text-lg">factory</span>
                          <span className="text-sm font-medium text-text-main dark:text-white">Grupo AgroSur</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-bold text-text-main">4.2 MWh/mes</div>
                        <div className="w-20 bg-gray-200 h-1 rounded-full mt-1 overflow-hidden">
                          <div className="bg-success h-full" style={{ width: '80%' }}></div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-sm text-slate-500 font-medium">-12 Ton</span>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-black border border-primary/20 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                          Activo
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">air</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-text-main dark:text-white">Eólica del Norte</p>
                            <p className="text-xs text-slate-500">Galicia, España</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-gray-400 text-lg">checkroom</span>
                          <span className="text-sm font-medium text-text-main dark:text-white">Textiles Gallegos</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-bold text-text-main">2.8 MWh/mes</div>
                        <div className="w-20 bg-gray-200 h-1 rounded-full mt-1 overflow-hidden">
                          <div className="bg-success h-full" style={{ width: '65%' }}></div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-sm text-slate-500 font-medium">-8.5 Ton</span>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-black border border-primary/20 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                          Activo
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
        
        {/* Simple Footer */}
        <footer className="max-w-7xl mx-auto py-6 border-t border-gray-200 dark:border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
          <p>© 2024 Wattismoney. Inversión responsable y transparente.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a className="hover:text-black transition-colors" href="#">Privacidad</a>
            <a className="hover:text-black transition-colors" href="#">Términos</a>
            <a className="hover:text-black transition-colors" href="#">Soporte</a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;