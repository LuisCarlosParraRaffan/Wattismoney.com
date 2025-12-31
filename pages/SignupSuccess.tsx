import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const SignupSuccess: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased selection:bg-primary selection:text-black">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Header: Minimalist */}
        <header className="flex items-center justify-between border-b border-gray-100 bg-white dark:bg-background-dark px-6 py-4 lg:px-20">
          <div className="flex items-center gap-3">
             <Link to="/" className="flex items-center gap-3 group">
                 <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
            </Link>
          </div>
          <a className="hidden text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white sm:block" href="#">
            ¿Necesitas ayuda?
          </a>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg space-y-8 text-center">
            {/* Success Icon / Hero Graphic */}
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary/20 p-4">
              <span className="material-symbols-outlined text-[64px] text-black/80">check_circle</span>
            </div>
            {/* Main Message */}
            <div className="space-y-4">
              <h1 className="text-3xl font-black leading-tight tracking-tight text-black dark:text-white sm:text-4xl">
                ¡Cuenta creada con éxito!
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                Tu registro inicial en <strong>Wattismoney</strong> ha sido completado. 
                Hemos enviado un enlace de confirmación a tu correo. Por favor, verifícalo para continuar con el proceso de seguridad.
              </p>
            </div>
            {/* Action Card */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-neutral-900 dark:shadow-none">
              <div className="bg-gray-50 p-6 dark:bg-neutral-800">
                <div className="flex flex-col gap-4">
                  {/* Primary Button */}
                  <Link to="/kyc-upload" className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-black shadow-sm transition-transform hover:scale-[1.02] hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    <span>Ir a Verificación de Identidad</span>
                  </Link>
                  {/* Secondary Link */}
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">¿No has recibido el correo? </span>
                    <a className="font-semibold text-black underline decoration-primary decoration-2 underline-offset-2 hover:decoration-4 dark:text-white" href="#">
                      Reenviar correo
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* KYC Preview / Additional Context */}
            <div className="mt-8 flex flex-col items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <p>Próximos pasos para activar tu inversión:</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 opacity-50 grayscale filter transition-all hover:grayscale-0 hover:opacity-100">
                  <span className="material-symbols-outlined text-lg">mail</span>
                  <span>Email</span>
                </div>
                <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 font-medium text-black dark:text-white">
                  <span className="material-symbols-outlined text-lg text-primary-hover">badge</span>
                  <span>KYC</span>
                </div>
                <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 opacity-50 grayscale filter transition-all hover:grayscale-0 hover:opacity-100">
                  <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                  <span>Invertir</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-100 bg-white py-8 dark:border-gray-800 dark:bg-background-dark">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Wattismoney. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white" href="#">Privacidad</a>
              <a className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white" href="#">Términos</a>
              <a className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white" href="#">Ayuda</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SignupSuccess;