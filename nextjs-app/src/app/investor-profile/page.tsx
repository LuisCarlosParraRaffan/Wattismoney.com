'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WattismoneyLogo } from '@/components/Icons';

export default function InvestorProfileQuiz() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const handleAnswer = (answer: string) => {
        setAnswers({ ...answers, [step]: answer });
        if (step < 4) {
            setStep(step + 1);
        } else {
            router.push('/investor-profile-success');
        }
    };

    const questions = [
        {
            question: "¿Cuál es tu objetivo principal de inversión?",
            options: ["Generar ingresos pasivos", "Crecimiento del capital a largo plazo", "Diversificar mi portafolio", "Impacto ambiental positivo"]
        },
        {
            question: "¿Cuál es tu horizonte temporal de inversión?",
            options: ["Menos de 1 año", "1-3 años", "3-5 años", "Más de 5 años"]
        },
        {
            question: "¿Cómo describirías tu tolerancia al riesgo?",
            options: ["Muy conservador", "Conservador", "Moderado", "Agresivo"]
        },
        {
            question: "¿Cuánto planeas invertir inicialmente?",
            options: ["Menos de €1,000", "€1,000 - €5,000", "€5,000 - €20,000", "Más de €20,000"]
        }
    ];

    const currentQuestion = questions[step - 1];

    return (
        <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col">
            <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 lg:px-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Paso {step} de 4</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-xl">
                    {/* Progress */}
                    <div className="mb-8">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${(step / 4) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-black text-2xl">psychology</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Perfil de Inversor</p>
                                <p className="text-sm text-gray-400">Pregunta {step} de 4</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-6 text-black">{currentQuestion.question}</h2>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    className="w-full text-left p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between group"
                                >
                                    <span className="font-medium">{option}</span>
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">arrow_forward</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="mt-6 text-sm font-medium text-gray-500 hover:text-black flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Pregunta anterior
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
