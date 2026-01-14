'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WattismoneyLogo } from '@/components/Icons';

interface ProfileResult {
    profile: 'VISIONARIO' | 'ACELERADOR' | 'ESTABILIZADOR';
    confidence: number;
    reasons: string[];
    investment_recommendations: string[];
    personalized_message: string;
}

const PROFILE_CONFIG = {
    VISIONARIO: {
        emoji: '🚀',
        name: 'Visionario',
        color: 'from-purple-500 to-indigo-600',
        bgColor: 'from-purple-50 to-indigo-50',
        textColor: 'text-purple-600',
        description: 'Inversor de largo plazo con alta tolerancia al riesgo',
        gradient: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    },
    ACELERADOR: {
        emoji: '🌱',
        name: 'Acelerador',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'from-green-50 to-emerald-50',
        textColor: 'text-green-600',
        description: 'Balance entre crecimiento y estabilidad',
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
    },
    ESTABILIZADOR: {
        emoji: '⚓',
        name: 'Estabilizador',
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'from-blue-50 to-cyan-50',
        textColor: 'text-blue-600',
        description: 'Prioriza seguridad y retornos predecibles',
        gradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    },
};

export default function InvestorQuizResults() {
    const router = useRouter();
    const [result, setResult] = useState<ProfileResult | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const storedResult = sessionStorage.getItem('quizResult');
        if (storedResult) {
            setResult(JSON.parse(storedResult));
            // Start reveal animation
            setTimeout(() => setIsRevealed(true), 500);
            setTimeout(() => setShowDetails(true), 1500);
        } else {
            router.push('/investor-quiz');
        }
    }, [router]);

    if (!result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const config = PROFILE_CONFIG[result.profile];

    return (
        <div className={`min-h-screen bg-gradient-to-br ${config.bgColor} via-white flex flex-col`}>
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm px-6 py-4 lg:px-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl">
                    {/* Profile Reveal */}
                    <div className={`text-center transition-all duration-1000 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                        {/* Icon */}
                        <div className={`mx-auto w-32 h-32 ${config.gradient} rounded-full flex items-center justify-center shadow-2xl mb-6 transition-transform duration-500 ${isRevealed ? 'scale-100' : 'scale-50'}`}>
                            <span className="text-7xl">{config.emoji}</span>
                        </div>

                        {/* Profile Name */}
                        <div className="mb-4">
                            <p className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-2">Tu perfil de inversor</p>
                            <h1 className={`text-5xl font-black ${config.textColor}`}>
                                {config.name}
                            </h1>
                        </div>

                        {/* Confidence */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-6">
                            <span className="material-symbols-outlined text-green-500">verified</span>
                            <span className="text-sm font-medium text-gray-600">
                                {Math.round(result.confidence * 100)}% de coincidencia
                            </span>
                        </div>

                        {/* Personalized Message */}
                        <p className="text-lg text-gray-700 max-w-lg mx-auto leading-relaxed mb-8">
                            {result.personalized_message}
                        </p>
                    </div>

                    {/* Details Section */}
                    <div className={`space-y-6 transition-all duration-700 ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {/* Reasons Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                ¿Por qué este perfil?
                            </h3>
                            <ul className="space-y-3">
                                {result.reasons.map((reason, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className={`material-symbols-outlined ${config.textColor} mt-0.5`}>check_circle</span>
                                        <span className="text-gray-600">{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recommendations Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">bolt</span>
                                Oportunidades recomendadas para ti
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {result.investment_recommendations.map((rec, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-xl bg-gradient-to-br ${config.bgColor} border border-gray-100`}
                                    >
                                        <span className="text-sm font-medium text-gray-700">{rec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                onClick={() => router.push('/mercado-primario')}
                                className={`w-full py-4 ${config.gradient} text-white font-bold rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer`}
                            >
                                <span className="material-symbols-outlined">bolt</span>
                                Explorar Oportunidades Personalizadas
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span className="material-symbols-outlined">dashboard</span>
                                Ir al Dashboard
                            </button>
                        </div>

                        {/* Share Section */}
                        <div className="text-center pt-4">
                            <p className="text-sm text-gray-400 mb-3">Comparte tu resultado</p>
                            <div className="flex justify-center gap-3">
                                <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-gray-600">share</span>
                                </button>
                                <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-gray-600">download</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
