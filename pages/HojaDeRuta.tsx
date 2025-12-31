import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';
import { RoadmapSolarIcon, RoadmapWindIcon, RoadmapChargeIcon, RoadmapNetworkIcon } from '../components/AppImages';

const HojaDeRuta: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* BEGIN: Navigation (Standardized) */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm md:shadow-none border-b border-gray-100 md:border-none">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 group">
          <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
        </Link>
        {/* Main Menu (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/contratos" className="hover:text-black transition-colors">Contratos</Link>
          <Link to="/impacto" className="hover:text-black transition-colors">Impacto</Link>
          <Link to="/hoja-de-ruta" className="text-black font-semibold transition-colors">Hoja de Ruta</Link>
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

      {/* BEGIN: Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 md:px-12 md:py-20 py-20">
        {/* Section: Headline and Intro */}
        <section className="mb-32">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-black text-neon-yellow px-3 py-1.5 rounded-full text-xs font-bold tracking-wide mb-6">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" fillRule="evenodd"></path>
            </svg>
            HOJA DE RUTA
          </div>
          {/* Headline */}
          <h1 className="font-extrabold leading-tight tracking-tight text-gray-900 max-w-4xl text-5xl md:text-7xl">
            Hoja de Ruta de Wattismoney <br />
            <span className="bg-neon-yellow px-1 inline-block">es sostenible</span>
          </h1>
        </section>

        {/* Section: Timeline Visual */}
        <section className="relative mb-16">
          {/* Timeline Connector Line Container */}
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-4 z-0">
            {/* The yellow line connecting the circles */}
            <div className="w-full h-3 bg-neon-yellow border-y-2 border-black"></div>
          </div>
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left group">
              {/* Large Icon Circle */}
              <div className="w-[120px] h-[120px] md:mx-auto mb-10 relative flex items-center justify-center bg-white rounded-full border-[3px] border-neon-yellow border-4 shadow-xl">
                {/* Icon Placeholder */}
                <RoadmapSolarIcon className="w-10 h-10 z-10 opacity-80" />
              </div>
              {/* Content Block */}
              <div className="flex flex-col h-full">
                {/* Small Icon */}
                <div className="mb-4 mx-auto md:mx-0 bg-neon-yellow w-10 h-10 rounded-lg border border-black flex items-center justify-center">
                  <RoadmapSolarIcon className="w-5 h-5 mix-blend-multiply" />
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight">Inversión en parques solares</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                  Invierta en la fuente de energía más abundante. Proyectos fotovoltaicos a gran escala con contratos de venta de energía a largo plazo.
                </p>
                {/* Pill Date Tag */}
                <span className="inline-block bg-neon-yellow py-1 rounded text-xs font-bold border border-transparent self-center md:self-start px-5 text-black">
                  Q3 2024
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left group">
              {/* Large Icon Circle */}
              <div className="w-[120px] h-[120px] md:mx-auto mb-10 relative flex items-center justify-center bg-white rounded-full border-[3px] border-neon-yellow border-4 shadow-xl">
                <RoadmapWindIcon className="w-10 h-10 z-10 opacity-80" />
              </div>
              {/* Content Block */}
              <div className="flex flex-col h-full">
                <div className="mb-4 mx-auto md:mx-0 bg-neon-yellow w-10 h-10 rounded-lg border border-black flex items-center justify-center">
                  <RoadmapWindIcon className="w-5 h-5 mix-blend-multiply" />
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight">Inversión en parques eólicos</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                  Aproveche la fuerza del viento. Turbinas de última generación en ubicaciones estratégicas offshore y onshore de alto rendimiento.
                </p>
                <span className="inline-block bg-neon-yellow py-1 rounded text-xs font-bold border border-transparent self-center md:self-start px-5 text-black">
                  Q4 2024
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left group">
              {/* Large Icon Circle */}
              <div className="w-[120px] h-[120px] md:mx-auto mb-10 relative flex items-center justify-center bg-white rounded-full border-[3px] border-neon-yellow border-4 shadow-xl">
                <RoadmapChargeIcon className="w-10 h-10 z-10 opacity-80" />
              </div>
              {/* Content Block */}
              <div className="flex flex-col h-full">
                <div className="mb-4 mx-auto md:mx-0 bg-neon-yellow w-10 h-10 rounded-lg border border-black flex items-center justify-center">
                   <RoadmapChargeIcon className="w-5 h-5 mix-blend-multiply" />
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight">Inversión en infraestructura de carga de vehículos eléctricos</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                  Infraestructura crítica para el mañana. Redes de estaciones de carga rápida para vehículos eléctricos en corredores urbanos.
                </p>
                <span className="inline-block bg-neon-yellow py-1 rounded text-xs font-bold border border-transparent self-center md:self-start px-5 text-black">
                  2025
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left group">
              {/* Large Icon Circle */}
              <div className="w-[120px] h-[120px] md:mx-auto mb-10 relative flex items-center justify-center bg-white rounded-full border-[3px] border-neon-yellow border-4 shadow-xl">
                 <RoadmapNetworkIcon className="w-10 h-10 z-10 opacity-80" />
              </div>
              {/* Content Block */}
              <div className="flex flex-col h-full">
                <div className="mb-4 mx-auto md:mx-0 bg-neon-yellow w-10 h-10 rounded-lg border border-black flex items-center justify-center">
                  <RoadmapNetworkIcon className="w-5 h-5 mix-blend-multiply" />
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight">Inversión en redes inteligentes</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                  La columna vertebral de la eficiencia. Tecnología de distribución y almacenamiento optimizada mediante Inteligencia Artificial.
                </p>
                <span className="inline-block bg-neon-yellow py-1 rounded text-xs font-bold border border-transparent self-center md:self-start px-5 text-black">
                  2025
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Newsletter CTA */}
        <section className="mt-32">
          <div className="w-full rounded-2xl p-8 md:p-16 text-white relative overflow-hidden group shadow-neon bg-black" style={{ boxShadow: '0 0 0 1px #333, 0 20px 50px -10px rgba(0,0,0,0.5)' }}>
            {/* Subtle Glow Effect within card */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-neon-yellow opacity-5 blur-[100px] pointer-events-none"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              {/* Text Content */}
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Mantente informado del lanzamiento</h2>
                <p className="text-gray-400 text-lg">
                  Sé el primero en saber cuando estos nuevos activos estén disponibles para inversión en la plataforma.
                </p>
              </div>
              {/* Form Content */}
              <div className="w-full max-w-md">
                <form className="flex flex-col sm:flex-row gap-3 bg-gray-900/50 p-2 rounded-xl border border-gray-700 focus-within:border-gray-500 transition-colors">
                  <input 
                    className="border-none text-white placeholder-gray-500 flex-grow px-4 py-3 bg-gray-800 focus:ring-0 focus:outline-none focus:shadow-[0_0_0_2px_#EAFF04] rounded-lg" 
                    placeholder="Ingresa tu correo electrónico" 
                    type="email" 
                  />
                  <button className="bg-neon-yellow text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors whitespace-nowrap" type="submit">
                    Notificarme
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-3 pl-2">
                  Al suscribirte aceptas nuestros <a className="underline hover:text-white" href="#">Términos</a> y <a className="underline hover:text-white" href="#">Privacidad</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* END: Main Content */}

      {/* BEGIN: Footer (Standardized) */}
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

export default HojaDeRuta;