import React from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const Ayuda: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark font-display text-text-main relative overflow-hidden">
            {/* Mobile Header */}
            <header className="h-20 bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 md:hidden shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-3 group">
                        <WattismoneyLogo className="h-8 w-auto" />
                    </Link>
                </div>
                <button className="p-2 text-slate-500">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-white dark:bg-background-dark">
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-50 to-white dark:from-[#1a1a2e] dark:to-background-dark -z-0"></div>
                <div className="max-w-[1100px] mx-auto p-6 lg:p-12 flex flex-col gap-8 relative z-10">

                    {/* Search Hero */}
                    <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
                        <div>
                            <h1 className="text-4xl font-bold text-black dark:text-white tracking-tight mb-2">Centro de Ayuda</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">¿Cómo podemos ayudarte hoy?</p>
                        </div>
                        <div className="w-full relative group text-left">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400 text-[24px] group-focus-within:text-primary-dark transition-colors">search</span>
                            </div>
                            <input
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-lg transition-shadow placeholder-gray-400 text-black dark:text-white focus:outline-none"
                                placeholder="Busca preguntas, artículos o temas..."
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <a className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center gap-3 cursor-pointer">
                            <div className="w-14 h-14 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-[28px] text-yellow-700 dark:text-yellow-400 group-hover:text-black">rocket_launch</span>
                            </div>
                            <h3 className="font-bold text-lg text-black dark:text-white">Primeros Pasos</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">Guías para configurar tu cuenta y empezar a invertir.</p>
                        </a>
                        <a className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center gap-3 cursor-pointer">
                            <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-[28px] text-green-700 dark:text-green-400 group-hover:text-black">payments</span>
                            </div>
                            <h3 className="font-bold text-lg text-black dark:text-white">Inversiones</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">Detalles sobre rendimientos, pagos y carteras.</p>
                        </a>
                        <a className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center gap-3 cursor-pointer">
                            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-[28px] text-blue-700 dark:text-blue-400 group-hover:text-black">manage_accounts</span>
                            </div>
                            <h3 className="font-bold text-lg text-black dark:text-white">Mi Cuenta</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">Gestión de perfil, verificación y seguridad.</p>
                        </a>
                        <a className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center gap-3 cursor-pointer">
                            <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-[28px] text-purple-700 dark:text-purple-400 group-hover:text-black">gavel</span>
                            </div>
                            <h3 className="font-bold text-lg text-black dark:text-white">Legal</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">Términos, condiciones y política de privacidad.</p>
                        </a>
                    </div>

                    {/* FAQ and Contact Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                        {/* FAQs */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined">quiz</span>
                                Preguntas Frecuentes
                            </h2>
                            <div className="space-y-4">
                                <details className="group bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden open:border-primary/50 open:ring-1 open:ring-primary/20 transition-all">
                                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors select-none text-black dark:text-white">
                                        ¿Cómo funciona la inversión en energía solar?
                                        <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-400">expand_more</span>
                                    </summary>
                                    <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-transparent group-open:border-gray-100 dark:group-open:border-gray-700 group-open:pt-4">
                                        Al invertir en proyectos solares a través de Wattismoney, estás comprando participaciones de instalaciones fotovoltaicas reales. Estas instalaciones generan energía que se vende, y los beneficios se reparten entre los inversores proporcionalmente.
                                    </div>
                                </details>
                                <details className="group bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden open:border-primary/50 open:ring-1 open:ring-primary/20 transition-all">
                                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors select-none text-black dark:text-white">
                                        ¿Cuándo recibiré mis primeros rendimientos?
                                        <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-400">expand_more</span>
                                    </summary>
                                    <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-transparent group-open:border-gray-100 dark:group-open:border-gray-700 group-open:pt-4">
                                        Los rendimientos se distribuyen mensualmente una vez que la planta solar está operativa y conectada a la red. Generalmente, el primer pago se realiza a los 30-45 días de la puesta en marcha.
                                    </div>
                                </details>
                                <details className="group bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden open:border-primary/50 open:ring-1 open:ring-primary/20 transition-all">
                                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors select-none text-black dark:text-white">
                                        ¿Es seguro invertir en Wattismoney?
                                        <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-400">expand_more</span>
                                    </summary>
                                    <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-transparent group-open:border-gray-100 dark:group-open:border-gray-700 group-open:pt-4">
                                        Sí. Wattismoney es una plataforma regulada y todos los proyectos pasan por una estricta auditoría técnica y legal (Due Diligence). Además, utilizamos tecnología blockchain para garantizar la transparencia de todas las transacciones.
                                    </div>
                                </details>
                                <details className="group bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden open:border-primary/50 open:ring-1 open:ring-primary/20 transition-all">
                                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors select-none text-black dark:text-white">
                                        ¿Puedo retirar mi dinero antes de tiempo?
                                        <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-400">expand_more</span>
                                    </summary>
                                    <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-transparent group-open:border-gray-100 dark:group-open:border-gray-700 group-open:pt-4">
                                        Las inversiones tienen un plazo definido. Sin embargo, disponemos de un Mercado Secundario donde puedes poner a la venta tus participaciones a otros inversores si necesitas liquidez inmediata.
                                    </div>
                                </details>
                            </div>
                        </div>

                        {/* Contact Sidebar */}
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined">support_agent</span>
                                Contáctanos
                            </h2>
                            {/* Contact Card */}
                            <div className="bg-black dark:bg-[#0f0f23] text-white rounded-xl p-6 relative overflow-hidden shadow-lg border border-gray-800">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full mix-blend-overlay opacity-20 blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                                <h3 className="font-bold text-xl mb-2 relative z-10">¿No encuentras lo que buscas?</h3>
                                <p className="text-gray-300 text-sm mb-6 relative z-10">Nuestro equipo de soporte especializado está disponible para resolver tus dudas específicas.</p>
                                <div className="flex flex-col gap-3 relative z-10">
                                    <button className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-lg transition-colors shadow-md flex justify-center items-center gap-2">
                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                        Enviar Correo
                                    </button>
                                    <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors border border-white/20 flex justify-center items-center gap-2">
                                        <span className="material-symbols-outlined text-[20px]">chat</span>
                                        Chat en Vivo
                                    </button>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-700 relative z-10">
                                    <p className="text-xs text-gray-400 text-center">Horario de atención: <br /> Lun - Vie, 9:00 - 18:00 CET</p>
                                </div>
                            </div>

                            {/* Resources Card */}
                            <div className="bg-gray-50 dark:bg-[#1a1a2e] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-bold text-sm mb-3 text-gray-500 uppercase tracking-wide">Recursos Directos</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <a className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-gray-400 text-[18px]">description</span>
                                            Documentación Legal
                                        </a>
                                    </li>
                                    <li>
                                        <a className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-gray-400 text-[18px]">forum</span>
                                            Foro de la Comunidad
                                        </a>
                                    </li>
                                    <li>
                                        <a className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-gray-400 text-[18px]">bug_report</span>
                                            Reportar un problema
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-gray-400 text-xs py-8 border-t border-gray-100 dark:border-gray-800 mt-8">
                        © 2024 Wattismoney. Todos los derechos reservados.
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Ayuda;