'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { WattismoneyLogo } from '@/components/Icons';

interface UserProfile {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatarUrl: string | null;
    bio: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    preferredLanguage: string | null;
    profilePublic: boolean;
    role: string;
    status: string;
    points: number;
    level: number;
    levelName: string | null;
    kycStatus: string;
    kycVerifiedAt: string | null;
    badges: Array<{
        id: string;
        awardedAt: string;
        badge: {
            id: string;
            name: string;
            icon: string;
            color: string;
            description: string | null;
        };
    }>;
    investorProfile: {
        aiRiskProfile: string | null;
    } | null;
    _count: {
        investments: number;
    };
}

interface UserStats {
    totalInvested: number;
    co2Avoided: number;
}

const Profile: React.FC = () => {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        preferredLanguage: 'es',
        bio: '',
    });

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (!res.ok) throw new Error('Error al cargar perfil');
            const data = await res.json();
            setProfile(data);
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                country: data.country || '',
                preferredLanguage: data.preferredLanguage || 'es',
                bio: data.bio || '',
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/user/stats');
            if (res.ok) {
                const data = await res.json();
                setStats({
                    totalInvested: data.totalInvested || 0,
                    co2Avoided: data.co2Avoided || 0,
                });
            }
        } catch {
            // Stats are optional, don't show error
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('Solo se permiten imágenes JPG, PNG o WEBP');
            return;
        }

        // Validate file size (5MB max for avatars)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen no puede superar 5MB');
            return;
        }

        setIsUploadingAvatar(true);
        setError(null);

        try {
            // Upload file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'avatar');

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) {
                const data = await uploadRes.json();
                throw new Error(data.error || 'Error al subir imagen');
            }

            const { url } = await uploadRes.json();

            // Update profile with new avatar URL
            const updateRes = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatarUrl: url }),
            });

            if (!updateRes.ok) throw new Error('Error al actualizar perfil');

            await fetchProfile();
            setSuccessMessage('Foto de perfil actualizada');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al subir imagen');
        } finally {
            setIsUploadingAvatar(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Error al guardar');

            await fetchProfile();
            setIsEditing(false);
            setSuccessMessage('Perfil actualizado correctamente');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar');
        } finally {
            setIsSaving(false);
        }
    };

    const getLevelName = () => {
        if (profile?.levelName) return profile.levelName;
        const level = profile?.level || 1;
        const levelNames: Record<number, string> = {
            1: 'Explorador Verde',
            2: 'Inversor Solar',
            3: 'Guardián Eco',
            4: 'Pionero Renovable',
            5: 'Magnate Solar',
            6: 'Visionario Energético',
        };
        return levelNames[Math.min(level, 6)] || `Nivel ${level}`;
    };

    const getXpProgress = () => {
        const points = profile?.points || 0;
        const currentLevelXp = ((profile?.level || 1) - 1) * 5000;
        const nextLevelXp = (profile?.level || 1) * 5000;
        const progress = ((points - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    };

    const getXpToNextLevel = () => {
        const points = profile?.points || 0;
        const nextLevelXp = (profile?.level || 1) * 5000;
        return Math.max(nextLevelXp - points, 0);
    };

    const getBadgeGradient = (color: string) => {
        const gradients: Record<string, string> = {
            yellow: 'from-yellow-100 to-yellow-300',
            green: 'from-green-100 to-green-300',
            blue: 'from-blue-100 to-blue-300',
            purple: 'from-purple-100 to-purple-300',
        };
        return gradients[color] || 'from-gray-100 to-gray-300';
    };

    const getBadgeTextColor = (color: string) => {
        const colors: Record<string, string> = {
            yellow: 'text-yellow-700',
            green: 'text-green-700',
            blue: 'text-blue-700',
            purple: 'text-purple-700',
        };
        return colors[color] || 'text-gray-700';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">error</span>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background-light font-display text-text-main">
            {/* Mobile Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <WattismoneyLogo className="h-8 w-auto" />
                    </Link>
                </div>
                <button className="p-2 text-slate-500">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50 relative">
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-gray-50/50 -z-0 pointer-events-none"></div>

                <div className="max-w-[1100px] mx-auto p-6 lg:p-12 flex flex-col gap-10 relative z-10 pb-20">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            {successMessage}
                        </div>
                    )}

                    {/* Page Title */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-main tracking-tight">Perfil del Usuario</h1>
                            <p className="text-slate-500 mt-1">Gestiona tu información personal y visualiza tu progreso.</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm text-text-main"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 md:flex-none justify-center items-center gap-2 px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">save</span>
                                        {isSaving ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                    Editar Perfil
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* Profile Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                                <div className="relative mb-4 group">
                                    <div
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-cover bg-center bg-gray-200 flex items-center justify-center relative overflow-hidden"
                                        style={profile?.avatarUrl ? { backgroundImage: `url("${profile.avatarUrl}")` } : {}}
                                    >
                                        {!profile?.avatarUrl && (
                                            <span className="text-4xl font-bold text-gray-400">
                                                {(profile?.firstName?.[0] || profile?.email?.[0] || 'U').toUpperCase()}
                                            </span>
                                        )}
                                        {/* Upload overlay */}
                                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleAvatarUpload}
                                                className="hidden"
                                                disabled={isUploadingAvatar}
                                            />
                                            {isUploadingAvatar ? (
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                            ) : (
                                                <div className="text-white text-center">
                                                    <span className="material-symbols-outlined text-2xl">photo_camera</span>
                                                    <p className="text-xs font-medium mt-1">Cambiar foto</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    {profile?.kycStatus === 'APPROVED' && (
                                        <div className="absolute bottom-0 right-0 bg-primary text-black p-1.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center" title="Cuenta Verificada">
                                            <span className="material-symbols-outlined text-[20px] font-bold">verified</span>
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-text-main">
                                    {profile?.firstName && profile?.lastName
                                        ? `${profile.firstName} ${profile.lastName}`
                                        : profile?.email?.split('@')[0] || 'Usuario'}
                                </h2>
                                <p className="text-slate-500 font-medium mb-4">
                                    {profile?.investorProfile?.aiRiskProfile || 'Inversor'} | Nivel {profile?.level || 1}
                                </p>
                            </div>

                            {/* Status Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-text-main">
                                    <span className="material-symbols-outlined text-green-600">security</span>
                                    Estado de la Cuenta
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${profile?.kycStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} flex items-center justify-center`}>
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {profile?.kycStatus === 'APPROVED' ? 'check' : 'pending'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-text-main">Identidad (KYC)</span>
                                                <span className="text-xs text-slate-500">
                                                    {profile?.kycStatus === 'APPROVED'
                                                        ? `Verificado el ${formatDate(profile?.kycVerifiedAt)}`
                                                        : profile?.kycStatus === 'SUBMITTED'
                                                            ? 'En revisión'
                                                            : 'Pendiente'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            {/* Gamification Hero */}
                            <div className="bg-black text-white rounded-xl p-8 relative overflow-hidden shadow-lg border border-gray-800">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-800 to-black rounded-full mix-blend-overlay opacity-50 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary rounded-full mix-blend-overlay opacity-10 blur-3xl translate-y-1/4 -translate-x-1/4"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-primary font-bold text-sm tracking-widest uppercase mb-1">Tu Progreso</p>
                                            <h3 className="text-3xl font-bold">Nivel {profile?.level || 1}: {getLevelName()}</h3>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                            <span className="font-bold text-primary">{(profile?.points || 0).toLocaleString()} XP</span>
                                            <span className="text-gray-400 text-sm"> / {((profile?.level || 1) * 5000).toLocaleString()} XP</span>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                                            <span>Progreso actual</span>
                                            <span>{Math.round(getXpProgress())}%</span>
                                        </div>
                                        <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                            <div
                                                className="h-full bg-gradient-to-r from-yellow-600 to-primary rounded-full shadow-[0_0_15px_rgba(238,255,0,0.5)]"
                                                style={{ width: `${getXpProgress()}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
                                        Estás a solo {getXpToNextLevel().toLocaleString()} puntos de desbloquear beneficios exclusivos de nivel {(profile?.level || 1) + 1}.
                                    </p>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-1 hover:border-primary transition-colors cursor-default">
                                    <span className="text-slate-500 text-sm font-medium">Inversión Total</span>
                                    <span className="text-2xl font-bold text-text-main tracking-tight">
                                        ${(stats?.totalInvested || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-1 hover:border-primary transition-colors cursor-default">
                                    <span className="text-slate-500 text-sm font-medium">CO2 Evitado</span>
                                    <span className="text-2xl font-bold text-text-main tracking-tight">
                                        {(stats?.co2Avoided || 0).toFixed(1)} Ton
                                    </span>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-1 hover:border-primary transition-colors cursor-default">
                                    <span className="text-slate-500 text-sm font-medium">Insignias</span>
                                    <span className="text-2xl font-bold text-text-main tracking-tight">
                                        {profile?.badges?.length || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Badges Section */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg text-text-main">Colección de Insignias</h3>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {profile?.badges && profile.badges.length > 0 ? (
                                        profile.badges.map((ub) => (
                                            <div key={ub.id} className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:scale-105 transition-transform">
                                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getBadgeGradient(ub.badge.color)} flex items-center justify-center border-2 border-white shadow-inner`}>
                                                    <span className={`material-symbols-outlined text-3xl ${getBadgeTextColor(ub.badge.color)}`}>
                                                        {ub.badge.icon}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-bold text-center text-text-main">{ub.badge.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-4 text-center py-8 text-gray-500">
                                            <span className="material-symbols-outlined text-4xl mb-2 block">emoji_events</span>
                                            <p>Aún no tienes insignias</p>
                                            <p className="text-xs mt-1">¡Sigue invirtiendo para ganar insignias!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Form */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-text-main">Información Personal</h3>
                            <p className="text-slate-500 text-sm">Estos datos son privados y solo visibles para ti.</p>
                        </div>
                        <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Column 1 */}
                            <div className="space-y-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-slate-700">Nombre</label>
                                    <input
                                        className="bg-white border border-gray-200 text-text-main text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 font-medium disabled:bg-gray-50"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-slate-700">Apellido</label>
                                    <input
                                        className="bg-white border border-gray-200 text-text-main text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 font-medium disabled:bg-gray-50"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-slate-700">Correo Electrónico</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                                        </div>
                                        <input
                                            className="bg-gray-50 border border-gray-200 text-text-main text-sm rounded-lg block w-full pl-10 p-3 font-medium"
                                            type="email"
                                            value={profile?.email || ''}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-slate-700">Teléfono</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="material-symbols-outlined text-gray-400 text-[20px]">phone</span>
                                        </div>
                                        <input
                                            className="bg-white border border-gray-200 text-text-main text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-3 font-medium disabled:bg-gray-50"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="+34 600 000 000"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Column 2 */}
                            <div className="space-y-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-slate-700">Dirección</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="material-symbols-outlined text-gray-400 text-[20px]">home</span>
                                        </div>
                                        <input
                                            className="bg-white border border-gray-200 text-text-main text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-3 font-medium disabled:bg-gray-50"
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="Calle, número, piso"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-slate-700">Ciudad</label>
                                        <input
                                            className="bg-white border border-gray-200 text-text-main text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 font-medium disabled:bg-gray-50"
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="Madrid"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-slate-700">País</label>
                                        <input
                                            className="bg-white border border-gray-200 text-text-main text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 font-medium disabled:bg-gray-50"
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="España"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-slate-700">Idioma Preferido</label>
                                    <select
                                        className="bg-white border border-gray-200 text-text-main text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 font-medium disabled:bg-gray-50"
                                        value={formData.preferredLanguage}
                                        onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                                        disabled={!isEditing}
                                    >
                                        <option value="es">Español</option>
                                        <option value="en">English</option>
                                        <option value="pt">Português</option>
                                    </select>
                                </div>
                                {isEditing && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-slate-700">Bio</label>
                                        <textarea
                                            className="bg-white border border-gray-200 text-text-main text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 font-medium resize-none"
                                            rows={3}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Cuéntanos sobre ti..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-slate-400 text-xs py-4">
                        © 2024 Wattismoney. Todos los derechos reservados.
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
