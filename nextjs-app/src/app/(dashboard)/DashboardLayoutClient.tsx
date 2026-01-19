'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { WattismoneyLogo } from '@/components/Icons';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    // Standard hooks
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();

    // Onboarding check
    const { isLoading, hasKyc, hasInvestorProfile } = useOnboardingCheck();

    // UI States
    const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    // CRITICAL FIX: Mounted state to prevent Hydration Mismatch (Error #310)
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper logic
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    const isAdminRoute = pathname?.startsWith('/admin') || false;

    // Auto-expand menu if current path is within opportunities
    useEffect(() => {
        if (pathname?.includes('mercado-primario') || pathname?.includes('mercado-secundario')) {
            setIsOpportunitiesOpen(true);
        }
    }, [pathname]);

    // 1. First protection: Don't render anything until mounted on client
    if (!mounted) {
        return null;
        // Or a simple white screen, but null is safer for hydration
    }

    // 2. Loading protection from onboarding check
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </div>
        );
    }

    // 3. Onboarding restriction (Admin bypass logic is inside the hook)
    if (!hasKyc || !hasInvestorProfile) {
        return null; // The hook will trigger the redirect
    }

    // Helper functions for classes
    const isActive = (path: string) => {
        return pathname === path ? 'bg-primary text-black shadow-sm font-bold' : 'text-slate-500 hover:bg-gray-50 hover:text-black font-medium';
    };

    const getIconClass = (path: string) => {
        return pathname === path ? 'icon-filled text-black' : 'group-hover:text-black transition-colors';
    };

    const isOpportunitiesActive = pathname?.includes('mercado') || false;

    return (
        <div className="bg-slate-50 text-slate-900 font-display h-screen flex overflow-hidden">
            {/* Sidebar - Hidden on mobile, fixed on desktop */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-20 hidden md:flex shrink-0">
                <div className="flex flex-col h-full">
                    {/* Sidebar Header / Logo */}
                    <div className="h-20 flex items-center px-6 border-b border-gray-100">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <WattismoneyLogo className="h-10 w-auto transition-transform group-hover:scale-105" />
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/dashboard')}`}>
                            <span className={`material-symbols-outlined text-[22px] ${getIconClass('/dashboard')}`}>dashboard</span>
                            <span className="text-sm">Dashboard</span>
                        </Link>

                        {/* Oportunidades Dropdown */}
                        <div>
                            <button
                                onClick={() => setIsOpportunitiesOpen(!isOpportunitiesOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${isOpportunitiesActive ? 'bg-gray-50 text-black' : 'text-slate-500 hover:bg-gray-50 hover:text-black'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined text-[22px] ${isOpportunitiesActive ? 'icon-filled text-black' : 'group-hover:text-black'}`}>storefront</span>
                                    <span className={`text-sm ${isOpportunitiesActive ? 'font-bold' : 'font-medium'}`}>Oportunidades</span>
                                </div>
                                <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isOpportunitiesOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>

                            {/* Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpportunitiesOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-10 pr-2 flex flex-col gap-1">
                                    <Link href="/mercado-primario" className={`block px-3 py-2 rounded-lg text-xs transition-colors ${pathname === '/mercado-primario' ? 'text-black font-bold bg-primary/20' : 'text-slate-500 hover:text-black hover:bg-gray-50'}`}>
                                        Mercado Principal
                                    </Link>
                                    <Link href="/mercado-secundario" className={`block px-3 py-2 rounded-lg text-xs transition-colors ${pathname === '/mercado-secundario' ? 'text-black font-bold bg-primary/20' : 'text-slate-500 hover:text-black hover:bg-gray-50'}`}>
                                        Mercado Secundario
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/cartera" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/cartera')}`}>
                            <span className={`material-symbols-outlined text-[22px] ${getIconClass('/cartera')}`}>account_balance_wallet</span>
                            <span className="text-sm">Cartera</span>
                        </Link>

                        <Link href="/mi-impacto" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/mi-impacto')}`}>
                            <span className={`material-symbols-outlined text-[22px] ${getIconClass('/mi-impacto')}`}>eco</span>
                            <span className="text-sm">Impacto</span>
                        </Link>

                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Sistema</span>
                        </div>

                        <Link href="/perfil" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/perfil')}`}>
                            <span className={`material-symbols-outlined text-[22px] ${getIconClass('/perfil')}`}>person</span>
                            <span className="text-sm">Mi Perfil</span>
                        </Link>

                        <Link href="/ajustes" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/ajustes')}`}>
                            <span className={`material-symbols-outlined text-[22px] ${getIconClass('/ajustes')}`}>settings</span>
                            <span className="text-sm">Ajustes</span>
                        </Link>

                        <Link href="/clasificacion" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/clasificacion')}`}>
                            <span className={`material-symbols-outlined text-[22px] ${getIconClass('/clasificacion')}`}>emoji_events</span>
                            <span className="text-sm">Clasificación</span>
                        </Link>

                        <Link href="/ayuda" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive('/ayuda')}`}>
                            <span className={`material-symbols-outlined text-[22px] ${getIconClass('/ayuda')}`}>help</span>
                            <span className="text-sm">Ayuda</span>
                        </Link>

                        {/* Admin Section - Only visible for ADMIN/SUPER_ADMIN */}
                        {isAdmin && (
                            <>
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <span className="px-3 text-xs font-bold text-primary uppercase tracking-wider">Administración</span>
                                </div>

                                <button
                                    onClick={() => setIsAdminOpen(!isAdminOpen)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${isAdminRoute ? 'bg-primary/10 text-black' : 'text-slate-500 hover:bg-gray-50 hover:text-black'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-[22px] ${isAdminRoute ? 'text-primary' : 'group-hover:text-black'}`}>admin_panel_settings</span>
                                        <span className={`text-sm ${isAdminRoute ? 'font-bold' : 'font-medium'}`}>Panel Admin</span>
                                    </div>
                                    <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isAdminOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAdminOpen || isAdminRoute ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                    <div className="pl-10 pr-2 flex flex-col gap-1">
                                        <Link href="/admin" className={`block px-3 py-2 rounded-lg text-xs transition-colors ${pathname === '/admin' ? 'text-black font-bold bg-primary/20' : 'text-slate-500 hover:text-black hover:bg-gray-50'}`}>
                                            Dashboard
                                        </Link>
                                        <Link href="/admin/contracts" className={`block px-3 py-2 rounded-lg text-xs transition-colors ${pathname?.includes('/admin/contracts') ? 'text-black font-bold bg-primary/20' : 'text-slate-500 hover:text-black hover:bg-gray-50'}`}>
                                            Contratos
                                        </Link>
                                        <Link href="/admin/users" className={`block px-3 py-2 rounded-lg text-xs transition-colors ${pathname?.includes('/admin/users') ? 'text-black font-bold bg-primary/20' : 'text-slate-500 hover:text-black hover:bg-gray-50'}`}>
                                            Usuarios
                                        </Link>
                                        <Link href="/admin/kyc" className={`block px-3 py-2 rounded-lg text-xs transition-colors ${pathname?.includes('/admin/kyc') ? 'text-black font-bold bg-primary/20' : 'text-slate-500 hover:text-black hover:bg-gray-50'}`}>
                                            Gestión KYC
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-gray-200">
                        <Link href="/perfil" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                            {session?.user?.image ? (
                                <div className="w-9 h-9 rounded-full bg-cover bg-center border border-gray-200 shrink-0" style={{ backgroundImage: `url("${session.user.image}")` }}>
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold border border-gray-200 shrink-0">
                                    {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold text-slate-800 truncate">
                                    {session?.user?.name || 'Usuario'}
                                </span>
                                <span className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-wider">
                                    {isAdmin ? 'Administrador' : 'Inversionista'}
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
