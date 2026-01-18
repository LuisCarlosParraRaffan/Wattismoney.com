'use client';

import React from 'react';

export default function AdminKycPage() {
    return (
        <>
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-black">Gestión de KYC</h1>
                    <p className="text-sm text-slate-500">Revisa y aprueba documentos de verificación</p>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-primary mb-4">construction</span>
                        <h2 className="text-lg font-bold text-gray-700 mb-2">Página en Construcción</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Esta página está pendiente de integrar el diseño HTML proporcionado por el administrador.
                        </p>
                        <p className="text-xs text-gray-400">
                            La API /api/admin/kyc ya está disponible y funcional.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
