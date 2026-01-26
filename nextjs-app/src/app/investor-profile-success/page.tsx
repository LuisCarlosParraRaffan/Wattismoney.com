'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page now redirects to the AI-powered quiz results
export default function InvestorProfileSuccessRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/investor-quiz-results');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Redirigiendo a resultados...</p>
            </div>
        </div>
    );
}
