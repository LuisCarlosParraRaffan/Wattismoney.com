import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo, InversoresGroup } from '../components/Icons';
import { HeroSolarParkImage } from '../components/AppImages';

const Landing: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* BEGIN: Navigation */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm md:shadow-none">
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
          <Link to="/login" className="text-sm font-medium hover:text-gray-600 hidden sm:block">Login</Link>
          <Link to="/signup" className="bg-w-accent text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm cursor-pointer hover:opacity-90">
            Registro
          </Link>
        </div>
      </header>
      {/* END: Navigation */}

      {/* BEGIN: Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Hero Text Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            Wattismoney: Tu plataforma de inversión en energía limpia <span className="text-accent-highlight">energía.</span>
          </h1>
          <p className="text-gray-600 text-lg md:max-w-md leading-relaxed">
            Aporta liquidez a contratos de suministro de energía limpia. Genera utilidades atractivas y un impacto sostenible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link to="/contratos" className="bg-w-accent text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors shadow-sm text-center cursor-pointer hover:opacity-90 flex items-center justify-center">
              Ver Contratos
            </Link>
            <Link to="/como-funciona" className="border border-gray-300 bg-white px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group cursor-pointer hover:opacity-90">
              Más sobre cómo funciona
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          {/* Social Proof */}
          <div className="flex items-center gap-3 pt-6">
            <div className="flex items-center gap-2">
              <InversoresGroup className="h-12 w-auto" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-w-accent flex items-center justify-center text-[10px] font-bold ml-[-12px] z-10 relative">+1k</div>
            </div>
            <span className="text-sm text-gray-500 font-medium">Inversores confían en nosotros</span>
          </div>
        </div>
        {/* Hero Image Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] group">
          {/* Background Image - Using Component to Guarantee Render */}
          <HeroSolarParkImage className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          {/* Card Overlay Info */}
          <div className="absolute bottom-6 left-6 right-6 bg-gray-900/70 backdrop-blur-[10px] border border-white/10 p-4 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-800">
                {/* Icon placeholder */}
                <svg className="w-5 h-5 text-w-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <span className="font-semibold text-sm block">Contrato de energía solar - industria textil</span>
                <span className="text-xs text-gray-300">Proyecto destacado</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-1">
              <span className="text-xs text-gray-300">Rentabilidad estimada</span>
              <span className="text-w-accent font-bold text-sm">12% Anual</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div className="bg-w-accent h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Hero Section */}

      {/* BEGIN: Stats Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Usuarios Activos</span>
              {/* Icon Placeholder: Users */}
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
            </div>
            <div className="text-5xl font-extrabold mb-1">1k+</div>
            <div className="text-sm font-medium flex items-center gap-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-800">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <span>+12% este mes</span>
            </div>
          </div>
          {/* Stat Card 2 */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Energía Financiada en contratos</span>
              {/* Icon Placeholder: Bolt */}
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div className="text-5xl font-extrabold mb-1">10000<span className="text-base font-normal text-gray-500">MWh</span></div>
            <div className="text-sm font-medium flex items-center gap-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-800">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path></svg>
              </div>
              <span>70% Renovable</span>
            </div>
          </div>
          {/* Stat Card 3 */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">CO2 Evitado</span>
              {/* Icon Placeholder: Leaf */}
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M.178 2.076a.75.75 0 01.62-.182C3.59 2.522 5.792 4.232 7.026 6.486c1.03 1.89 1.44 3.968 1.198 5.918a.75.75 0 01-1.487.129 9.018 9.018 0 00-1.002-4.947 8.018 8.018 0 00-2.434-3.056C2.26 3.626.85 2.872.178 2.076z" fillRule="evenodd"></path>
                  <path clipRule="evenodd" d="M19.822 2.076a.75.75 0 00-.62-.182C16.41 2.522 14.208 4.232 12.974 6.486c-1.03 1.89-1.44 3.968-1.198 5.918a.75.75 0 011.487.129 9.018 9.018 0 001.002-4.947 8.018 8.018 0 002.434-3.056c1.043-.902 2.453-1.656 3.123-2.452z" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div className="text-5xl font-extrabold mb-1">1,200 <span className="text-base font-normal text-gray-500">Ton</span></div>
            <div className="text-sm text-gray-500 font-medium mt-2">
              Equivalente a 40k árboles
            </div>
          </div>
        </div>
      </section>
      {/* END: Stats Section */}

      {/* BEGIN: Features/Why Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column: Content */}
          <div className="space-y-6 md:sticky md:top-24">
            <span className="inline-block text-xs font-bold text-accent-highlight bg-yellow-50 px-3 py-1 rounded-full tracking-wider">¿POR QUÉ WATTISMONEY?</span>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Inversión Directa en Contratos Limpios
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Nuestra plataforma hace accesible la energía renovable para todos, eliminando intermediarios y garantizando la trazabilidad de cada watio generado.
            </p>
            <div className="pt-4">
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer hover:opacity-90">
                Conoce más sobre el modelo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
          </div>
          {/* Right Column: Feature Cards */}
          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-start transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-800">
                {/* Icon Placeholder: Piggy */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Inversión Directa en Contratos Limpios</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Olvídate de las barreras de entrada. Participa en proyectos de gran escala desde montos tan pequeños como 50€. Democratizamos el acceso a rentabilidades.
                </p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-start transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-800">
                {/* Icon Placeholder: Chart */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Utilidades Atractivas y Estables</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Monitorea la generación de energía y tus rendimientos en tiempo real a través de nuestro dashboard. Tecnología Blockchain para asegurar cada dato.
                </p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-start transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-800">
                {/* Icon Placeholder: Globe */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Impacto Sostenible Garantizado</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  No es solo dinero. Es futuro. Reduce tu huella de carbono directamente con cada inversión. Recibe certificados de origen y visualiza tu impacto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Features/Why Section */}

      {/* BEGIN: CTA Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 mb-12">
        <div className="bg-w-dark rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          {/* CTA Content */}
          <div className="flex-1 relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              ¿Listo para invertir en un mundo mejor?
            </h2>
            <p className="text-gray-400 mb-8 text-lg max-w-xl mx-auto md:mx-0">
              Regístrate en menos de 5 minutos y únete a los miles de inversores que ya están cambiando el modelo energético.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/signup" className="bg-w-accent text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg cursor-pointer hover:opacity-90">
                Crear cuenta gratis
              </Link>
              <Link to="/oportunidades" className="bg-white/10 text-white px-8 py-3 rounded-full font-medium hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10 cursor-pointer hover:opacity-90 flex items-center justify-center">
                Explorar proyectos
              </Link>
            </div>
          </div>
          {/* CTA Graphic/Dashboard Preview */}
          <div className="flex-1 w-full max-w-md relative z-10">
            {/* Dashboard Card Placeholder */}
            <div className="rounded-2xl p-6 border border-white/5 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500" style={{ backgroundColor: 'rgba(40, 40, 40, 0.9)' }}>
              {/* Inner Card Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-w-accent p-2 rounded-lg text-black">
                  {/* Coin Icon */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Tu Balance Total</p>
                  <p className="text-white text-2xl font-bold font-mono text-4xl font-sans">€ 12,490.00</p>
                </div>
              </div>
              {/* List Items */}
              <div className="space-y-3">
                <div className="bg-black/40 rounded-xl p-3 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-white font-medium">Solar PV Piguq</span>
                  </div>
                  <span className="text-w-accent font-mono">+8.2%</span>
                </div>
                <div className="bg-black/40 rounded-xl p-3 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-white font-medium">Wind Farm North</span>
                  </div>
                  <span className="text-w-accent font-mono">+6.5%</span>
                </div>
              </div>
            </div>
          </div>
          {/* Background Glow Effect */}
          <div className="absolute right-0 top-0 w-2/3 h-full bg-w-accent opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
        </div>
      </section>
      {/* END: CTA Section */}

      {/* BEGIN: Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 py-10 border-t border-gray-100">
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

export default Landing;