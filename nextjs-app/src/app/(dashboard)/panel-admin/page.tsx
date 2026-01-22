'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatsData {
    users: {
        total: number;
        active: number;
        pendingKyc: number;
        recentRegistrations: number;
        byStatus: Array<{ status: string; _count: number }>;
    };
    kyc: {
        pendingReview: number;
    };
    contracts: {
        total: number;
        active: number;
        byType: Array<{ energyType: string; _count: number }>;
    };
    investments: {
        total: number;
        totalAmount: number;
    };
}

interface RecentUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
    kycDocuments: Array<{ status: string }>;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([fetchStats(), fetchRecentUsers()]).finally(() => setIsLoading(false));
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/panel-admin/stats');
            if (!res.ok) throw new Error('Error al cargar estadísticas');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    };

    const fetchRecentUsers = async () => {
        try {
            const res = await fetch('/api/panel-admin/users?limit=5');
            if (!res.ok) throw new Error('Error al cargar usuarios');
            const data = await res.json();
            setRecentUsers(data.users || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const getKycStatusBadge = (user: RecentUser) => {
        const kycStatus = user.kycDocuments?.[0]?.status || 'PENDING';
        const styles: Record<string, string> = {
            APPROVED: 'bg-green-50 text-green-600',
            SUBMITTED: 'bg-yellow-50 text-yellow-600',
            IN_REVIEW: 'bg-blue-50 text-blue-600',
            REJECTED: 'bg-red-50 text-red-600',
            PENDING: 'bg-gray-50 text-gray-500',
        };
        const labels: Record<string, string> = {
            APPROVED: 'Verificado',
            SUBMITTED: 'Pendiente',
            IN_REVIEW: 'En Revisión',
            REJECTED: 'Rechazado',
            PENDING: 'Sin KYC',
        };
        return (
            <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${styles[kycStatus] || 'bg-gray-50'}`}>
                {labels[kycStatus] || kycStatus}
            </span>
        );
    };

    const getInitials = (user: RecentUser) => {
        const first = user.firstName?.[0] || user.email[0];
        const last = user.lastName?.[0] || '';
        return (first + last).toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getEnergyTypePercentage = (type: string) => {
        if (!stats?.contracts.byType) return 0;
        const total = stats.contracts.byType.reduce((sum, t) => sum + t._count, 0);
        const typeData = stats.contracts.byType.find(t => t.energyType === type);
        return total > 0 ? Math.round((typeData?._count || 0) / total * 100) : 0;
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-6 shrink-0">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Resumen de Plataforma</p>
                        <h2 className="text-3xl font-bold text-black">Dashboard Principal</h2>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                            <span className="material-symbols-outlined text-[20px]">file_download</span>
                            Exportar Datos
                        </button>
                        <Link
                            href="/panel-admin/contracts/new"
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black rounded-xl font-bold hover:brightness-95 transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Nuevo Contrato
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* KPIs Row */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Usuarios */}
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                    <span className="material-symbols-outlined">group</span>
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Total Usuarios</p>
                            <h3 className="text-3xl font-bold mt-1">{stats?.users.total.toLocaleString() || '0'}</h3>
                        </div>

                        {/* Usuarios Activos */}
                        <div className="bg-primary p-6 rounded-[24px] shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-black/5 rounded-lg text-black">
                                    <span className="material-symbols-outlined">person_play</span>
                                </div>
                                <span className="text-xs font-bold text-black bg-white/40 px-2 py-1 rounded-full">Activos</span>
                            </div>
                            <p className="text-black/60 text-sm font-medium">Usuarios Activos</p>
                            <h3 className="text-3xl font-bold text-black mt-1">{stats?.users.active.toLocaleString() || '0'}</h3>
                        </div>

                        {/* KYC Pendientes */}
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 rounded-lg text-red-500">
                                    <span className="material-symbols-outlined">pending_actions</span>
                                </div>
                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">Pendiente</span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">KYC Pendientes</p>
                            <h3 className="text-3xl font-bold mt-1">{stats?.kyc.pendingReview || '0'}</h3>
                        </div>

                        {/* Contratos Activos */}
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 rounded-lg text-blue-500">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Contratos Activos</p>
                            <h3 className="text-3xl font-bold mt-1">{stats?.contracts.active || '0'}</h3>
                        </div>
                    </section>

                    {/* Main Grid - Investments & Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Inversiones Totales */}
                        <div className="lg:col-span-1 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="material-symbols-outlined text-primary">analytics</span>
                                    <h4 className="font-bold text-lg">Inversiones Totales</h4>
                                </div>
                                <div className="mb-8">
                                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-tight">Monto Total Invertido</p>
                                    <h2 className="text-4xl font-extrabold tracking-tighter">
                                        ${(Number(stats?.investments.totalAmount) || 0).toLocaleString()}
                                        <span className="text-xl text-primary">.00</span>
                                    </h2>
                                </div>
                                <div className="flex items-center gap-4 py-4 px-6 bg-gray-50 rounded-2xl mb-4">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-black">trending_up</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Número de inversiones</p>
                                        <p className="font-bold text-xl">{stats?.investments.total.toLocaleString() || '0'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    Crecimiento mensual: +8.4%
                                </p>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[65%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Crecimiento de Usuarios Chart */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-10">
                                <h4 className="font-bold text-lg">Crecimiento de Usuarios</h4>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button className="px-4 py-1 text-xs font-bold bg-white shadow-sm rounded-md">Mes</button>
                                    <button className="px-4 py-1 text-xs font-bold text-gray-400">Año</button>
                                </div>
                            </div>
                            <div className="relative h-64 w-full flex items-end justify-between gap-4 px-2">
                                {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'].map((month, i) => {
                                    const heights = [40, 55, 45, 75, 65, 90, 80];
                                    const isHighlighted = i === 5; // Jun
                                    return (
                                        <div key={month} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-300 ${isHighlighted ? 'bg-primary' : 'bg-gray-100 hover:bg-primary'}`}
                                                style={{ height: `${heights[i]}%` }}
                                            ></div>
                                            <span className={`text-[10px] font-bold uppercase ${isHighlighted ? 'text-black' : 'text-gray-400'}`}>{month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid - Energy Types & Quick Access */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contratos por Tipo de Energía */}
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-lg mb-6">Contratos por Tipo de Energía</h4>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-orange-500 text-sm">wb_sunny</span>
                                            Solar
                                        </span>
                                        <span className="text-xs font-bold">{getEnergyTypePercentage('SOLAR')}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                        <div className="bg-orange-500 h-full transition-all" style={{ width: `${getEnergyTypePercentage('SOLAR')}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-blue-400 text-sm">air</span>
                                            Eólica
                                        </span>
                                        <span className="text-xs font-bold">{getEnergyTypePercentage('WIND')}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                        <div className="bg-blue-400 h-full transition-all" style={{ width: `${getEnergyTypePercentage('WIND')}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-green-500 text-sm">water_drop</span>
                                            Hidroeléctrica
                                        </span>
                                        <span className="text-xs font-bold">{getEnergyTypePercentage('HYDRO')}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full transition-all" style={{ width: `${getEnergyTypePercentage('HYDRO')}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Accesos Rápidos */}
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-lg mb-6">Accesos Rápidos</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/panel-admin/contracts/new"
                                    className="flex flex-col items-center justify-center gap-3 p-6 bg-primary/10 border-2 border-primary/20 hover:border-primary rounded-2xl transition-all"
                                >
                                    <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl text-black">
                                        <span className="material-symbols-outlined">add_circle</span>
                                    </div>
                                    <span className="font-bold text-sm text-black">Nuevo Contrato</span>
                                </Link>
                                <Link
                                    href="/panel-admin/kyc"
                                    className="flex flex-col items-center justify-center gap-3 p-6 bg-red-500/5 border-2 border-red-500/10 hover:border-red-500/30 rounded-2xl transition-all"
                                >
                                    <div className="w-12 h-12 bg-red-500 flex items-center justify-center rounded-xl text-white">
                                        <span className="material-symbols-outlined font-bold">fact_check</span>
                                    </div>
                                    <span className="font-bold text-sm text-black">Ver KYC Pendientes</span>
                                </Link>
                                <button className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 border-2 border-transparent hover:border-gray-200 rounded-2xl transition-all">
                                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-xl">
                                        <span className="material-symbols-outlined text-gray-600">mail</span>
                                    </div>
                                    <span className="font-bold text-sm text-black">Enviar Notificación</span>
                                </button>
                                <Link
                                    href="/ajustes"
                                    className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 border-2 border-transparent hover:border-gray-200 rounded-2xl transition-all"
                                >
                                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-xl">
                                        <span className="material-symbols-outlined text-gray-600">settings</span>
                                    </div>
                                    <span className="font-bold text-sm text-black">Configuración</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Users Table */}
                    <section className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h4 className="font-bold text-lg">Últimos Usuarios Registrados</h4>
                            <Link href="/panel-admin/users" className="text-primary text-sm font-bold hover:underline">
                                Ver todos
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <th className="px-8 py-4">Usuario</th>
                                        <th className="px-8 py-4">Email</th>
                                        <th className="px-8 py-4">Estado KYC</th>
                                        <th className="px-8 py-4">Fecha Reg.</th>
                                        <th className="px-8 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 text-black text-[10px] font-bold flex items-center justify-center">
                                                    {getInitials(user)}
                                                </div>
                                                <span className="font-semibold text-sm">
                                                    {user.firstName || user.lastName
                                                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                                        : user.email.split('@')[0]
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-500">{user.email}</td>
                                            <td className="px-8 py-5">{getKycStatusBadge(user)}</td>
                                            <td className="px-8 py-5 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                                            <td className="px-8 py-5 text-right">
                                                <Link
                                                    href={`/panel-admin/users/${user.id}`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg inline-block"
                                                >
                                                    <span className="material-symbols-outlined text-gray-400 text-sm">more_vert</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-10 text-center text-gray-500">
                                                No hay usuarios registrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
