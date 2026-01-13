'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WattismoneyLogo } from '@/components/Icons';

export default function KYCSuccess() {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(true);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Ocultar confetti después de 5 segundos
        const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

        // Countdown and auto-redirect to quiz
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    router.push('/investor-quiz');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearTimeout(confettiTimer);
            clearInterval(countdownInterval);
        };
    }, [router]);

    return (
        <div className="bg-gradient-to-br from-green-50 via-white to-yellow-50 text-text-main font-display antialiased min-h-screen flex flex-col relative overflow-hidden">
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <div className="absolute top-0 left-1/4 animate-fall-1">🎉</div>
                    <div className="absolute top-0 left-1/2 animate-fall-2">✨</div>
                    <div className="absolute top-0 left-3/4 animate-fall-3">🎊</div>
                    <div className="absolute top-0 left-1/3 animate-fall-4">⭐</div>
                    <div className="absolute top-0 left-2/3 animate-fall-5">🌟</div>
                </div>
            )}

            {/* Background Decorations */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>

            <header className="flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm px-6 py-4 lg:px-20 relative z-10">
                <Link href="/" className="flex items-center gap-3 group">
                    <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                </Link>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative z-10">
                <div className="w-full max-w-lg space-y-8 text-center">
                    {/* Success Icon with Animation */}
                    <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 p-4 shadow-lg shadow-green-200 animate-bounce-slow">
                        <span className="material-symbols-outlined text-[72px] text-white">celebration</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black leading-tight tracking-tight text-black sm:text-5xl">
                            ¡Felicidades! 🎉
                        </h1>
                        <p className="text-xl font-semibold text-green-600">
                            Has completado tu verificación de identidad
                        </p>
                        <p className="text-base text-gray-600 sm:text-lg">
                            Tus documentos han sido enviados exitosamente. Nuestro equipo los revisará en las próximas <strong>24-48 horas</strong>.
                        </p>
                    </div>

                    {/* Call to Action - Quiz */}
                    <div className="mt-10 overflow-hidden rounded-3xl border-2 border-primary bg-white shadow-2xl shadow-primary/20 transform hover:scale-[1.02] transition-all duration-300">
                        <div className="bg-gradient-to-r from-primary/10 to-yellow-100 p-8">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <span className="text-4xl">🚀</span>
                                <h2 className="text-2xl font-black text-black">
                                    ¡Siguiente paso!
                                </h2>
                            </div>

                            <p className="text-gray-700 text-lg mb-2">
                                Ahora <strong className="text-black">descubre tu perfil de inversor</strong> en solo 2 minutos.
                            </p>

                            <p className="text-gray-600 text-sm mb-6">
                                Personalizaremos las mejores oportunidades de inversión en energía renovable especialmente para ti.
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => router.push('/investor-quiz')}
                                    className="group relative flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-yellow-400 px-8 text-lg font-black text-black shadow-lg shadow-primary/40 transition-all hover:shadow-xl hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-[24px] transition-transform group-hover:rotate-12">psychology</span>
                                    Descubrir Mi Perfil de Inversor
                                    <span className="material-symbols-outlined text-[24px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </button>

                                <div className="flex items-center justify-center gap-2 text-sm text-primary font-semibold animate-pulse">
                                    <span className="material-symbols-outlined text-lg">timer</span>
                                    <span>Redirigiendo en {countdown} segundos...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Link */}
                    <div className="pt-4">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Prefiero hacer esto después
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-8 flex flex-col items-center gap-3 text-sm text-gray-400">
                        <p className="font-medium">Tu progreso hacia la inversión:</p>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
                                    <span className="material-symbols-outlined text-xl">check</span>
                                </div>
                                <span className="text-xs text-green-600 font-semibold">Email</span>
                            </div>
                            <div className="h-1 w-8 bg-green-400 rounded-full"></div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
                                    <span className="material-symbols-outlined text-xl">check</span>
                                </div>
                                <span className="text-xs text-green-600 font-semibold">KYC</span>
                            </div>
                            <div className="h-1 w-8 bg-primary rounded-full animate-pulse"></div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border-2 border-primary text-primary">
                                    <span className="material-symbols-outlined text-xl">psychology</span>
                                </div>
                                <span className="text-xs text-primary font-semibold">Perfil</span>
                            </div>
                            <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400">
                                    <span className="material-symbols-outlined text-xl">bolt</span>
                                </div>
                                <span className="text-xs text-gray-400">Invertir</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s infinite;
                }
                @keyframes fall-1 {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
                @keyframes fall-2 {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(-360deg); opacity: 0; }
                }
                @keyframes fall-3 {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(180deg); opacity: 0; }
                }
                @keyframes fall-4 {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(-180deg); opacity: 0; }
                }
                @keyframes fall-5 {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(270deg); opacity: 0; }
                }
                .animate-fall-1 { animation: fall-1 3s ease-out forwards; font-size: 2rem; }
                .animate-fall-2 { animation: fall-2 3.5s ease-out forwards; font-size: 1.5rem; animation-delay: 0.2s; }
                .animate-fall-3 { animation: fall-3 2.8s ease-out forwards; font-size: 2rem; animation-delay: 0.4s; }
                .animate-fall-4 { animation: fall-4 3.2s ease-out forwards; font-size: 1.5rem; animation-delay: 0.1s; }
                .animate-fall-5 { animation: fall-5 3s ease-out forwards; font-size: 1.8rem; animation-delay: 0.3s; }
            `}</style>
        </div>
    );
}
