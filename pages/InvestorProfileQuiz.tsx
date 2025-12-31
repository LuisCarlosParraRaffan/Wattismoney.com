import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const InvestorProfileQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>('conservative');

  const handleNext = () => {
    navigate('/investor-profile-success');
  };

  return (
    <div className="bg-background-light font-display text-text-main flex flex-col min-h-screen antialiased">
      {/* Header */}
      <header className="w-full border-b border-gray-100 bg-white px-4 sm:px-10 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-3 text-text-main">
            <WattismoneyLogo className="h-8 w-auto" />
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-8">
              <span className="text-text-main text-sm font-bold opacity-50 cursor-not-allowed">Oportunidades</span>
              <span className="text-text-main text-sm font-bold opacity-50 cursor-not-allowed">Mis Inversiones</span>
              <span className="text-text-main text-sm font-bold opacity-50 cursor-not-allowed">Impacto</span>
            </div>
            <div className="flex gap-2">
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-50 text-text-main hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-50 text-text-main hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-[20px]">help</span>
              </button>
            </div>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-gray-100" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvu_acTAcXzZCvNCXsdJZaunnYQ_yEEe7v0x_HsoEddbRSqcbbdTZzOawo41lXnkpgppIP-nePgiImYbkLH0CMCrHSqEuWHPpm_CtQkJOVNbMeV4NvTKHjIKV2J3SFqlE-4t_HLxGLEj46OG2jqbzZ7KsemSYnBLegeEnQ5QHI0LYku_aSWEunxLKoNIc6XsCSrfrNuKmKugiXUNyp6mpidmeR7zCSzM9l3459VstIZ1NJhw0VvzSVQkQWHa8X0WuSqnt_qi5bddE")' }}></div>
          </div>
          <div className="flex md:hidden items-center">
            <button className="p-2 text-text-main">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 justify-center py-10 px-4 sm:px-6">
        <div className="flex flex-col max-w-[800px] w-full gap-10">
          
          {/* Progress Header */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-primary text-text-main text-xs font-bold uppercase tracking-wider">Paso 2</span>
              </div>
              <h1 className="text-text-main text-4xl sm:text-5xl font-black leading-none tracking-tight font-cairo">
                Perfil de Inversor
              </h1>
              <p className="text-gray-600 text-lg font-medium leading-relaxed max-w-2xl">
                Ayúdanos a definir tu perfil de riesgo para recomendarte las mejores oportunidades de energía sostenible adaptadas a tus necesidades.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex gap-6 justify-between items-end">
                <p className="text-text-main text-sm font-bold leading-normal">Tolerancia al Riesgo</p>
                <p className="text-gray-500 text-xs font-bold leading-normal">Pregunta 3 de 8</p>
              </div>
              <div className="rounded-full bg-gray-100 h-3 w-full overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: '37%' }}></div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 sm:p-10 flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-text-main tracking-tight text-2xl font-bold leading-snug font-cairo">
                ¿Cómo reaccionarías si tu cartera de inversión pierde un 10% de su valor en un mes?
              </h2>
              <p className="text-gray-500 text-base font-medium leading-relaxed">
                Esta pregunta nos ayuda a entender tu tolerancia a la volatilidad del mercado a corto plazo. No hay respuestas incorrectas.
              </p>
            </div>

            <div className="grid gap-4">
              {/* Option 1 */}
              <label className={`relative flex cursor-pointer rounded-xl border-2 p-5 transition-all group ${selectedOption === 'conservative' ? 'border-primary bg-primary/10' : 'border-transparent bg-gray-50 hover:border-primary hover:bg-white hover:shadow-md'}`}>
                <input 
                    className="peer sr-only" 
                    name="risk_profile" 
                    type="radio" 
                    checked={selectedOption === 'conservative'}
                    onChange={() => setSelectedOption('conservative')}
                />
                <div className="flex w-full items-start gap-4">
                  <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${selectedOption === 'conservative' ? 'border-primary bg-primary text-black' : 'border-gray-300 bg-white group-hover:border-primary'}`}>
                    {selectedOption === 'conservative' && <div className="h-2.5 w-2.5 rounded-full bg-black"></div>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-bold text-text-main">Vendería todo inmediatamente</span>
                    <span className="text-sm text-gray-500 font-medium">Prefiero la seguridad sobre la rentabilidad. No me siento cómodo con pérdidas.</span>
                  </div>
                </div>
                {selectedOption === 'conservative' && (
                    <div className="absolute right-5 top-5 text-text-main">
                        <span className="material-symbols-outlined text-[24px]">check_circle</span>
                    </div>
                )}
              </label>

              {/* Option 2 */}
              <label className={`relative flex cursor-pointer rounded-xl border-2 p-5 transition-all group ${selectedOption === 'moderate' ? 'border-primary bg-primary/10' : 'border-transparent bg-gray-50 hover:border-primary hover:bg-white hover:shadow-md'}`}>
                <input 
                    className="peer sr-only" 
                    name="risk_profile" 
                    type="radio"
                    checked={selectedOption === 'moderate'}
                    onChange={() => setSelectedOption('moderate')}
                />
                <div className="flex w-full items-start gap-4">
                  <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${selectedOption === 'moderate' ? 'border-primary bg-primary text-black' : 'border-gray-300 bg-white group-hover:border-primary'}`}>
                     {selectedOption === 'moderate' && <div className="h-2.5 w-2.5 rounded-full bg-black"></div>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-bold text-text-main">Mantendría la inversión</span>
                    <span className="text-sm text-gray-500 font-medium">Entiendo que es parte del ciclo y esperaría a que se recupere.</span>
                  </div>
                </div>
                {selectedOption === 'moderate' && (
                    <div className="absolute right-5 top-5 text-text-main">
                        <span className="material-symbols-outlined text-[24px]">check_circle</span>
                    </div>
                )}
              </label>

              {/* Option 3 */}
              <label className={`relative flex cursor-pointer rounded-xl border-2 p-5 transition-all group ${selectedOption === 'aggressive' ? 'border-primary bg-primary/10' : 'border-transparent bg-gray-50 hover:border-primary hover:bg-white hover:shadow-md'}`}>
                <input 
                    className="peer sr-only" 
                    name="risk_profile" 
                    type="radio" 
                    checked={selectedOption === 'aggressive'}
                    onChange={() => setSelectedOption('aggressive')}
                />
                <div className="flex w-full items-start gap-4">
                  <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${selectedOption === 'aggressive' ? 'border-primary bg-primary text-black' : 'border-gray-300 bg-white group-hover:border-primary'}`}>
                    {selectedOption === 'aggressive' && <div className="h-2.5 w-2.5 rounded-full bg-black"></div>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-bold text-text-main">Invertiría más capital</span>
                    <span className="text-sm text-gray-500 font-medium">Aprovecharía los precios bajos para aumentar mi posición a largo plazo.</span>
                  </div>
                </div>
                {selectedOption === 'aggressive' && (
                    <div className="absolute right-5 top-5 text-text-main">
                        <span className="material-symbols-outlined text-[24px]">check_circle</span>
                    </div>
                )}
              </label>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-2">
              <button 
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-gray-500 hover:text-text-main transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                Atrás
              </button>
              <button 
                onClick={handleNext}
                className="flex items-center gap-3 rounded-xl bg-primary hover:bg-primary-hover text-black h-14 px-10 text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                Siguiente
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 text-center pb-8">
            <span className="material-symbols-outlined text-[18px] text-gray-400">lock</span>
            <p className="text-xs font-bold text-gray-400">
              Sus datos están encriptados. Wattismoney cumple con la regulación GDPR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorProfileQuiz;