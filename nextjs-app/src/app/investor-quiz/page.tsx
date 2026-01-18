'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WattismoneyLogo } from '@/components/Icons';

interface QuizQuestion {
    id: number;
    question: string;
    options: {
        id: string;
        text: string;
        profile_weight: {
            visionario: number;
            acelerador: number;
            estabilizador: number;
        };
    }[];
}

interface Answer {
    questionId: number;
    optionId: string;
}

export default function InvestorQuiz() {
    const router = useRouter();
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fadeIn, setFadeIn] = useState(true);
    const [kycVerified, setKycVerified] = useState(false);

    useEffect(() => {
        verifyKycAndFetchQuestions();
    }, []);

    const verifyKycAndFetchQuestions = async () => {
        try {
            // First, verify onboarding status
            const statusResponse = await fetch('/api/user/onboarding-status');

            if (statusResponse.status === 401) {
                // Not authenticated - redirect to login
                router.push('/login?callbackUrl=/investor-quiz');
                return;
            }

            const statusData = await statusResponse.json();

            // Check if already has investor profile
            if (statusData.hasInvestorProfile) {
                // Already completed quiz - redirect to dashboard
                router.push('/dashboard');
                return;
            }

            // Check if KYC is submitted (SUBMITTED, APPROVED, or IN_REVIEW counts)
            if (!statusData.hasKyc) {
                // No KYC submitted - redirect to KYC upload
                router.push('/kyc-upload');
                return;
            }

            setKycVerified(true);

            // Now fetch questions
            const response = await fetch('/api/quiz/questions');
            const data = await response.json();

            if (response.status === 401) {
                router.push('/login?callbackUrl=/investor-quiz');
                return;
            }

            setQuestions(data.questions);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = async (optionId: string) => {
        setFadeIn(false);

        const newAnswer: Answer = {
            questionId: questions[currentStep].id,
            optionId
        };

        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);

        // Wait for fade out animation
        await new Promise(resolve => setTimeout(resolve, 200));

        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
            setFadeIn(true);
        } else {
            // Submit answers
            setIsSubmitting(true);
            try {
                const response = await fetch('/api/quiz/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answers: updatedAnswers })
                });

                const data = await response.json();

                if (data.success) {
                    // Store result in sessionStorage for the results page
                    sessionStorage.setItem('quizResult', JSON.stringify(data.result));
                    router.push('/investor-quiz-results');
                }
            } catch (error) {
                console.error('Error submitting quiz:', error);
                setIsSubmitting(false);
            }
        }
    };

    const goBack = () => {
        if (currentStep > 0) {
            setFadeIn(false);
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                setAnswers(answers.slice(0, -1));
                setFadeIn(true);
            }, 200);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Preparando tu evaluación personalizada...</p>
                </div>
            </div>
        );
    }

    if (isSubmitting) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <span className="material-symbols-outlined text-5xl text-primary">psychology</span>
                    </div>
                    <h2 className="text-2xl font-bold text-black mb-2">Analizando tus respuestas...</h2>
                    <p className="text-gray-600">Nuestra IA está determinando tu perfil de inversor</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm px-6 py-4 lg:px-20 sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-3 group">
                    <WattismoneyLogo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="material-symbols-outlined text-lg text-primary">psychology</span>
                        <span className="font-medium">Perfil de Inversor</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-2xl">
                    {/* Progress Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-500">
                                Pregunta {currentStep + 1} de {questions.length}
                            </span>
                            <span className="text-sm font-bold text-primary">
                                {Math.round(progress)}% completado
                            </span>
                        </div>
                        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-yellow-400 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div
                        className={`bg-white rounded-3xl border border-gray-100 p-8 shadow-xl transition-all duration-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        {/* Question Header */}
                        <div className="flex items-start gap-4 mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                                <span className="text-2xl font-black text-black">{currentStep + 1}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-primary uppercase font-bold tracking-wider mb-1">
                                    Evaluación de Perfil
                                </p>
                                <h2 className="text-2xl font-bold text-black leading-snug">
                                    {currentQuestion?.question}
                                </h2>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion?.options.map((option, idx) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswer(option.id)}
                                    className="w-full text-left p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-4 group active:scale-[0.98]"
                                >
                                    <span className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-500 font-bold group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="flex-1 font-medium text-gray-700 group-hover:text-black transition-colors">
                                        {option.text}
                                    </span>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                                        arrow_forward
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-6 flex justify-between items-center">
                        {currentStep > 0 ? (
                            <button
                                onClick={goBack}
                                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Pregunta anterior
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <Link
                            href="/dashboard"
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Continuar después
                        </Link>
                    </div>

                    {/* Encouragement Message */}
                    {currentStep >= questions.length / 2 && (
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
                                ¡Vas muy bien! Solo faltan {questions.length - currentStep - 1} preguntas
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
