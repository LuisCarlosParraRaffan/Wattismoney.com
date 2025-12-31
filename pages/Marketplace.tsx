import React from 'react';
import { Link } from 'react-router-dom';

const Marketplace: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main">
      {/* Header */}
      <header className="h-20 bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 lg:px-8 shrink-0 z-10">
        <h1 className="text-2xl font-black tracking-tight text-text-main dark:text-white">Mercado Secundario</h1>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end mr-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Saldo disponible</span>
            <span className="text-base font-bold text-black dark:text-white">2.450,00 €</span>
          </div>
          <button className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-gray-200 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Ingresar Fondos</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50/50 dark:bg-background-dark">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
          
          {/* Top Section: Highlights & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Box: Liquidity */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-black dark:bg-[#0f0f23] text-white rounded-xl p-6 relative overflow-hidden shadow-lg group border border-gray-800">
                <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[140px]">currency_exchange</span>
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-wide mb-4">
                    <span className="material-symbols-outlined text-[14px] icon-filled">bolt</span>
                    <span>Liquidez Directa</span>
                  </div>
                  <h2 className="text-2xl font-black mb-2 leading-tight">¿Necesitas salir de tu inversión?</h2>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    No necesitas esperar comprador. <strong>Wattismoney te ofrece recomprar tu posición</strong> inmediatamente garantizando tu liquidez.
                  </p>
                  <button className="w-full bg-primary hover:bg-primary-hover active:bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-between shadow-[0_0_15px_rgba(238,255,0,0.2)]">
                    <span>Solicitar Recompra</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>
              </div>
              <div className="bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-gray-500">storefront</span>
                    <h3 className="font-bold text-base text-black dark:text-white">Venta en Mercado Abierto</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Publica tus participaciones para que otros usuarios las adquieran al precio que tú decidas.</p>
                </div>
                <button className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-black dark:text-white font-bold py-2 rounded-lg transition-colors text-xs uppercase tracking-wide">
                  Gestionar mis Órdenes de Venta
                </button>
              </div>
            </div>

            {/* Right Box: Stats & Explanation */}
            <div className="lg:col-span-8 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 rounded-xl p-6 lg:p-8 relative shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <h2 className="text-3xl font-black leading-tight max-w-lg text-black dark:text-white">Inversión con Impacto y Liquidez Sostenible</h2>
                  <div className="flex -space-x-2">
                    <div className="size-8 rounded-full bg-gray-100 border-2 border-white dark:border-[#1a1a2e] flex items-center justify-center text-xs font-bold text-black">JD</div>
                    <div className="size-8 rounded-full bg-gray-200 border-2 border-white dark:border-[#1a1a2e] flex items-center justify-center text-xs font-bold text-black">MR</div>
                    <div className="size-8 rounded-full bg-primary border-2 border-white dark:border-[#1a1a2e] flex items-center justify-center text-xs font-bold text-black">+2k</div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-3xl leading-relaxed">
                  El Mercado Secundario asegura que la financiación nunca se detenga. Al <strong>comprar una posición</strong>, relevas a otro inversor y garantizas que la <strong>industria siga recibiendo energía limpia</strong>. Tu liquidez mantiene vivo el ecosistema.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row items-center justify-around gap-6 relative">
                  <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0"></div>
                  <div className="relative z-10 flex flex-col items-center text-center bg-gray-50 dark:bg-[#1f1f33] px-4 rounded-lg">
                    <div className="bg-white dark:bg-[#2d2d42] size-12 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-2xl text-black dark:text-white">solar_power</span>
                    </div>
                    <p className="text-2xl font-black text-black dark:text-white">14.2 GWh</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Energía Transaccionada</p>
                  </div>
                  <div className="relative z-10 bg-white dark:bg-[#2d2d42] border border-gray-200 dark:border-gray-600 rounded-full p-2 shadow-sm text-primary">
                    <span className="material-symbols-outlined icon-filled text-black dark:text-primary">cached</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center bg-gray-50 dark:bg-[#1f1f33] px-4 rounded-lg">
                    <div className="bg-white dark:bg-[#2d2d42] size-12 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-2xl text-black dark:text-white">factory</span>
                    </div>
                    <p className="text-2xl font-black text-black dark:text-white">8 Sectores</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Industrias Apoyadas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1a1a2e] rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Volumen 24h</span>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-xl font-black text-black dark:text-white">145.200€</span>
                <span className="text-green-700 dark:text-green-400 text-[10px] font-bold bg-green-50 dark:bg-green-900/30 px-1 py-0.5 rounded">+2.5%</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a1a2e] rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Rentabilidad Media</span>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-xl font-black text-black dark:text-white">6.8%</span>
                <span className="text-green-700 dark:text-green-400 text-[10px] font-bold bg-green-50 dark:bg-green-900/30 px-1 py-0.5 rounded">+0.1%</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a1a2e] rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Oportunidades</span>
              <span className="text-xl font-black block mt-1 text-black dark:text-white">342</span>
            </div>
            <div className="bg-white dark:bg-[#1a1a2e] rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Operaciones Hoy</span>
              <span className="text-xl font-black block mt-1 text-black dark:text-white">58</span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1a1a2e] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mt-2">
            <div className="w-full lg:w-1/3">
              <label className="flex flex-col w-full">
                <div className="flex w-full items-stretch rounded-lg h-10 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2d2d42] focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden">
                  <div className="text-gray-500 flex items-center justify-center pl-3">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </div>
                  <input className="flex w-full min-w-0 flex-1 resize-none bg-transparent border-none focus:ring-0 text-black dark:text-white h-full placeholder:text-gray-500 px-3 text-sm font-medium" placeholder="Buscar proyecto, ID o industria..." />
                </div>
              </label>
            </div>
            <div className="flex gap-2 flex-wrap justify-start lg:justify-center flex-1">
              <button className="group flex h-9 items-center justify-center gap-x-2 rounded-lg bg-primary pl-4 pr-4 transition-transform active:scale-95 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-black">apps</span>
                <span className="text-black text-sm font-bold">Todos</span>
              </button>
              <button className="group flex h-9 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50 pl-4 pr-4 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-orange-500">solar_power</span>
                <span className="text-black dark:text-white text-sm font-medium">Solar</span>
              </button>
              <button className="group flex h-9 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50 pl-4 pr-4 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-blue-400">air</span>
                <span className="text-black dark:text-white text-sm font-medium">Eólica</span>
              </button>
              <button className="group flex h-9 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50 pl-4 pr-4 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-green-600">forest</span>
                <span className="text-black dark:text-white text-sm font-medium">Biomasa</span>
              </button>
            </div>
            <div className="w-full lg:w-auto min-w-[180px]">
              <div className="relative flex items-center">
                <select className="w-full h-10 pl-3 pr-8 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2d2d42] text-black dark:text-white text-sm font-medium focus:ring-primary focus:border-primary cursor-pointer appearance-none">
                  <option>Más recientes</option>
                  <option>Mayor rentabilidad</option>
                  <option>Menor precio</option>
                  <option>Vencimiento próximo</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 pointer-events-none text-gray-500 text-[20px]">sort</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <button className="px-6 py-4 text-sm font-bold text-black dark:text-white border-b-2 border-primary bg-white dark:bg-[#1a1a2e] z-10 relative">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  Mercado de Compra (Oportunidades)
                </span>
              </button>
              <button className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-[#1a1a2e] transition-colors">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">sell</span>
                  Mis Órdenes de Venta
                </span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    <th className="p-4 font-semibold">Proyecto</th>
                    <th className="p-4 font-semibold">Tecnología</th>
                    <th className="p-4 font-semibold">Ubicación</th>
                    <th className="p-4 font-semibold">Vencimiento</th>
                    <th className="p-4 font-semibold text-right">Precio / Part.</th>
                    <th className="p-4 font-semibold text-right">TIR Estimada</th>
                    <th className="p-4 font-semibold text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                  {/* Row 1 */}
                  <tr className="group hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors">
                    <td className="p-4">
                      <Link to="/contrato/sol-8821" className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                          <span className="material-symbols-outlined">solar_power</span>
                        </div>
                        <div>
                          <p className="font-bold text-black dark:text-white text-base group-hover:text-primary transition-colors">Solaria Fase III</p>
                          <p className="text-xs text-gray-500">ID: #SOL-8821</p>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 dark:bg-orange-900/20 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-400 ring-1 ring-inset ring-orange-600/20">Solar</span>
                    </td>
                    <td className="p-4 text-black dark:text-white">Sevilla, ES</td>
                    <td className="p-4 text-black dark:text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">36 meses</span>
                        <span className="text-xs text-gray-500">Restantes</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-base text-black dark:text-white">520,00 €</span>
                        <span className="text-xs text-green-600">+4.0% vs Nom.</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-green-600 text-base">6.8%</span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="bg-primary hover:bg-primary-hover text-black text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 w-24">
                        Comprar
                      </button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="group hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors">
                    <td className="p-4">
                      <Link to="/contrato/wind-2034" className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <span className="material-symbols-outlined">air</span>
                        </div>
                        <div>
                          <p className="font-bold text-black dark:text-white text-base group-hover:text-primary transition-colors">Parque Eólico Norte</p>
                          <p className="text-xs text-gray-500">ID: #WIND-2034</p>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20">Eólica</span>
                    </td>
                    <td className="p-4 text-black dark:text-white">Galicia, ES</td>
                    <td className="p-4 text-black dark:text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">12 meses</span>
                        <span className="text-xs text-gray-500">Restantes</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-base text-black dark:text-white">980,00 €</span>
                        <span className="text-xs text-red-500">-2.0% vs Nom.</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-green-600 text-base">7.2%</span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="bg-primary hover:bg-primary-hover text-black text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 w-24">
                        Comprar
                      </button>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="group hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors">
                    <td className="p-4">
                      <Link to="/contrato/bio-1120" className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                          <span className="material-symbols-outlined">forest</span>
                        </div>
                        <div>
                          <p className="font-bold text-black dark:text-white text-base group-hover:text-primary transition-colors">BioPlanta Extremadura</p>
                          <p className="text-xs text-gray-500">ID: #BIO-1120</p>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Biomasa</span>
                    </td>
                    <td className="p-4 text-black dark:text-white">Badajoz, ES</td>
                    <td className="p-4 text-black dark:text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">58 meses</span>
                        <span className="text-xs text-gray-500">Restantes</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-base text-black dark:text-white">1.250,00 €</span>
                        <span className="text-xs text-green-600">+0.5% vs Nom.</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-green-600 text-base">8.1%</span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="bg-primary hover:bg-primary-hover text-black text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 w-24">
                        Comprar
                      </button>
                    </td>
                  </tr>
                  {/* Row 4 */}
                  <tr className="group hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors">
                    <td className="p-4">
                      <Link to="/contrato/hyd-9982" className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <span className="material-symbols-outlined">water_drop</span>
                        </div>
                        <div>
                          <p className="font-bold text-black dark:text-white text-base group-hover:text-primary transition-colors">Mini-Hidro Pirineos</p>
                          <p className="text-xs text-gray-500">ID: #HYD-9982</p>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20">Hidro</span>
                    </td>
                    <td className="p-4 text-black dark:text-white">Huesca, ES</td>
                    <td className="p-4 text-black dark:text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">24 meses</span>
                        <span className="text-xs text-gray-500">Restantes</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-base text-black dark:text-white">450,00 €</span>
                        <span className="text-xs text-gray-500">Nominal</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-green-600 text-base">5.5%</span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="bg-primary hover:bg-primary-hover text-black text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 w-24">
                        Comprar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando <span className="font-bold text-black dark:text-white">1</span> a <span className="font-bold text-black dark:text-white">4</span> de <span className="font-bold text-black dark:text-white">342</span> resultados
                  </p>
                </div>
                <div>
                  <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <a className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0" href="#">
                      <span className="sr-only">Anterior</span>
                      <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </a>
                    <a aria-current="page" className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-bold text-black focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="#">1</a>
                    <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-black dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0" href="#">2</a>
                    <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-black dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0" href="#">3</a>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-black dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:outline-offset-0">...</span>
                    <a className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0" href="#">
                      <span className="sr-only">Siguiente</span>
                      <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-8 border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-500">
            <p>© 2024 Wattismoney. Inversiones sostenibles y transparentes.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Marketplace;