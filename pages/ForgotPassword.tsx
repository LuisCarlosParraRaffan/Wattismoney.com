import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envío
    if(email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background-light font-sans text-text-main">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-card border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up">
        <div className="flex flex-col items-center pt-10 pb-4 px-8">
            <Link to="/" className="w-48 h-14 relative flex items-center justify-center mb-2 group">
                <WattismoneyLogo className="h-10 md:h-12 w-auto" />
            </Link>
        </div>

        <div className="px-10 pb-12 pt-4 flex flex-col gap-6">
          <div className="text-center space-y-3">
            <h1 className="text-text-main text-3xl font-bold leading-tight tracking-tight font-display">
                Recuperación de Contraseña
            </h1>
            {!submitted ? (
              <p className="text-gray-500 text-sm font-normal leading-relaxed max-w-sm mx-auto">
                Introduce tu dirección de correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
              </p>
            ) : (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                Hemos enviado las instrucciones a <strong>{email}</strong>. Por favor revisa tu bandeja de entrada.
              </div>
            )}
          </div>

          {!submitted && (
            <form className="flex flex-col gap-6 mt-2" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-text-main text-sm font-bold ml-1 font-display" htmlFor="email">
                  Correo electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400">mail</span>
                  </div>
                  <input 
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input flex w-full rounded-lg text-text-main focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-200 bg-gray-50 h-12 pl-12 pr-4 placeholder:text-gray-400 text-base font-normal transition-colors outline-none" 
                    placeholder="ejemplo@wattismoney.com" 
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-text-main text-lg font-bold leading-normal tracking-wide shadow-sm mt-2 font-display">
                <span className="mr-2">Enviar instrucciones</span>
                <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
              </button>
            </form>
          )}

          <div className="flex justify-center mt-2">
            <Link to="/login" className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-text-main text-sm font-bold hover:bg-gray-50 transition-colors group font-display">
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span>Volver al inicio de sesión</span>
            </Link>
          </div>
        </div>

        <div className="h-1.5 w-full bg-gray-50">
          <div className="h-full w-1/3 bg-primary rounded-r-full"></div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 opacity-70">
            © 2024 Wattismoney. Inversión en energía sostenible.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;