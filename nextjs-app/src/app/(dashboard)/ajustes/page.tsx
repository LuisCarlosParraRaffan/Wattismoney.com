'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const PROJECT_TYPE_OPTIONS = [
    { key: 'SOLAR', label: 'Energía Solar Fotovoltaica' },
    { key: 'WIND_ONSHORE', label: 'Energía Eólica' },
    { key: 'HYDRO', label: 'Hidroeléctrica' },
    { key: 'BIOMASS', label: 'Biomasa Renovable' },
];

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [monthlyLimit, setMonthlyLimit] = useState(2500);
    const [preferredTypes, setPreferredTypes] = useState<string[]>(['SOLAR', 'WIND_ONSHORE']);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [notifyProducts, setNotifyProducts] = useState(true);
    const [notifyOpportunities, setNotifyOpportunities] = useState(true);
    const [notifyMarket, setNotifyMarket] = useState(false);
    const [preferredCurrency, setPreferredCurrency] = useState('USD ($)');
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch('/api/user/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.monthlyLimit) setMonthlyLimit(Number(data.monthlyLimit));
                    if (Array.isArray(data.preferredProjectTypes) && data.preferredProjectTypes.length > 0) {
                        setPreferredTypes(data.preferredProjectTypes);
                    }
                }
            } catch (err) {
                console.error('Error loading settings:', err);
            }
        };
        loadSettings();
    }, []);

    const toggleProjectType = (typeKey: string) => {
        setPreferredTypes((prev) =>
            prev.includes(typeKey) ? prev.filter((t) => t !== typeKey) : [...prev, typeKey]
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setFeedback(null);

        try {
            const res = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                    monthlyLimit,
                    preferredProjectTypes: preferredTypes,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al guardar ajustes');

            setCurrentPassword('');
            setNewPassword('');
            setFeedback({ type: 'success', text: data.message });
        } catch (err) {
            setFeedback({
                type: 'error',
                text: err instanceof Error ? err.message : 'Error al guardar cambios',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-gray-50 font-display text-text-main">
            <div className="flex-1 overflow-y-auto relative">
                <form onSubmit={handleSave} className="max-w-5xl mx-auto px-6 py-8 md:px-12 md:py-10">
                    {/* Page Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">
                                Ajustes de la Cuenta
                            </h1>
                            <p className="text-slate-500 text-sm md:text-base">
                                Gestiona tu seguridad, límites mensuales y preferencias de inversión energética.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/cartera"
                                className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs md:text-sm font-bold text-slate-700 hover:bg-gray-50 transition shadow-2xs flex items-center gap-1.5"
                            >
                                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                                Configurar Banco / Wallet
                            </Link>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-5 py-2.5 rounded-xl bg-primary text-black text-xs md:text-sm font-black hover:brightness-95 transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>

                    {feedback && (
                        <div
                            className={`mb-6 p-4 rounded-xl border flex items-center justify-between ${
                                feedback.type === 'success'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                    : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                        >
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <span className="material-symbols-outlined">
                                    {feedback.type === 'success' ? 'check_circle' : 'error'}
                                </span>
                                <span>{feedback.text}</span>
                            </div>
                            <button type="button" onClick={() => setFeedback(null)}>
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                        {/* Left Column - Main Settings */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Section: Seguridad */}
                            <section className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                            <span className="material-symbols-outlined">security</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-text-main">Seguridad de la Cuenta</h2>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Contraseña Actual
                                            </label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-text-main focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Nueva Contraseña
                                            </label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Mínimo 6 caracteres"
                                                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-text-main focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900">
                                                Autenticación de Dos Factores (2FA)
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Protección adicional para retiros bancarios y transferencias Web3.
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={twoFactorEnabled}
                                                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Preferencias de Inversión */}
                            <section className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
                                            <span className="material-symbols-outlined">savings</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-text-main">
                                            Preferencias de Inversión PPA
                                        </h2>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Meta / Límite de Inversión Mensual
                                            </label>
                                            <span className="text-base font-black text-slate-900">
                                                ${monthlyLimit.toLocaleString()} USD
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={100}
                                            max={25000}
                                            step={100}
                                            value={monthlyLimit}
                                            onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-black"
                                        />
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>$100 USD</span>
                                            <span>$25,000 USD</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700 block">
                                            Tecnologías Renovables de Interés
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {PROJECT_TYPE_OPTIONS.map((opt) => {
                                                const checked = preferredTypes.includes(opt.key);
                                                return (
                                                    <label
                                                        key={opt.key}
                                                        className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-colors ${
                                                            checked
                                                                ? 'border-black bg-primary/20 font-bold'
                                                                : 'border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => toggleProjectType(opt.key)}
                                                            className="w-4 h-4 accent-black rounded"
                                                        />
                                                        <span className="ml-2.5 text-sm text-slate-900">
                                                            {opt.label}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Secondary Settings */}
                        <div className="space-y-8">
                            <section className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                                    <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                        <span className="material-symbols-outlined">notifications</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-text-main">Notificaciones</h2>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">
                                            Pago de Dividendos PPA
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={notifyProducts}
                                            onChange={(e) => setNotifyProducts(e.target.checked)}
                                            className="w-4 h-4 accent-black"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">
                                            Nuevos Contratos Energéticos
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={notifyOpportunities}
                                            onChange={(e) => setNotifyOpportunities(e.target.checked)}
                                            className="w-4 h-4 accent-black"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">
                                            Ofertas en Mercado Secundario
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={notifyMarket}
                                            onChange={(e) => setNotifyMarket(e.target.checked)}
                                            className="w-4 h-4 accent-black"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                                    <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                        <span className="material-symbols-outlined">currency_exchange</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-text-main">Moneda Base</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">
                                            Moneda de Visualización
                                        </label>
                                        <select
                                            value={preferredCurrency}
                                            onChange={(e) => setPreferredCurrency(e.target.value)}
                                            className="block w-full h-11 px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-bold text-slate-900"
                                        >
                                            <option>USD ($) — Dólar Americano</option>
                                            <option>USDC — USD Coin (Web3)</option>
                                            <option>COP ($) — Peso Colombiano</option>
                                            <option>EUR (€) — Euro</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
