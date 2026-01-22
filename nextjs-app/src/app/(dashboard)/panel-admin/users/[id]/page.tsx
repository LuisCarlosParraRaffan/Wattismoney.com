'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface UserDetail {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    dateOfBirth: string | null;
    nationality: string | null;
    role: string;
    status: string;
    createdAt: string;
    lastLoginAt: string | null;
    investorProfile: {
        id: string;
        aiRiskProfile: string | null;
        riskTolerance: number | null;
    } | null;
    kycDocuments: Array<{
        id: string;
        documentType: string;
        documentNumber: string | null;
        frontImageUrl: string | null;
        backImageUrl: string | null;
        selfieUrl: string | null;
        addressProofUrl: string | null;
        status: string;
        submittedAt: string;
        reviewedAt: string | null;
        rejectionReason: string | null;
    }>;
    investments: Array<{
        id: string;
        amount: number;
        status: string;
        createdAt: string;
        contract: {
            id: string;
            name: string;
        };
    }>;
    _count?: {
        investments: number;
    };
}

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [user, setUser] = useState<UserDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Editable fields
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`);
            if (!res.ok) throw new Error('Error al cargar usuario');
            const data = await res.json();
            setUser(data.user);
            setSelectedStatus(data.user.status);
            setSelectedRole(data.user.role);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (updates: Record<string, string>) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error('Error al actualizar usuario');
            await fetchUser();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleKycAction = async (action: 'approve' | 'reject', reason?: string) => {
        if (!user?.kycDocuments?.[0]) return;

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/kyc', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documentId: user.kycDocuments[0].id,
                    action,
                    reason,
                }),
            });
            if (!res.ok) throw new Error('Error al procesar KYC');
            await fetchUser();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error');
        } finally {
            setIsSaving(false);
        }
    };

    const getInitials = () => {
        if (!user) return '';
        const first = user.firstName?.[0] || user.email[0];
        const last = user.lastName?.[0] || '';
        return (first + last).toUpperCase();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
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

        if (diffMins < 60) return `Hoy, hace ${diffMins}m`;
        if (diffHours < 24) return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        return formatDate(dateString);
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; label: string }> = {
            ACTIVE: { bg: 'bg-green-100 text-green-800', label: 'Activo' },
            SUSPENDED: { bg: 'bg-red-100 text-red-800', label: 'Suspendido' },
            PENDING_KYC: { bg: 'bg-yellow-100 text-yellow-800', label: 'Pendiente KYC' },
            PENDING_EMAIL_VERIFICATION: { bg: 'bg-gray-100 text-gray-800', label: 'Pendiente Email' },
            KYC_REJECTED: { bg: 'bg-red-100 text-red-800', label: 'KYC Rechazado' },
        };
        const c = config[status] || { bg: 'bg-gray-100 text-gray-800', label: status };
        return <span className={`px-2 py-1 rounded text-xs font-bold ${c.bg}`}>{c.label}</span>;
    };

    const getKycStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; label: string }> = {
            APPROVED: { bg: 'bg-green-100 text-green-800', label: 'Aprobado' },
            SUBMITTED: { bg: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
            IN_REVIEW: { bg: 'bg-blue-100 text-blue-800', label: 'En Revisión' },
            REJECTED: { bg: 'bg-red-100 text-red-800', label: 'Rechazado' },
            PENDING: { bg: 'bg-gray-100 text-gray-600', label: 'Sin Enviar' },
        };
        const c = config[status] || { bg: 'bg-gray-100 text-gray-800', label: status };
        return <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${c.bg}`}>{c.label}</span>;
    };

    const getProfileBadge = (profile: string | null) => {
        if (!profile) return { label: 'Sin definir', color: 'text-gray-600', icon: 'hourglass_empty' };
        const config: Record<string, { label: string; color: string; icon: string }> = {
            Visionario: { label: 'Visionario', color: 'text-yellow-700', icon: 'rocket_launch' },
            Acelerador: { label: 'Acelerador', color: 'text-purple-700', icon: 'bolt' },
            Estabilizador: { label: 'Estabilizador', color: 'text-blue-700', icon: 'anchor' },
            Moderado: { label: 'Moderado', color: 'text-purple-700', icon: 'balance' },
        };
        return config[profile] || { label: profile, color: 'text-gray-700', icon: 'person' };
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">error</span>
                    <p className="text-gray-500">{error || 'Usuario no encontrado'}</p>
                    <Link href="/panel-admin/users" className="text-primary font-bold mt-4 inline-block">Volver a usuarios</Link>
                </div>
            </div>
        );
    }

    const kycDoc = user.kycDocuments?.[0];
    const profileInfo = getProfileBadge(user.investorProfile?.aiRiskProfile || null);

    return (
        <>
            {/* Header with breadcrumb */}
            <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-4 shrink-0">
                <div className="flex items-center gap-2 text-sm">
                    <Link href="/panel-admin" className="text-gray-500 hover:text-primary font-medium">Inicio</Link>
                    <span className="text-gray-300">/</span>
                    <Link href="/panel-admin/users" className="text-gray-500 hover:text-primary font-medium">Usuarios</Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-black font-semibold">Detalle de Usuario</span>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* User Header Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-black border-4 border-gray-100 shadow-sm">
                                    {getInitials()}
                                </div>
                                <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-green-500 border-2 border-white" title="Online"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-black">
                                    {user.firstName && user.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : user.email.split('@')[0]
                                    }
                                </h1>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono">
                                        ID: #{user.id.slice(0, 8)}
                                    </span>
                                    {getStatusBadge(user.status)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Left Column - 2/3 width */}
                        <div className="xl:col-span-2 flex flex-col gap-6">

                            {/* Personal Data Section */}
                            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-black flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">person</span>
                                        Datos Personales
                                    </h2>
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">Solo Lectura</span>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                                        <input
                                            type="text"
                                            value={user.firstName || ''}
                                            readOnly
                                            className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-700 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Apellido</label>
                                        <input
                                            type="text"
                                            value={user.lastName || ''}
                                            readOnly
                                            className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-700 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                        <input
                                            type="text"
                                            value={user.email}
                                            readOnly
                                            className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-700 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Teléfono</label>
                                        <input
                                            type="text"
                                            value={user.phone || 'No especificado'}
                                            readOnly
                                            className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-700 text-sm"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Investor Profile Section */}
                            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-yellow-50/30">
                                    <h2 className="text-lg font-bold text-black flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">query_stats</span>
                                        Perfil Inversor
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Perfil</p>
                                                <p className={`text-xl font-bold ${profileInfo.color}`}>{profileInfo.label}</p>
                                            </div>
                                            <span className={`material-symbols-outlined text-4xl ${profileInfo.color} opacity-30`}>
                                                {profileInfo.icon}
                                            </span>
                                        </div>
                                        {user.investorProfile?.riskTolerance && (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between text-sm font-bold text-black">
                                                    <span>Tolerancia al Riesgo</span>
                                                    <span>{user.investorProfile.riskTolerance}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-primary h-2.5 rounded-full"
                                                        style={{ width: `${user.investorProfile.riskTolerance}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Recomendaciones</p>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lightbulb</span>
                                                    Diversificar en energía eólica offshore.
                                                </li>
                                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lightbulb</span>
                                                    Considerar aumentar ticket promedio.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Investments Table */}
                            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-black flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">table_view</span>
                                        Inversiones
                                    </h2>
                                    <span className="text-primary text-xs font-bold uppercase tracking-wider">
                                        {user.investments?.length || 0} total
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="py-3 px-6 text-xs font-bold uppercase text-gray-500 tracking-wider">Contrato</th>
                                                <th className="py-3 px-6 text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Monto</th>
                                                <th className="py-3 px-6 text-xs font-bold uppercase text-gray-500 tracking-wider text-center">Estado</th>
                                                <th className="py-3 px-6 text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {user.investments?.length > 0 ? user.investments.map((inv) => (
                                                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6 text-sm text-black">
                                                        <div className="font-bold">{inv.contract.name}</div>
                                                        <div className="text-xs text-gray-500">ID: #{inv.id.slice(0, 8)}</div>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm font-bold text-black text-right">
                                                        ${Number(inv.amount).toLocaleString()}
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${inv.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {inv.status === 'ACTIVE' ? 'Activo' : 'Finalizado'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-700 text-right">
                                                        {formatDate(inv.createdAt)}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} className="py-8 text-center text-gray-500">
                                                        Sin inversiones registradas
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - 1/3 width */}
                        <div className="flex flex-col gap-6">

                            {/* Quick Actions */}
                            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <h2 className="text-xs font-bold text-gray-500 uppercase mb-3">Acciones Rápidas</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleUpdateUser({ status: user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' })}
                                        disabled={isSaving}
                                        className={`col-span-1 h-9 rounded text-xs font-bold flex items-center justify-center gap-1 transition-colors ${user.status === 'SUSPENDED'
                                                ? 'bg-green-50 border border-green-200 text-green-600 hover:bg-green-100'
                                                : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                                            } disabled:opacity-50`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {user.status === 'SUSPENDED' ? 'check_circle' : 'block'}
                                        </span>
                                        {user.status === 'SUSPENDED' ? 'Reactivar' : 'Suspender'}
                                    </button>
                                    <button
                                        className="col-span-1 h-9 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                                        Rol
                                    </button>
                                    {kycDoc && kycDoc.status !== 'APPROVED' && (
                                        <>
                                            <button
                                                onClick={() => handleKycAction('approve')}
                                                disabled={isSaving}
                                                className="col-span-1 h-9 rounded bg-primary text-black hover:brightness-95 text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">check</span>
                                                Aprobar KYC
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const reason = prompt('Razón del rechazo:');
                                                    if (reason) handleKycAction('reject', reason);
                                                }}
                                                disabled={isSaving}
                                                className="col-span-1 h-9 rounded bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">close</span>
                                                Rechazar KYC
                                            </button>
                                        </>
                                    )}
                                </div>
                            </section>

                            {/* Status & Roles */}
                            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-black flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">manage_accounts</span>
                                        Estado y Roles
                                    </h2>
                                    <button
                                        onClick={() => handleUpdateUser({ status: selectedStatus, role: selectedRole })}
                                        disabled={isSaving}
                                        className="text-primary hover:underline text-xs font-bold disabled:opacity-50"
                                    >
                                        Guardar
                                    </button>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Estado de Cuenta</label>
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                                        >
                                            <option value="ACTIVE">Activo</option>
                                            <option value="SUSPENDED">Suspendido</option>
                                            <option value="PENDING_KYC">Pendiente KYC</option>
                                            <option value="KYC_REJECTED">KYC Rechazado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase block">Rol del Usuario</label>
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">lock</span> Super Admin
                                            </span>
                                        </div>
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                                        >
                                            <option value="USER">Inversor (Usuario)</option>
                                            <option value="ADMIN">Administrador</option>
                                            <option value="SUPER_ADMIN">Super Admin</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Fecha Registro</p>
                                            <p className="text-sm font-medium text-gray-700">{formatDate(user.createdAt)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Último Login</p>
                                            <p className="text-sm font-medium text-gray-700">{formatRelativeTime(user.lastLoginAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* KYC Verification */}
                            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <h2 className="text-lg font-bold text-black flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">verified_user</span>
                                        Verificación KYC
                                    </h2>
                                    {kycDoc ? getKycStatusBadge(kycDoc.status) : getKycStatusBadge('PENDING')}
                                </div>
                                <div className="p-5 flex flex-col gap-5">
                                    {kycDoc ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <p className="text-gray-500 font-bold uppercase">Fecha de Envío</p>
                                                    <p className="text-gray-700 font-medium">{formatDate(kycDoc.submittedAt)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-500 font-bold uppercase">Tipo Documento</p>
                                                    <p className="text-gray-700 font-medium">{kycDoc.documentType}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {kycDoc.frontImageUrl && (
                                                    <div className="flex items-center gap-3 group">
                                                        <a href={kycDoc.frontImageUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-10 bg-gray-200 rounded border border-gray-300 shrink-0 overflow-hidden relative cursor-pointer block">
                                                            <img src={kycDoc.frontImageUrl} alt="Front" className="w-full h-full object-cover" />
                                                        </a>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-700 truncate">DNI / Pasaporte (Frontal)</p>
                                                            <p className="text-xs text-gray-500">Documento frontal</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {kycDoc.backImageUrl && (
                                                    <div className="flex items-center gap-3 group">
                                                        <a href={kycDoc.backImageUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-10 bg-gray-200 rounded border border-gray-300 shrink-0 overflow-hidden relative cursor-pointer block">
                                                            <img src={kycDoc.backImageUrl} alt="Back" className="w-full h-full object-cover" />
                                                        </a>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-700 truncate">DNI / Pasaporte (Trasero)</p>
                                                            <p className="text-xs text-gray-500">Documento trasero</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {kycDoc.addressProofUrl && (
                                                    <div className="flex items-center gap-3 group">
                                                        <div className="w-16 h-10 bg-gray-200 rounded border border-gray-300 shrink-0 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-gray-500">picture_as_pdf</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-700 truncate">Prueba de Residencia</p>
                                                            <p className="text-xs text-gray-500">PDF</p>
                                                        </div>
                                                        <a href={kycDoc.addressProofUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-primary transition-colors">
                                                            <span className="material-symbols-outlined text-[18px]">download</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            {kycDoc.rejectionReason && (
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                    <p className="text-xs font-bold text-red-700 uppercase mb-1">Razón de Rechazo</p>
                                                    <p className="text-sm text-red-600">{kycDoc.rejectionReason}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">El usuario no ha enviado documentos KYC</p>
                                    )}
                                </div>
                            </section>

                            {/* Gamification */}
                            <section className="bg-gray-900 rounded-xl shadow-lg overflow-hidden text-white relative">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="p-5 relative z-10 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-sm font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px]">emoji_events</span>
                                            Gamificación
                                        </h2>
                                        <span className="text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/30 px-2 py-0.5 rounded-full">
                                            Nivel {Math.floor((user._count?.investments || 0) / 2) + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-400">XP Total</span>
                                            <span className="font-bold">{((user._count?.investments || 0) * 500)} pts</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(((user._count?.investments || 0) * 20), 100)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
