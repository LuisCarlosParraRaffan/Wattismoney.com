import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const KYCSuccess: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main font-body antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#f0f0f0] bg-white px-8 py-4 dark:border-[#333] dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
            </Link>
        </div>
        <a className="group flex items-center gap-2 text-sm font-semibold text-black transition-opacity hover:opacity-70 dark:text-white" href="#">
          <span>¿Necesitas ayuda?</span>
          <span className="material-symbols-outlined text-[20px]">help</span>
        </a>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          
          {/* Status Icon */}
          <div className="relative mx-auto flex size-24 items-center justify-center rounded-full bg-primary/20">
            <span className="material-symbols-outlined text-6xl text-black dark:text-primary">hourglass_top</span>
            {/* Check badge */}
            <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-primary ring-4 ring-white dark:ring-[#1a1a1a]">
              <span className="material-symbols-outlined text-lg text-black font-bold">check</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Documentos recibidos
            </h1>
            <div className="space-y-2">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Tu perfil está siendo revisado por nuestro equipo de cumplimiento. Este es un paso necesario para garantizar la seguridad de tus inversiones.
              </p>
              
              <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-lg bg-[#f9f9f9] p-4 text-sm dark:bg-[#2a2a2a]">
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  <span className="font-semibold">Tiempo estimado de revisión:</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">24 a 48 horas hábiles</p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Hemos enviado un correo de confirmación con los detalles de tu solicitud.
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full py-4">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>Registro</span>
              <span>Verificación</span>
              <span>Inversión</span>
            </div>
            <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="flex flex-col justify-center overflow-hidden bg-primary text-xs text-white text-center whitespace-nowrap transition duration-500" style={{ width: '66%' }}></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <Link 
              to="/login"
              className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-bold text-black shadow-sm transition-all hover:bg-primary-hover hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-[#1a1a1a]"
            >
              Login en Watt is Money
            </Link>
            <button className="text-sm font-medium text-gray-500 hover:text-black hover:underline dark:text-gray-400 dark:hover:text-white">
              ¿Subiste el documento incorrecto?
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#f0f0f0] py-6 text-center dark:border-[#333]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Wattismoney. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default KYCSuccess;