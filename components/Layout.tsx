import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { WattismoneyLogo } from './Icons';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false);

  // Auto-expand menu if current path is within opportunities
  useEffect(() => {
    if (location.pathname.includes('mercado-primario') || location.pathname.includes('mercado-secundario')) {
      setIsOpportunitiesOpen(true);
    }
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-text-main shadow-sm font-bold' : 'text-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-text-main font-medium';
  };

  const getIconClass = (path: string) => {
    return location.pathname === path ? 'icon-filled text-black' : 'group-hover:text-black transition-colors';
  };

  const isOpportunitiesActive = location.pathname.includes('mercado');

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main font-display h-screen flex overflow-hidden">
      {/* Sidebar - Hidden on mobile, fixed on desktop */}
      <aside className="w-64 bg-white dark:bg-[#1a1a2e] border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between z-20 hidden md:flex shrink-0">
        <div className="flex flex-col h-full">
          {/* Sidebar Header / Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-800/50">
            <Link to="/dashboard" className="flex items-center gap-3 group">
               <WattismoneyLogo className="h-10 w-auto transition-transform group-hover:scale-105" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/dashboard')}`}>
              <span className={`material-symbols-outlined text-[22px] ${getIconClass('/dashboard')}`}>dashboard</span>
              <span className="text-sm">Dashboard</span>
            </Link>
            
            {/* Oportunidades Dropdown */}
            <div>
              <button 
                onClick={() => setIsOpportunitiesOpen(!isOpportunitiesOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${isOpportunitiesActive ? 'bg-gray-50 dark:bg-gray-800/50 text-text-main' : 'text-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-text-main'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[22px] ${isOpportunitiesActive ? 'icon-filled text-black' : 'group-hover:text-black'}`}>storefront</span>
                  <span className={`text-sm ${isOpportunitiesActive ? 'font-bold' : 'font-medium'}`}>Oportunidades</span>
                </div>
                <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isOpportunitiesOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              
              {/* Submenu */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpportunitiesOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="pl-10 pr-2 flex flex-col gap-1">
                  <Link to="/mercado-primario" className={`block px-3 py-2 rounded-lg text-xs transition-colors ${location.pathname === '/mercado-primario' ? 'text-black font-bold bg-primary/20' : 'text-slate-500 hover:text-black hover:bg-gray-50'}`}>
                    Mercado Principal
                  </Link>
                  <Link to="/mercado-secundario" className={`block px-3 py-2 rounded-lg text-xs transition-colors ${location.pathname === '/mercado-secundario' ? 'text-black font-bold bg-primary/20' : 'text-slate-500 hover:text-black hover:bg-gray-50'}`}>
                    Mercado Secundario
                  </Link>
                </div>
              </div>
            </div>
            
            <Link to="/cartera" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/cartera')}`}>
              <span className={`material-symbols-outlined text-[22px] ${getIconClass('/cartera')}`}>account_balance_wallet</span>
              <span className="text-sm">Cartera</span>
            </Link>
            
            <Link to="/mi-impacto" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/mi-impacto')}`}>
              <span className={`material-symbols-outlined text-[22px] ${getIconClass('/mi-impacto')}`}>eco</span>
              <span className="text-sm">Impacto</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Sistema</span>
            </div>

            <Link to="/perfil" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/perfil')}`}>
              <span className={`material-symbols-outlined text-[22px] ${getIconClass('/perfil')}`}>person</span>
              <span className="text-sm">Mi Perfil</span>
            </Link>

            <Link to="/ajustes" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/ajustes')}`}>
              <span className={`material-symbols-outlined text-[22px] ${getIconClass('/ajustes')}`}>settings</span>
              <span className="text-sm">Ajustes</span>
            </Link>

            <Link to="/clasificacion" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/clasificacion')}`}>
              <span className={`material-symbols-outlined text-[22px] ${getIconClass('/clasificacion')}`}>emoji_events</span>
              <span className="text-sm">Clasificación</span>
            </Link>
            
            <Link to="/ayuda" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/ayuda')}`}>
              <span className={`material-symbols-outlined text-[22px] ${getIconClass('/ayuda')}`}>help</span>
              <span className="text-sm">Ayuda</span>
            </Link>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Link to="/perfil" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
              <div className="w-9 h-9 rounded-full bg-cover bg-center border border-gray-200 shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvu_acTAcXzZCvNCXsdJZaunnYQ_yEEe7v0x_HsoEddbRSqcbbdTZzOawo41lXnkpgppIP-nePgiImYbkLH0CMCrHSqEuWHPpm_CtQkJOVNbMeV4NvTKHjIKV2J3SFqlE-4t_HLxGLEj46OG2jqbzZ7KsemSYnBLegeEnQ5QHI0LYku_aSWEunxLKoNIc6XsCSrfrNuKmKugiXUNyp6mpidmeR7zCSzM9l3459VstIZ1NJhw0VvzSVQkQWHa8X0WuSqnt_qi5bddE")' }}>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-text-main truncate dark:text-white">Carlos Rodriguez</span>
                <span className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-wider">Inversionista Pro</span>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;