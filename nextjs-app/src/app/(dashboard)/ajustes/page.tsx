'use client';

import React from 'react';
import Link from 'next/link';
import { WattismoneyLogo } from '@/components/Icons';

const Settings: React.FC = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-gray-50 font-display text-text-main">
            {/* Mobile Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <WattismoneyLogo className="h-8 w-auto" />
                    </Link>
                </div>
                <button className="p-2 text-slate-500">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            <div className="flex-1 overflow-y-auto relative">
                <div className="max-w-5xl mx-auto px-6 py-8 md:px-12 md:py-10">
                    {/* Page Header */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">Ajustes de la Aplicación</h1>
                            <p className="text-slate-500 text-base">Gestiona tu seguridad, notificaciones y preferencias de inversión en un solo lugar.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition shadow-sm">
                                Cancelar
                            </button>
                            <button className="px-5 py-2.5 rounded-lg bg-primary text-black text-sm font-bold hover:bg-primary-hover transition shadow-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">

                        {/* Left Column - Main Settings */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Section: Seguridad */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                            <span className="material-symbols-outlined">security</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-text-main">Seguridad de la Cuenta</h2>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Password Change */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Contraseña Actual</label>
                                            <input className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-text-main focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="••••••••" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Nueva Contraseña</label>
                                            <input className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-text-main focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="••••••••" type="password" />
                                        </div>
                                    </div>
                                    {/* 2FA Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900">Autenticación de Dos Factores (2FA)</h3>
                                            <p className="text-xs text-slate-500 mt-1">Recomendado para proteger tus inversiones.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input defaultChecked className="sr-only peer" type="checkbox" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    {/* Sessions */}
                                    <div className="pt-2">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3">Sesiones Activas</h3>
                                        <div className="flex items-center justify-between py-3 border-t border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-slate-400">desktop_windows</span>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">MacBook Pro - Madrid, ES</p>
                                                    <p className="text-xs text-green-600 font-medium">Activa ahora</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400">IP: 192.168.1.1</span>
                                        </div>
                                        <button className="mt-2 text-red-600 text-sm font-bold hover:underline flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">block</span>
                                            Cerrar todas las demás sesiones
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Preferencias de Inversión */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
                                            <span className="material-symbols-outlined">savings</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-text-main">Preferencias de Inversión</h2>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Slider */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-semibold text-slate-700">Límite de Inversión Mensual</label>
                                            <span className="text-sm font-bold text-primary">2.500 €</span>
                                        </div>
                                        <input className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" max={10000} min={100} type="range" defaultValue={2500} />
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>100 €</span>
                                            <span>10.000 €</span>
                                        </div>
                                    </div>
                                    {/* Project Types */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700 block">Tipos de Proyecto Preferidos</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-yellow-50 transition-colors">
                                                <input defaultChecked className="w-4 h-4 text-black border-gray-300 rounded focus:ring-primary focus:ring-offset-0 bg-gray-100" type="checkbox" />
                                                <span className="ml-2 text-sm font-medium text-slate-900">Energía Solar</span>
                                            </label>
                                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-yellow-50 transition-colors">
                                                <input defaultChecked className="w-4 h-4 text-black border-gray-300 rounded focus:ring-primary focus:ring-offset-0 bg-gray-100" type="checkbox" />
                                                <span className="ml-2 text-sm font-medium text-slate-900">Energía Eólica</span>
                                            </label>
                                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-yellow-50 transition-colors">
                                                <input className="w-4 h-4 text-black border-gray-300 rounded focus:ring-primary focus:ring-offset-0 bg-gray-100" type="checkbox" />
                                                <span className="ml-2 text-sm font-medium text-slate-900">Hidroeléctrica</span>
                                            </label>
                                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-yellow-50 transition-colors">
                                                <input className="w-4 h-4 text-black border-gray-300 rounded focus:ring-primary focus:ring-offset-0 bg-gray-100" type="checkbox" />
                                                <span className="ml-2 text-sm font-medium text-slate-900">Biomasa</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Secondary Settings */}
                        <div className="space-y-8">
                            {/* Section: Notificaciones */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                            <span className="material-symbols-outlined">notifications</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-text-main">Notificaciones</h2>
                                    </div>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Actualizaciones de Producto</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input defaultChecked className="sr-only peer" type="checkbox" />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Nuevas Oportunidades</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input defaultChecked className="sr-only peer" type="checkbox" />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Noticias del Mercado</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input className="sr-only peer" type="checkbox" />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Idioma y Región */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                            <span className="material-symbols-outlined">language</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-text-main">Idioma y Región</h2>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Idioma</label>
                                        <select className="block w-full h-11 pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-gray-50 text-slate-900">
                                            <option>Español (España)</option>
                                            <option>English (US)</option>
                                            <option>Français</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Moneda</label>
                                        <select className="block w-full h-11 pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-gray-50 text-slate-900">
                                            <option>EUR (€)</option>
                                            <option>USD ($)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
