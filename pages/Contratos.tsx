import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';
import { ContratosHeroImage } from '../components/AppImages';

const Contratos: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* BEGIN: Navigation (Copied from Landing.tsx for exact match) */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm md:shadow-none border-b border-gray-100 md:border-none">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 group">
          <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
        </Link>
        {/* Main Menu (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/contratos" className="text-black font-semibold transition-colors">Contratos</Link>
          <Link to="/impacto" className="hover:text-black transition-colors">Impacto</Link>
          <Link to="/hoja-de-ruta" className="hover:text-black transition-colors">Hoja de Ruta</Link>
        </nav>
        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium hover:text-gray-600 hidden sm:block">Login</Link>
          <Link to="/signup" className="bg-w-accent text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm cursor-pointer hover:opacity-90">
            Registro
          </Link>
        </div>
      </header>
      {/* END: Navigation */}

      {/* Hero Section */}
      <div className="w-full bg-white flex justify-center">
        <div className="w-full max-w-7xl px-6 md:px-12 py-12 md:py-20">
          <div className="@container">
            <div className="flex flex-col-reverse lg:flex-row gap-10 items-center">
              <div className="flex flex-col gap-6 flex-1 lg:pr-10">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  <span className="size-2 rounded-full bg-green-500"></span>
                  <span className="text-xs font-medium text-gray-600">Contratos Activos 2026</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-black">
                  Energía segura para la industria del mañana
                </h1>
                <p className="text-gray-600 text-lg md:text-xl font-normal leading-relaxed max-w-[600px]">
                  Wattismoney opera como un banco de energía verde, gestionando contratos de suministro para las industrias más exigentes del país. Rentabilidad sólida, impacto medible.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Link to="/oportunidades" className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-[#dcdc11] text-black text-base font-bold shadow-sm transition-transform active:scale-95 cursor-pointer">
                    Ver Oportunidades
                  </Link>
                  <Link to="/como-funciona" className="flex items-center justify-center rounded-lg h-12 px-8 bg-white border border-gray-200 hover:bg-gray-50 text-black text-base font-bold transition-colors cursor-pointer">
                    Cómo Funciona
                  </Link>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                     <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG0UY1i5WZ-Nx9DJ3mctWsLW8sxXScDo-gWFswKe1VLx0qG9YeRvLbUul7_dcPM_tDgbbp1RyTNfTDlvKNCWSi3oWkssaDJ8ETlh4kY84aLnTrzOKQCqWH8n94ZkQEGkpiwyjHtm0Y6YJKri9HYKcTciQ-iG6L1sT-F5jfX2Qb38OU_9IqK1071Anq_TOgg8L4ie7_rfKD8KzvRmYFQD5UFHjRwROeikAqZ2p37fT-4QiHs0F4Q7oqmOXqwInYJ9hfsn47GxN4GFI" alt="Inv 1" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                     <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7R6sYi-k9WpTSn_4SzwpK31oihy3OCce7WdmzpcJILSy_yQKuj7mTXQ6uzhnBgD1iEoGRwROgY-dBkCVNz94VuuOJjV45B8mpCSD43yETmJb1JuPLscHFQsgoVxXQuhoUQx4SHm8u3lQU6NocyyI9-eRy4qNR22Yt6AhXSltsWl9EZb_Ml_cAOQOkMggO3duwOkXw_nNkC0LmxpyEmyeuV2Z4qgU8bZQGN9Zft5Ng-AoYVbwicz_dVmnlyyPfoT7Cs7w69X88Hws" alt="Inv 2" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                     <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOVaYU5MhOHFwjr292aA-m9Sm0xTVO8bfXAL6xj27XjB144mS3f0XsBGDiB49b4gYcoEKUAvd2B4WGhhwd5zHon2YpvdONwG2zlwUJSYmkPWaGn7IJifAzxbsRFndmqBC4Yh5u_XuDBVz37wBinTLr-ohSsn-cv_-unmZXdy3WFrulEBSlomDocxjczxRGSBiVzmE9GAVUGBIAt4wOXT7LV1C--e86CqEJE2Jt8aJVOmhiTgw_YCa0wrbrXp_jsNBk_f0hSkxukI4" alt="Inv 3" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  </div>
                  <p>Más de 500 inversores confían en nosotros</p>
                </div>
              </div>
              <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100 relative group">
                {/* Updated to use object-cover for img tag instead of bg-cover */}
                <ContratosHeroImage className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="font-bold text-lg">Planta Solar Textil del Valle</p>
                    <p className="text-sm opacity-90">Suministrando 2.4 GWh anuales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="w-full bg-gray-50 border-y border-gray-100 flex justify-center">
        <div className="w-full max-w-7xl px-6 md:px-12 py-16">
          <div className="flex flex-col gap-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-black text-3xl font-bold tracking-tight mb-3">Impacto en Números</h2>
              <p className="text-gray-600">Nuestros contratos respaldan el crecimiento de sectores estratégicos, garantizando un suministro eléctrico estable y sostenible.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metric 1 */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl">electric_bolt</span>
                </div>
                <p className="text-gray-500 font-medium mb-2">Energía Comprometida</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black tracking-tight">12.5</span>
                  <span className="text-xl font-bold text-gray-400">GWh</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +15% vs último trimestre
                </div>
              </div>
              {/* Metric 2 */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl">eco</span>
                </div>
                <p className="text-gray-500 font-medium mb-2">Energía Verde</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black tracking-tight">80</span>
                  <span className="text-xl font-bold text-gray-400">%</span>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Priorizamos la energía verde a toda costa.
                </p>
              </div>
              {/* Metric 3 */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl">domain</span>
                </div>
                <p className="text-gray-500 font-medium mb-2">Industrias Activas</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black tracking-tight">45</span>
                  <span className="text-xl font-bold text-gray-400">+</span>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Empresas de alto consumo que confían en nuestra infraestructura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="w-full bg-white flex justify-center">
        <div className="w-full max-w-7xl px-6 md:px-12 py-20">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-bold tracking-wider text-gray-500 uppercase">Sectores Estratégicos</span>
              <h2 className="text-black text-3xl md:text-4xl font-black leading-tight tracking-tight">
                Industrias que creen en nosotros
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                No solo generamos energía, impulsamos la productividad. Nuestros contratos están diseñados para industrias donde la electricidad es un insumo crítico para la operación.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Industry 1: Textile */}
              <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white border border-gray-200 hover:border-primary transition-colors">
                <div className="size-12 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                  <span className="material-symbols-outlined">checkroom</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Producción Textil</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Reducción drástica de la huella de carbono en procesos de teñido y manufactura a gran escala, garantizando cumplimiento normativo internacional.
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2 text-sm font-bold text-black">
                  <span>12 Contratos activos</span>
                </div>
              </div>
              {/* Industry 2: Flowers */}
              <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white border border-gray-200 hover:border-primary transition-colors">
                <div className="size-12 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                  <span className="material-symbols-outlined">local_florist</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Sector Floricultor</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Energía limpia y constante 24/7 para invernaderos automatizados y cadenas de frío críticas para la exportación.
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2 text-sm font-bold text-black">
                  <span>8 Contratos activos</span>
                </div>
              </div>
              {/* Industry 3: Plastics */}
              <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white border border-gray-200 hover:border-primary transition-colors">
                <div className="size-12 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                  <span className="material-symbols-outlined">recycling</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Industria de Plásticos</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Eficiencia energética crítica para maquinaria de inyección y moldeo de alta demanda, reduciendo costos operativos.
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2 text-sm font-bold text-black">
                  <span>5 Contratos activos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust/CTA Section */}
      <div className="w-full bg-[#f4f4f0] flex justify-center border-t border-gray-200">
        <div className="w-full max-w-7xl px-6 md:px-12 py-24">
          <div className="rounded-3xl bg-black overflow-hidden relative">
            {/* Abstract pattern background */}
            <div 
              className="absolute inset-0 opacity-20" 
              data-alt="Abstract dot pattern background"
              style={{
                  backgroundImage: 'radial-gradient(#ecec13 1px, transparent 1px)',
                  backgroundSize: '32px 32px'
              }}
            >
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-10 md:p-20 gap-8">
              <div className="size-16 rounded-full bg-white/10 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-4xl">verified_user</span>
              </div>
              <h2 className="text-white text-3xl md:text-5xl font-black tracking-tight max-w-2xl">
                Invierta con la confianza de un banco verde
              </h2>
              <p className="text-gray-400 text-lg max-w-xl">
                Únase a los inversores que ya están financiando la transición energética de la industria. Retornos claros, contratos transparentes.
              </p>
              <Link to="/oportunidades" className="mt-4 flex items-center justify-center rounded-lg h-14 px-10 bg-primary hover:bg-[#dcdc11] text-black text-lg font-bold shadow-lg shadow-yellow-900/20 transition-all hover:translate-y-[-2px] cursor-pointer">
                Comenzar a Invertir
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Simple */}
      <div className="w-full bg-white border-t border-gray-100 flex justify-center py-10">
        <div className="w-full max-w-7xl px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-400">bolt</span>
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
  );
};

export default Contratos;