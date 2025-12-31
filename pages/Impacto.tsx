import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';
import { ImpactoHeroImage } from '../components/AppImages';

const Impacto: React.FC = () => {
  return (
    <div className="bg-background-light text-text-main antialiased overflow-x-hidden font-display">
      <div className="relative flex min-h-screen w-full flex-col">
        {/* BEGIN: Navigation (Unified with Landing) */}
        <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm md:shadow-none border-b border-gray-100 md:border-none font-sans">
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-3 group">
            <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
          </Link>
          {/* Main Menu (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/contratos" className="hover:text-black transition-colors">Contratos</Link>
            <Link to="/impacto" className="text-black font-semibold transition-colors">Impacto</Link>
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
          <div className="w-full max-w-[1280px] px-4 md:px-10 py-12 md:py-20">
            <div className="@container">
              <div className="flex flex-col-reverse lg:flex-row gap-10 items-center">
                <div className="flex flex-col gap-6 flex-1 lg:pr-10">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border-color bg-green-50 px-3 py-1">
                    <span className="material-symbols-outlined text-green-600 text-sm">eco</span>
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Impacto Real</span>
                  </div>
                  <h1 className="text-text-main text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                    Transformando el futuro con energía e inversión
                  </h1>
                  <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-[600px]">
                    Wattismoney conecta la necesidad de financiación de grandes consumidores con inversores que buscan rentabilidad y propósito. Aceleramos la transición energética democratizando el acceso a proyectos sostenibles.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-[#dcdc11] text-text-main text-base font-bold shadow-sm transition-transform active:scale-95 cursor-pointer">
                      Únete al Cambio
                    </button>
                    <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-white border border-border-color hover:bg-gray-50 text-text-main text-base font-bold transition-colors cursor-pointer">
                      Ver Reporte 2024
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border-color">
                    <div>
                      <p className="text-3xl font-black text-text-main">100%</p>
                      <p className="text-sm font-medium text-gray-500">Financiación Sostenible</p>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-text-main">+25k</p>
                      <p className="text-sm font-medium text-gray-500">Hogares Equivalentes</p>
                    </div>
                  </div>
                </div>
                {/* Hero Image */}
                <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100 relative group">
                  <ImpactoHeroImage className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <p className="font-bold text-xl mb-1">Uniendo riqueza y sostenibilidad</p>
                      <p className="text-sm opacity-90 leading-relaxed">Generamos valor financiero mientras construimos un planeta más limpio para las futuras generaciones.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission / Triple Impact Section */}
        <div className="w-full bg-gray-50 border-y border-border-color flex justify-center">
          <div className="w-full max-w-[1280px] px-4 md:px-10 py-16">
            <div className="flex flex-col gap-10">
              <div className="text-center max-w-3xl mx-auto mb-6">
                <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">Nuestra Misión</span>
                <h2 className="text-text-main text-3xl md:text-4xl font-black tracking-tight mb-4">Triple Impacto: Ambiental, Social y Económico</h2>
                <p className="text-gray-600 text-lg">
                  Nuestra plataforma no solo busca el retorno financiero. Facilitamos la transición energética creando un ecosistema de abundancia compartida.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Ambiental */}
                <div className="relative overflow-hidden rounded-2xl border border-border-color bg-white p-8 hover:shadow-xl hover:border-green-400 transition-all group">
                  <div className="size-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">forest</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-3">Impacto Ambiental</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Reducimos miles de toneladas de CO2 al año facilitando la adopción de energías renovables en industrias de alto consumo. Cada contrato es un paso hacia un aire más limpio.
                  </p>
                </div>
                {/* Económico */}
                <div className="relative overflow-hidden rounded-2xl border border-border-color bg-white p-8 hover:shadow-xl hover:border-primary transition-all group">
                  <div className="size-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
                    <span className="material-symbols-outlined text-3xl">savings</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-3">Impacto Económico</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Generamos riqueza real para nuestros inversores con rendimientos competitivos, mientras optimizamos los costos energéticos de las empresas, mejorando su competitividad.
                  </p>
                </div>
                {/* Social */}
                <div className="relative overflow-hidden rounded-2xl border border-border-color bg-white p-8 hover:shadow-xl hover:border-blue-400 transition-all group">
                  <div className="size-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">groups</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-3">Impacto Social</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Democratizamos el acceso a la financiación de grandes infraestructuras. Permitimos que cualquier persona sea partícipe y beneficiaria de la revolución energética.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Democratization / Feature Section */}
        <div className="w-full bg-white flex justify-center overflow-hidden">
          <div className="w-full max-w-[1280px] px-4 md:px-10 py-20">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              {/* Card Visualization */}
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <div className="bg-white p-8">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">W</div>
                        <div>
                          <p className="font-bold text-sm">Proyecto Solar Norte</p>
                          <p className="text-xs text-gray-500">Financiación completada</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Activo</span>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-600">Inversores Participantes</span>
                          <span className="font-bold text-black">1,240</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-600">Capital Levantado</span>
                          <span className="font-bold text-black">$2.5M USD</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-black w-full"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <div className="flex-1 bg-gray-50 rounded p-3 text-center">
                          <p className="text-xs text-gray-500 mb-1">Rentabilidad</p>
                          <p className="text-lg font-black text-green-600">12%</p>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded p-3 text-center">
                          <p className="text-xs text-gray-500 mb-1">CO2 Evitado</p>
                          <p className="text-lg font-black text-black">850t</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Text Content */}
              <div className="flex flex-col gap-6 flex-1">
                <h2 className="text-text-main text-3xl md:text-4xl font-black leading-tight tracking-tight">
                  Democratizando la Energía
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Históricamente, la inversión en infraestructura energética estaba reservada para grandes capitales institucionales. En Wattismoney, rompemos esa barrera.
                </p>
                <ul className="flex flex-col gap-4 mt-2">
                  <li className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-primary bg-black rounded-full p-1 text-sm mt-1">check</span>
                    <div>
                      <strong className="block text-text-main font-bold">Acceso Universal</strong>
                      <span className="text-gray-600 text-sm">Desde pequeños ahorradores hasta grandes inversores, todos pueden participar.</span>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-primary bg-black rounded-full p-1 text-sm mt-1">check</span>
                    <div>
                      <strong className="block text-text-main font-bold">Transparencia Total</strong>
                      <span className="text-gray-600 text-sm">Trazabilidad completa de dónde va tu dinero y qué impacto genera.</span>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-primary bg-black rounded-full p-1 text-sm mt-1">check</span>
                    <div>
                      <strong className="block text-text-main font-bold">Abundancia Sostenible</strong>
                      <span className="text-gray-600 text-sm">Creemos en un futuro donde la rentabilidad no está reñida con el cuidado del planeta.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Rocket Section */}
        <div className="w-full bg-[#f4f4f0] flex justify-center border-t border-border-color">
          <div className="w-full max-w-[1280px] px-4 md:px-10 py-24">
            <div className="rounded-3xl bg-black overflow-hidden relative">
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
                  <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                </div>
                <h2 className="text-white text-3xl md:text-5xl font-black tracking-tight max-w-3xl">
                  Construye un futuro de abundancia sostenible
                </h2>
                <p className="text-gray-400 text-lg max-w-xl">
                  Tu inversión impulsa la industria, protege el medio ambiente y hace crecer tu patrimonio. Sé parte de la solución.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                  <Link to="/oportunidades" className="flex items-center justify-center rounded-lg h-14 px-10 bg-primary hover:bg-[#dcdc11] text-text-main text-lg font-bold shadow-lg shadow-yellow-900/20 transition-all hover:translate-y-[-2px] cursor-pointer">
                    Invertir en Impacto
                  </Link>
                  <button className="flex items-center justify-center rounded-lg h-14 px-10 bg-transparent border-2 border-white hover:bg-white/10 text-white text-lg font-bold transition-all cursor-pointer">
                    Solicitar Financiación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full bg-white border-t border-border-color flex justify-center py-10">
          <div className="w-full max-w-[1280px] px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <WattismoneyLogo className="h-6 w-auto opacity-50 hover:opacity-100 transition-all text-gray-900" />
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
    </div>
  );
};

export default Impacto;