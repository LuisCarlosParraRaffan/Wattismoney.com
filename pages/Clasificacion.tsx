import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WattismoneyLogo } from '../components/Icons';

const Clasificacion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mensual' | 'general'>('mensual');

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main relative">
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

        {/* Desktop / Main Header */}
        <header className="hidden md:flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 px-8 py-5 backdrop-blur-md sticky top-0 z-30 shrink-0">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-text-main dark:text-white leading-none">Tablas de Clasificación</h1>
                <p className="text-sm text-slate-500 font-medium">Compite, invierte y lidera el cambio sostenible.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 rounded-full bg-gray-50 dark:bg-gray-800/50 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700">
                    <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                    <span className="dark:text-white">Próximo Nivel: <span className="font-bold">240 pts</span></span>
                </div>
                <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>
                </button>
            </div>
        </header>

        {/* Main Content Scrollable */}
        <div className="flex-1 overflow-y-auto relative">
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-32">
                
                {/* Tabs / Toggle */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex rounded-full bg-gray-50 dark:bg-[#1a1a2e] p-1.5 shadow-inner border border-gray-100 dark:border-gray-700">
                        <button 
                            onClick={() => setActiveTab('mensual')}
                            className={`px-8 py-2.5 rounded-full shadow-sm transition-all font-bold text-sm ${activeTab === 'mensual' ? 'bg-primary text-black' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'}`}
                        >
                            Mensual
                        </button>
                        <button 
                            onClick={() => setActiveTab('general')}
                            className={`px-8 py-2.5 rounded-full shadow-sm transition-all font-bold text-sm ${activeTab === 'general' ? 'bg-primary text-black' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'}`}
                        >
                            General
                        </button>
                    </div>
                </div>

                {/* Top 3 Podium Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-16 px-4 md:px-20">
                    {/* 2nd Place */}
                    <div className="order-2 md:order-1 flex flex-col items-center">
                        <div className="relative mb-4 group cursor-pointer">
                            <div className="w-24 h-24 rounded-full border-4 border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-[#1a1a2e] relative z-10 overflow-hidden">
                                <img alt="User 2" className="w-full h-full rounded-full object-cover grayscale-[0.2]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuoTskY7NSQ5DzfddA5fJh0NqgLvLyb4ml93VsmqNOLsoEL17hz2S7Z0gxOc5ZL78Ixv7-OoRhpAk2Q78lVotwHzbkPeXgqINeTeX_wkJal_rKVUjxXwe3plpPWXyeSJZIH_mmyDCTtTV_1M6lYdm6hOEQ8jlky1CYjjkeTFRTLVtAjSBGkYb9H1mM7mHg6-FIlQ1-ky0WV1gRrz-WlU-6w7rC7xdCY7DzjFXDJ1C-n1KNGxsV9mRqoOvCaRts2K_QMqeHEDN0hKs"/>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white font-bold text-sm px-3 py-0.5 rounded-full shadow-sm z-20 flex items-center gap-1">
                                <span>#2</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold dark:text-white">Sofía L.</h3>
                        <p className="text-primary font-bold">+12%</p>
                        <p className="text-sm text-slate-500 font-medium">380 kg CO2</p>
                        <div className="w-full h-32 bg-gradient-to-t from-gray-100 to-white dark:from-gray-800 dark:to-transparent mt-4 rounded-t-xl mx-4 border-t border-x border-gray-100 dark:border-gray-700/50"></div>
                    </div>

                    {/* 1st Place (Winner) */}
                    <div className="order-1 md:order-2 flex flex-col items-center z-10 -mt-8">
                        <div className="relative mb-6 group cursor-pointer transform hover:scale-105 transition-transform duration-300">
                            <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full"></div>
                            <span className="material-symbols-outlined absolute -top-8 left-1/2 -translate-x-1/2 text-primary text-4xl animate-bounce">crown</span>
                            <div className="w-32 h-32 rounded-full border-[6px] border-primary p-1 bg-white dark:bg-[#1a1a2e] relative z-10 overflow-hidden">
                                <img alt="User 1" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfCVgej2Ws2IWsDX-OYjVJc2L34DpWYoWp39RuOTKie6_wlyFXzurBdTE79ENffiwS0kpZNuHAtc5RZHPbUxXlXNiojXOXkk0mmcRvuoyQgey1hCpjWqCOWp7eMpeBwRYWJ8QjlL-LMrEjVa0p3L8FWK9LRh4nLfBMAqidHQ9ac1_oTL5oLSqSwb6ixJo5WnUNu4QsrbsZB74YMEsPGEfLdk5SwV0EdRX82qFDKC0Bk36L68S9GLwzMkEpEFfbwO1mRcHHZ5v8Mj0"/>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-black font-extrabold text-lg px-4 py-1 rounded-full shadow-lg z-20 flex items-center gap-1 border-2 border-white dark:border-background-dark">
                                <span>#1</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-extrabold dark:text-white">Maria G.</h3>
                        <div className="flex items-center gap-1 mt-1 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-semibold text-slate-500 border border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined text-sm">verified</span> Elite
                        </div>
                        <p className="text-lg text-black dark:text-white font-bold mt-2">500 kg CO2</p>
                        <div className="w-full h-44 bg-gradient-to-t from-primary/20 to-white dark:from-primary/10 dark:to-transparent mt-4 rounded-t-2xl mx-4 border-t border-x border-primary/20 relative overflow-hidden">
                            <div className="absolute bottom-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlZWZmMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-20"></div>
                        </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="order-3 md:order-3 flex flex-col items-center">
                        <div className="relative mb-4 group cursor-pointer">
                            <div className="w-24 h-24 rounded-full border-4 border-[#CD7F32]/50 p-1 bg-white dark:bg-[#1a1a2e] relative z-10 overflow-hidden">
                                <img alt="User 3" className="w-full h-full rounded-full object-cover grayscale-[0.2]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5iNyWXl13Cn3wePlCJ-EMU831qkJcC5_J4xcft3qTruvlbOtdGxS_yWGbrl5A3dLfY6mkVv8l7o3UcxzvHOugy512xzNjGj_G2BoFCBBl6ewItxFyJAC6RYoBujpV-6TqtJgpisGIwIMYqWqBaC4Ruhz_9qD-dkiXjUaUHAo8DbKELsCOH0E99YiYh2MULj2l6D4yQlU-5d4S42rz9r6aI7KD1IWbmb4f9lGdwYfphbT0EsY53piA9shazprPElXzTPGGTbo5ow"/>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#CD7F32]/20 border border-[#CD7F32] text-[#b06d2b] dark:text-[#e09e5a] font-bold text-sm px-3 py-0.5 rounded-full shadow-sm z-20 flex items-center gap-1">
                                <span>#3</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold dark:text-white">Juan R.</h3>
                        <p className="text-green-600 font-bold">+8%</p>
                        <p className="text-sm text-slate-500 font-medium">350 kg CO2</p>
                        <div className="w-full h-24 bg-gradient-to-t from-gray-100 to-white dark:from-gray-800 dark:to-transparent mt-4 rounded-t-xl mx-4 border-t border-x border-gray-100 dark:border-gray-700/50"></div>
                    </div>
                </div>

                {/* Leaderboard List */}
                <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-5 bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <div className="col-span-1 text-center">Rango</div>
                        <div className="col-span-5 md:col-span-4 pl-2">Inversor</div>
                        <div className="hidden md:flex col-span-2 items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                            <span>Tendencia</span>
                            <span className="material-symbols-outlined text-sm">unfold_more</span>
                        </div>
                        <div className="col-span-3 md:col-span-3 text-right">Impacto CO2</div>
                        <div className="col-span-3 md:col-span-2 text-right pr-4">Puntos</div>
                    </div>
                    
                    {/* List Items */}
                    {[
                        { rank: 4, name: 'Elena T.', loc: 'Madrid, ES', trend: 'up', val1: '310 kg', val2: '950 pts', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUZfAvPAe06KtbCOtVK8oaFDwFcQYbD7q2v-i-xb0cr8lo8XqG9bSM10_ouJBVPGmXnkVexCYK_Maxk7RWcpzV6zgYChuuF-9OfH4teWMVqFNHWwtQnSavPWTJAtrqcUnoBqWf_WsopyRfqU8vDv0Jurv1SNRz5-of5gZxBQDUPtGP6DpCRyLlHdnUYmjk3a2StZz3jsqCiFIh-mCbwXPXQHCrg3gV6XopmHIGMjV_21WpGkdJEynS9qZZytPuLYxdumdiqWhrYJc' },
                        { rank: 5, name: 'David B.', loc: 'Barcelona, ES', trend: 'flat', val1: '295 kg', val2: '820 pts', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQKvscVXIPZno1uJqgMVJNKuxRkjbxvqPAKmOedx4NALnwkWX8DpW93Tq7jkTg_pkkqdbeU5-OQvZIGi_8VZU26S5wynhRSnbsS33Nla1BfQEMKfNTUxh2Re_YT_joKDTWvW6RdKcSPYoO-WbEkENTex-xXgjlCLQdKzXgCtvXIuPw8GU5Q4Iq1_JLXXq7qbYmEC66bxlYHm0mBUFJOgt78d87pY5EZTUVZ3UBt0QERcr7GKxOGBnN-Qw39y8rnq8W5KdMSnQ7Cvk' },
                        { rank: 6, name: 'Lucia M.', loc: 'Valencia, ES', trend: 'down', val1: '280 kg', val2: '780 pts', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3yA98FZIlN82WDQNg_JyW-FCIamGuki0xbAXSsix6aHbo_ojBUkb1RxAqX0x0IOUBS9PmNciS9fBttDWrqcDd5YmVQamr4yWRGu6THa0yKQrniH_lwyGiyAZzib843MFWGujl9FljUPkOjzE3uZcLLVdjKYA2T4B7e1NEtHUxrE7Lj_7Db1pSKkvfJmqVAAfawnToRn0vUOJ0s1OwqcK2lPuxvmzvQOwZR4oAGwNd6lksHLc-sgpUeXprIbvm7-4MVFUpdgSrOI4' },
                        { rank: 7, name: 'Miguel A.', loc: 'Sevilla, ES', trend: 'up', val1: '245 kg', val2: '710 pts', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbykz8UpTZ7VQow9BDHQ-SXoTQtnxOE4xBlAyANgokB2-TjKiutPyFUWoAYQPC7QAp_ZtFn49tEdWYt3CV62_S1qyu6-0-wSPoioJ_bXDj-w656TsHdq-U0FrCBgCUC8hwjw4OyFmVTEIOP1lGfuYvzSbLZeyoiH3MkQfnQDfLHUEgkDUCAjYqyzuVPTpxbGJfsTeBz40igjFbNy0lkEaRGaIGghkWNxDbwKZr2VBjK43a0qvhAk9ZV6_DK_DF_c_g_ZvNJrT1NRQ' },
                    ].map((item) => (
                        <div key={item.rank} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800">
                            <div className="col-span-1 text-center font-bold text-slate-600 dark:text-slate-400">{item.rank}</div>
                            <div className="col-span-5 md:col-span-4 flex items-center gap-3 pl-2">
                                <img alt="Avatar" className="w-10 h-10 rounded-full object-cover" src={item.img}/>
                                <div>
                                    <p className="font-bold text-sm text-text-main dark:text-white">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.loc}</p>
                                </div>
                            </div>
                            <div className="hidden md:flex col-span-2 items-center gap-2">
                                {item.trend === 'up' && (
                                    <>
                                        <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                                        <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">Subiendo</span>
                                    </>
                                )}
                                {item.trend === 'down' && (
                                    <>
                                        <span className="material-symbols-outlined text-red-400 text-sm">trending_down</span>
                                        <span className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">Bajando</span>
                                    </>
                                )}
                                {item.trend === 'flat' && (
                                    <>
                                        <span className="material-symbols-outlined text-gray-400 text-sm">remove</span>
                                        <span className="text-xs font-medium text-slate-500">Estable</span>
                                    </>
                                )}
                            </div>
                            <div className="col-span-3 md:col-span-3 text-right font-mono text-sm font-medium dark:text-gray-200">{item.val1}</div>
                            <div className="col-span-3 md:col-span-2 text-right pr-4 text-primary font-bold text-sm">{item.val2}</div>
                        </div>
                    ))}
                </div>

                {/* Motivation Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-[#1a1a2e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                        <div className="p-3 bg-primary/20 rounded-xl text-black">
                            <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1 text-text-main dark:text-white">Consejo Wattismoney</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Invierte en proyectos solares este mes para obtener un multiplicador de impacto x1.5.</p>
                        </div>
                    </div>
                    <div className="bg-black dark:bg-white/5 text-white p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="font-bold text-lg mb-1">Invita a un amigo</h4>
                            <p className="text-sm text-gray-300 mb-3">Gana 50 puntos extra de impacto.</p>
                            <button className="text-xs font-bold uppercase tracking-wider bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">Invitar ahora</button>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/20 to-transparent"></div>
                        <span className="material-symbols-outlined text-[80px] absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-500">group_add</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Sticky User Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a2e] border-t border-gray-200 dark:border-gray-700 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] p-4 z-40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex flex-col items-center justify-center bg-black dark:bg-gray-100 text-primary dark:text-black w-12 h-12 rounded-lg font-bold text-xl shadow-lg">
                        42
                        <span className="text-[10px] font-normal leading-none uppercase">Rango</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img alt="Tu Avatar" className="w-12 h-12 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF66iHeIacCwIloJiUgLqU9Jlo-NF78vb6VduxCn0CcY-RCHiWGhSEjkf6vl6esfIFQ6POZmzUEa1Db8XrFiFdJQneAQgpeKrvO2C1NdF1MXFei5YcH3UAhqsWRSkpIkZ6QcEIFz7Giw_Di93YBEYEefIQ9i2M7Bfdy9iU3Y_cqRMEe1GJeyaPubFSTsSxxw6UhGG0cER6QAeGaLMZkI1nxXAwMtSRNnM20k34ZqnS3FQUz1mi3C2Og5La1EuJKmmOv-_HpgK_z6Q"/>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base text-text-main dark:text-white">Tu Rendimiento</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Inversor Pro</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 w-full md:w-auto items-center gap-6 md:px-8">
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-500">Impacto Mensual</span>
                            <span className="text-black dark:text-white">120kg / 300kg</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[40%] rounded-full shadow-[0_0_10px_rgba(238,255,0,0.5)]"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Te faltan <span className="text-primary-hover dark:text-primary font-bold">15kg</span> para superar al #41</p>
                    </div>
                </div>
                <button className="w-full md:w-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2">
                    <span>Ver Perfil Completo</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Clasificacion;