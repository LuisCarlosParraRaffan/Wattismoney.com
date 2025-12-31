import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';
import { ComoFuncionaImg1, ComoFuncionaImg2, ComoFuncionaImg3 } from '../components/AppImages';

const ComoFunciona: React.FC = () => {
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
          <Link to="/contratos" className="hover:text-black transition-colors">Contratos</Link>
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

      {/* Main Content Wrapper - Content uses font-display (Cairo) as requested in HTML design */}
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
            <Link to="/oportunidades" className="h-14 px-8 flex items-center justify-center rounded-xl bg-primary text-black text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all border-2 border-black">
              Explorar Oportunidades
              <span className="material-symbols-outlined ml-2">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Visual Content Grid */}
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex flex-col gap-24 lg:gap-32">
          {/* Section 1: Qué es */}
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
                  <span className="material-symbols-outlined text-3xl">question_mark</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight">¿Qué es?</h2>
              </div>
              <p className="text-xl leading-relaxed text-gray-800 font-medium">
                Inyección de liquidez en contratos de energía. Eres intermediario entre productores y consumidores de energía eléctrica.
              </p>
              <div className="h-1 w-20 bg-primary mt-2"></div>
            </div>
          </section>

          {/* Section 2: Por qué (Reversed on desktop) */}
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
                  <span className="material-symbols-outlined text-3xl">lightbulb</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight">¿Por qué?</h2>
              </div>
              <p className="text-xl leading-relaxed text-gray-800 font-medium">
                Porque las grandes empresas necesitan financiar la compra de su energía limpia, al ser montos muy representativos en su operación. Es como un factoring de energía.
              </p>
              <div className="h-1 w-20 bg-black mt-2"></div>
            </div>
          </section>

          {/* Section 3: Cómo */}
          <section className="group flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute inset-0 bg-primary translate-x-3 translate-y-3 rounded-2xl border-2 border-black"></div>
              <div className="relative bg-white border-2 border-black rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                <ComoFuncionaImg3 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                {/* UI Overlay Element for effect */}
                <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(238,255,0,1)]">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                    Inversión Exitosa
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-black text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">touch_app</span>
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
            <span className="material-symbols-outlined text-6xl text-black">bolt</span>
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              ¿Listo para transformar el mercado?
            </h2>
            <p className="text-lg text-gray-600 max-w-lg">
              Únete a los inversores que ya están generando rentabilidad mientras impulsan la energía limpia.
            </p>
            <Link to="/oportunidades" className="h-16 px-10 flex items-center justify-center rounded-xl bg-primary text-black text-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all border-2 border-black min-w-[280px]">
              Explorar Oportunidades
            </Link>
          </div>
        </section>
      </main>

      {/* BEGIN: Footer (Copied from Landing.tsx for exact match) */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 py-10 border-t border-gray-100 font-sans">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-4">
             <WattismoneyLogo className="h-8 w-auto" />
            <span className="text-sm text-gray-400 font-normal">© 2025</span>
          </div>
          
          {/* Links */}
          <div className="flex gap-6 text-sm text-gray-500">
            <a className="hover:text-black transition-colors" href="#">Términos</a>
            <a className="hover:text-black transition-colors" href="#">Privacidad</a>
            <a className="hover:text-black transition-colors" href="#">Cookies</a>
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
      {/* END: Footer */}
    </div>
  );
};

export default ComoFunciona;