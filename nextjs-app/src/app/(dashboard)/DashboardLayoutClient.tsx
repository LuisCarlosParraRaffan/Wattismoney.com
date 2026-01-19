'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    // Basic session check
    const { data: session, status } = useSession();

    // Mount check to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Iniciando aplicación...</div>;
    }

    // Optional: Show loading state
    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Verificando sesión...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            {/* Minimal Safe Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h1 className="font-bold text-lg">WattisMoney</h1>
                <div className="text-sm text-gray-500">
                    {session?.user?.email || 'No autenticado'}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
