import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main">
      
      {/* Mobile Header */}
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
      <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-background-dark relative">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-gray-50/50 dark:from-[#1a1a2e] dark:to-background-dark -z-0 pointer-events-none"></div>
        
        <div className="max-w-[1100px] mx-auto p-6 lg:p-12 flex flex-col gap-10 relative z-10 pb-20">
          
          {/* Page Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">Perfil del Usuario</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Gestiona tu información personal y visualiza tu progreso.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-text-main dark:text-white">
                <span className="material-symbols-outlined text-[20px]">share</span>
                Compartir Perfil
              </button>
              <button className="flex-1 md:flex-none justify-center items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg">
                <span className="material-symbols-outlined text-[20px]">save</span>
                Guardar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#1a1a2e] shadow-lg bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnQWCQGcAOKnZ27WNIKK0LNA7_8U9np66Rfm8oqras10Jk2eEpp0e2soup9wuyNryjBgnKxH5fueNV2cdX0E1QIsJxQNpIO3Gkn7tJD76PpllRhWZ1tTyuoS0gAdzLk5pU2ndzG5E7OB50FNeY7-YrRZNgd1ScC9HKuJxKiGdDAisbsWEUwNERYmYPs7iVo1NlJXeVw4rIueUtnJ8g6JMhIasmOMCRg2aY690dVeCUz-vCVUvolIyIEyt3L_YvuYfjClZhvI1OXxk")'}}></div>
                  <div className="absolute bottom-0 right-0 bg-primary text-black p-1.5 rounded-full border-2 border-white dark:border-[#1a1a2e] shadow-sm flex items-center justify-center" title="Cuenta Verificada">
                    <span className="material-symbols-outlined text-[20px] font-bold">verified</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-text-main dark:text-white">Juan Pérez</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">Inversor Sostenible | Nivel 5</p>
                <div className="w-full flex gap-2">
                  <button className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg transition-colors text-sm shadow-sm flex justify-center items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Editar Perfil
                  </button>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-text-main dark:text-white">
                  <span className="material-symbols-outlined text-green-600">security</span>
                  Estado de la Cuenta
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-main dark:text-white">Identidad (KYC)</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Verificado el 12 Oct 2023</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-main dark:text-white">Seguridad 2FA</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Activado</span>
                      </div>
                    </div>
                    <button className="text-xs font-bold underline text-text-main dark:text-white">Configurar</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Gamification Hero */}
              <div className="bg-black dark:bg-[#0f0f23] text-white rounded-xl p-8 relative overflow-hidden shadow-lg border border-gray-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-800 to-black rounded-full mix-blend-overlay opacity-50 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary rounded-full mix-blend-overlay opacity-10 blur-3xl translate-y-1/4 -translate-x-1/4"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-primary font-bold text-sm tracking-widest uppercase mb-1">Tu Progreso</p>
                      <h3 className="text-3xl font-bold">Nivel 6: Magnate Solar</h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      <span className="font-bold text-primary">12,450 XP</span>
                      <span className="text-gray-400 text-sm"> / 15,000 XP</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                      <span>Progreso actual</span>
                      <span>75%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                      <div className="h-full bg-gradient-to-r from-yellow-600 to-primary rounded-full shadow-[0_0_15px_rgba(238,255,0,0.5)]" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
                    Estás a solo 2,550 puntos de desbloquear beneficios exclusivos de nivel 7.
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-1 hover:border-primary dark:hover:border-primary transition-colors cursor-default">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Inversión Total</span>
                  <span className="text-2xl font-bold text-text-main dark:text-white tracking-tight">€15,200</span>
                  <span className="text-xs text-green-600 flex items-center gap-1 font-bold mt-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +12% este mes
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-1 hover:border-primary dark:hover:border-primary transition-colors cursor-default">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">CO2 Evitado</span>
                  <span className="text-2xl font-bold text-text-main dark:text-white tracking-tight">3.2 Ton</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    Equivalente a 150 árboles
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-1 hover:border-primary dark:hover:border-primary transition-colors cursor-default">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Insignias</span>
                  <span className="text-2xl font-bold text-text-main dark:text-white tracking-tight">12</span>
                  <span className="text-xs text-primary-dark dark:text-primary font-bold flex items-center gap-1 mt-1">
                    Nueva insignia ganada!
                  </span>
                </div>
              </div>

              {/* Badges Section */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-text-main dark:text-white">Colección de Insignias</h3>
                  <button className="text-sm font-bold text-slate-500 hover:text-black dark:hover:text-white transition-colors">Ver todas</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Badge 1 */}
                  <div className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-[#1a1a2e] rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-inner">
                      <span className="material-symbols-outlined text-3xl text-yellow-700">emoji_events</span>
                    </div>
                    <span className="text-xs font-bold text-center text-text-main dark:text-white">Pionero Solar</span>
                  </div>
                  {/* Badge 2 */}
                  <div className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-[#1a1a2e] rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-inner">
                      <span className="material-symbols-outlined text-3xl text-green-700">forest</span>
                    </div>
                    <span className="text-xs font-bold text-center text-text-main dark:text-white">Guardián Eco</span>
                  </div>
                  {/* Badge 3 */}
                  <div className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-[#1a1a2e] rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-inner">
                      <span className="material-symbols-outlined text-3xl text-blue-700">water_drop</span>
                    </div>
                    <span className="text-xs font-bold text-center text-text-main dark:text-white">Hidro Master</span>
                  </div>
                  {/* Badge 4 (Locked) */}
                  <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-dashed opacity-60">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-gray-400">lock</span>
                    </div>
                    <span className="text-xs font-bold text-center text-slate-500 dark:text-slate-400">Inversor Top</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Form */}
          <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
              <h3 className="text-lg font-bold text-text-main dark:text-white">Información Personal</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Estos datos son privados y solo visibles para ti.</p>
            </div>
            <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Column 1 */}
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nombre Completo</label>
                  <input className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-main dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 font-semibold" disabled type="text" defaultValue="Juan Pérez García"/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                    </div>
                    <input className="bg-white dark:bg-[#2d2d42] border border-gray-200 dark:border-gray-700 text-text-main dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-3 font-medium" type="email" defaultValue="juan.perez@email.com"/>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">phone</span>
                    </div>
                    <input className="bg-white dark:bg-[#2d2d42] border border-gray-200 dark:border-gray-700 text-text-main dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-3 font-medium" type="tel" defaultValue="+34 600 000 000"/>
                  </div>
                </div>
              </div>
              {/* Column 2 */}
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Dirección</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">home</span>
                    </div>
                    <input className="bg-white dark:bg-[#2d2d42] border border-gray-200 dark:border-gray-700 text-text-main dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-3 font-medium" type="text" defaultValue="Calle de la Energía 45, Madrid"/>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Idioma Preferido</label>
                  <select className="bg-white dark:bg-[#2d2d42] border border-gray-200 dark:border-gray-700 text-text-main dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 font-medium">
                    <option selected>Español</option>
                    <option>English</option>
                    <option>Português</option>
                  </select>
                </div>
                <div className="pt-2">
                  <a className="text-sm text-primary-dark dark:text-primary font-bold hover:underline" href="#">Solicitar cambio de datos sensibles</a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-slate-400 text-xs py-4">
             © 2024 Wattismoney. Todos los derechos reservados.
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;