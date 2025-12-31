import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const InvestorProfileSuccess: React.FC = () => {
  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 w-full">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <WattismoneyLogo className="h-10 md:h-12 w-auto" />
          </Link>
        </div>
        <a className="text-sm font-semibold text-gray-500 hover:text-text-main flex items-center gap-2 transition-colors" href="#">
          <span className="material-symbols-outlined text-lg">help</span>
            ¿Necesitas ayuda?
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-white w-full">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column (Desktop) / Bottom (Mobile) - Card */}
          <div className="flex flex-col items-center lg:items-start space-y-8 order-2 lg:order-1">
            <div className="bg-gray-50 rounded-2xl p-8 w-full border border-gray-100 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg mb-2 relative">
                  <span className="material-symbols-outlined text-5xl text-black">verified_user</span>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100">
                    <span className="material-symbols-outlined text-green-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-text-main mb-2">¡Perfil Definido con Éxito!</h2>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">Hemos analizado tus respuestas y diseñado una estrategia que se alinea con tus objetivos financieros y de impacto.</p>
                </div>
                
                <div className="w-full bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Tu Perfil Asignado</span>
                    <span className="text-xl font-bold text-black flex items-center gap-2">
                      Moderado
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full font-bold uppercase tracking-wider">Balanceado</span>
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                    <span className="material-symbols-outlined text-gray-400">balance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop) / Top (Mobile) - Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-1 lg:order-2">
            <div>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Siguiente Paso</span>
              <h1 className="text-4xl md:text-5xl font-bold text-text-main leading-tight mb-4">
                Tu camino hacia la <span className="relative whitespace-nowrap">
                  <span className="relative z-10">inversión sostenible</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/60 -z-0 skew-x-[-10deg]"></span>
                </span> comienza ahora.
              </h1>
              <p className="text-lg text-gray-500">
                Como inversor <strong>Moderado</strong>, tendrás acceso a oportunidades que equilibran rentabilidad y seguridad, priorizando proyectos de energía solar y eólica consolidados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                <span className="material-symbols-outlined text-[#c7d600] mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                <div className="text-left">
                  <h3 className="font-bold text-text-main">Rentabilidad Estable</h3>
                  <p className="text-sm text-gray-500">TIR estimada entre 7-9% anual.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                <span className="material-symbols-outlined text-[#c7d600] mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                <div className="text-left">
                  <h3 className="font-bold text-text-main">Impacto Directo</h3>
                  <p className="text-sm text-gray-500">Reducción garantizada de CO2.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
              <Link 
                to="/oportunidades"
                className="flex-1 bg-primary hover:bg-primary-hover text-text-main px-8 py-4 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <span>Ver Oportunidades</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link 
                to="/dashboard"
                className="flex-1 bg-white hover:bg-gray-50 text-text-main border-2 border-gray-200 px-8 py-4 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>Ir al Dashboard</span>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Al continuar, aceptas nuestros <a className="underline hover:text-black" href="#">Términos de Servicio</a> y la <a className="underline hover:text-black" href="#">Política de Inversión</a>.
            </p>
          </div>

        </div>
      </main>

      <footer className="py-8 bg-white border-t border-gray-100 w-full">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-500">© 2024 Wattismoney. Plataforma regulada y segura para la inversión en energía sostenible.</p>
        </div>
      </footer>
    </div>
  );
};

export default InvestorProfileSuccess;