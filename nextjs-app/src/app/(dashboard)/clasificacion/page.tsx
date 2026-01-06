'use client';

import React from 'react';

export default function Clasificacion() {
    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark font-display text-text-main">
            <header className="h-20 bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-gray-800 flex items-center px-6 md:px-10">
                <h1 className="text-xl font-bold text-text-main dark:text-white">Clasificación</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-primary mb-4">emoji_events</span>
                        <h2 className="text-3xl font-black text-text-main dark:text-white mb-4">Clasificación de Inversores</h2>
                        <p className="text-slate-500 dark:text-slate-400">Próximamente: Compite con otros inversores y gana recompensas.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
