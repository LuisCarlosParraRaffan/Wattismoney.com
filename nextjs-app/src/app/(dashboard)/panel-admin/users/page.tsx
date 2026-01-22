'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    role: string;
    status: string;
    createdAt: string;
    lastLoginAt: string | null;
    kycDocuments: Array<{ status: string; submittedAt: string }>;
    investorProfile: { aiRiskProfile: string } | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [kycFilter, setKycFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, statusFilter]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: '20',
                search: searchTerm,
            });
            if (statusFilter) params.append('status', statusFilter);

            const res = await fetch(`/api/admin/users?${params}`);
            if (!res.ok) throw new Error('Error al cargar usuarios');
            const data = await res.json();
            setUsers(data.users || []);
            setPagination(data.pagination || pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleSuspend = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        const action = currentStatus === 'SUSPENDED' ? 'reactivar' : 'suspender';

        if (!confirm(`¿Estás seguro de ${action} este usuario?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Error al actualizar usuario');
            fetchUsers();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error');
        }
    };

    const getKycStatusBadge = (user: User) => {
        const kycStatus = user.kycDocuments?.[0]?.status || 'PENDING';
        const config: Record<string, { bg: string; dotColor: string; label: string }> = {
            APPROVED: { bg: 'bg-green-100 text-green-800 border-green-200', dotColor: 'bg-green-500', label: 'Aprobado' },
            SUBMITTED: { bg: 'bg-yellow-100 text-yellow-800 border-yellow-200', dotColor: 'bg-yellow-500 animate-pulse', label: 'En revisión' },
            IN_REVIEW: { bg: 'bg-yellow-100 text-yellow-800 border-yellow-200', dotColor: 'bg-yellow-500 animate-pulse', label: 'En revisión' },
            REJECTED: { bg: 'bg-red-100 text-red-800 border-red-200', dotColor: 'bg-red-500', label: 'Rechazado' },
            PENDING: { bg: 'bg-gray-100 text-gray-800 border-gray-200', dotColor: 'bg-gray-400', label: 'Pendiente' },
        };
        const c = config[kycStatus] || config.PENDING;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} border`}>
                <span className={`w-1.5 h-1.5 ${c.dotColor} rounded-full mr-1.5`}></span>
                {c.label}
            </span>
        );
    };

    const getAccountStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; label: string }> = {
            ACTIVE: { bg: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Activo' },
            SUSPENDED: { bg: 'bg-red-50 text-red-700 border-red-100', label: 'Suspendido' },
            PENDING_KYC: { bg: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Pendiente' },
            PENDING_EMAIL_VERIFICATION: { bg: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Pendiente' },
            KYC_REJECTED: { bg: 'bg-red-50 text-red-700 border-red-100', label: 'KYC Rechazado' },
        };
        const c = config[status] || { bg: 'bg-gray-100 text-gray-800 border-gray-200', label: status };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} border`}>
                {c.label}
            </span>
        );
    };

    const getInvestorProfileBadge = (profile: string | null | undefined) => {
        if (!profile) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    <span className="material-symbols-outlined text-[14px] mr-1">hourglass_empty</span>
                    Sin definir
                </span>
            );
        }
        const config: Record<string, { bg: string; icon: string; label: string }> = {
            Visionario: { bg: 'bg-primary/20 text-yellow-800 border-primary/30', icon: 'rocket_launch', label: 'Visionario' },
            Acelerador: { bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: 'bolt', label: 'Acelerador' },
            Estabilizador: { bg: 'bg-sky-100 text-sky-800 border-sky-200', icon: 'anchor', label: 'Estabilizador' },
        };
        const c = config[profile] || { bg: 'bg-gray-100 text-gray-800 border-gray-200', icon: 'person', label: profile };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} border`}>
                <span className="material-symbols-outlined text-[14px] mr-1">{c.icon}</span>
                {c.label}
            </span>
        );
    };

    const getInitials = (user: User) => {
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

    const formatRelativeTime = (dateString: string | null) => {
        if (!dateString) return 'Nunca';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 5) return 'Hace 5m';
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 30) return `Hace ${diffDays} días`;
        return formatDate(dateString);
    };

    const filteredUsers = users.filter(user => {
        const searchMatch =
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone || '').includes(searchTerm);

        const kycMatch = !kycFilter ||
            (kycFilter === 'approved' && user.kycDocuments?.[0]?.status === 'APPROVED') ||
            (kycFilter === 'pending' && (!user.kycDocuments?.length || user.kycDocuments?.[0]?.status === 'PENDING')) ||
            (kycFilter === 'review' && user.kycDocuments?.[0]?.status === 'SUBMITTED') ||
            (kycFilter === 'rejected' && user.kycDocuments?.[0]?.status === 'REJECTED');

        return searchMatch && kycMatch;
    });

    return (
        <>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-6 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-black">Lista de Usuarios</h1>
                        <p className="text-sm text-gray-500 mt-1">Gestión integral de la base de usuarios registrados.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Exportar
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 justify-between">
                            <div className="relative w-full lg:w-96">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                                    placeholder="Buscar por nombre, email o teléfono..."
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Estado: Todos</option>
                                    <option value="ACTIVE">Activo</option>
                                    <option value="SUSPENDED">Suspendido</option>
                                    <option value="PENDING_KYC">Pendiente</option>
                                </select>
                                <select
                                    value={kycFilter}
                                    onChange={(e) => setKycFilter(e.target.value)}
                                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                                >
                                    <option value="">KYC: Todos</option>
                                    <option value="approved">Aprobado</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="review">En revisión</option>
                                    <option value="rejected">Rechazado</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => { setSearchTerm(''); setStatusFilter(''); setKycFilter(''); }}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Limpiar filtros"
                                >
                                    <span className="material-symbols-outlined">filter_alt_off</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Table */}
                    {!isLoading && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado KYC</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cuenta</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Perfil Inversor</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fechas</th>
                                            <th className="relative px-6 py-4"><span className="sr-only">Acciones</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary/20 rounded-full text-black font-bold text-sm">
                                                            {getInitials(user)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                {user.firstName || user.lastName
                                                                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                                                    : user.email.split('@')[0]
                                                                }
                                                            </div>
                                                            <div className="text-xs text-gray-500">ID: #{user.id.slice(0, 8)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                    <div className="text-xs text-gray-500">{user.phone || 'Sin teléfono'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getKycStatusBadge(user)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getAccountStatusBadge(user.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getInvestorProfileBadge(user.investorProfile?.aiRiskProfile)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-xs text-gray-900">
                                                        <span className="font-medium text-gray-500">Reg:</span> {formatDate(user.createdAt)}
                                                    </div>
                                                    <div className="text-xs text-gray-900 mt-1">
                                                        <span className="font-medium text-gray-500">Login:</span> {formatRelativeTime(user.lastLoginAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/panel-admin/users/${user.id}`}
                                                            className="text-gray-400 hover:text-primary transition-colors"
                                                            title="Ver detalle"
                                                        >
                                                            <span className="material-symbols-outlined">visibility</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleSuspend(user.id, user.status)}
                                                            className={`transition-colors ${user.status === 'SUSPENDED' ? 'text-gray-400 hover:text-green-600' : 'text-gray-400 hover:text-red-500'}`}
                                                            title={user.status === 'SUSPENDED' ? 'Reactivar' : 'Suspender'}
                                                        >
                                                            <span className="material-symbols-outlined">
                                                                {user.status === 'SUSPENDED' ? 'restore' : 'block'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">people</span>
                                                    No hay usuarios que coincidan con los filtros
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                    Mostrando <span className="font-medium text-gray-700">{filteredUsers.length}</span> de <span className="font-medium text-gray-700">{pagination.total}</span> resultados
                                </div>
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                                            disabled={pagination.page === 1}
                                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined">chevron_left</span>
                                        </button>
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setPagination(p => ({ ...p, page }))}
                                                className={`w-8 h-8 flex items-center justify-center rounded-md text-xs ${pagination.page === page
                                                        ? 'bg-primary text-black font-semibold shadow-sm'
                                                        : 'text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        {pagination.totalPages > 5 && <span className="text-gray-400">...</span>}
                                        <button
                                            onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
