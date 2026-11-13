'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BadgeItem {
    id: string;
    name: string;
    icon: string;
    color: string;
}

interface LeaderboardEntry {
    rank: number;
    id: string;
    name: string;
    avatarUrl: string | null;
    points: number;
    level: string;
    totalInvested: number;
    contractsCount: number;
    badges: BadgeItem[];
    isCurrentUser: boolean;
}

const LEVEL_TIERS = [
    { name: 'Enchufado', minXp: 0, nextXp: 300, icon: 'power', color: 'bg-slate-100 text-slate-800' },
    { name: 'Solar Punk', minXp: 300, nextXp: 1000, icon: 'solar_power', color: 'bg-yellow-100 text-yellow-900' },
    { name: 'Magnate Verde', minXp: 1000, nextXp: 2500, icon: 'eco', color: 'bg-emerald-100 text-emerald-900' },
    { name: 'Titán Energético', minXp: 2500, nextXp: 10000, icon: 'bolt', color: 'bg-purple-100 text-purple-900' },
];

export default function ClasificacionPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                if (res.ok) {
                    const data = await res.json();
                    setLeaderboard(data.leaderboard || []);
                    setCurrentUser(data.currentUser || null);
                }
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    const userXp = currentUser?.points || 0;
    const currentTier =
        [...LEVEL_TIERS].reverse().find((t) => userXp >= t.minXp) || LEVEL_TIERS[0];
    const progressToNext = Math.min(
        100,
        Math.round(((userXp - currentTier.minXp) / (currentTier.nextXp - currentTier.minXp)) * 100)
    );

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-text-main">
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                <div>
                    <h1 className="text-xl font-black text-text-main flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                        Ranking de Inversores Energéticos
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500">
                        Gana puntos XP financiando contratos PPA en Fiat o Web3 (+25% bonus XP en USDC/USDT).
                    </p>
                </div>
                <Link
                    href="/mercado-primario"
                    className="px-4 py-2 bg-primary hover:brightness-95 text-black font-bold rounded-xl text-xs md:text-sm"
                >
                    Ganar más XP
                </Link>
            </header>

            <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* User's Current Rank & XP Progress Banner */}
                    <div className="bg-black text-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary text-black flex items-center justify-center text-2xl font-black shrink-0">
                                #{currentUser?.rank || '-'}
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-primary tracking-wider">
                                    Tu Rango Actual
                                </span>
                                <h2 className="text-2xl font-black text-white">
                                    {currentUser?.level || currentTier.name}
                                </h2>
                                <p className="text-xs text-gray-400">
                                    {userXp.toLocaleString()} XP acumulados • {currentUser?.contractsCount || 0} contratos
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-gray-300">
                                    Progreso hacia el siguiente nivel ({currentTier.nextXp.toLocaleString()} XP)
                                </span>
                                <span className="text-primary">{progressToNext}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${progressToNext}%` }}
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-2 pt-2">
                                {LEVEL_TIERS.map((tier) => (
                                    <div
                                        key={tier.name}
                                        className={`p-2 rounded-lg border text-center ${
                                            userXp >= tier.minXp
                                                ? 'border-primary/50 bg-white/10 text-white'
                                                : 'border-slate-800 bg-slate-900/50 text-gray-500'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm text-primary block">
                                            {tier.icon}
                                        </span>
                                        <span className="text-[11px] font-bold block truncate">{tier.name}</span>
                                        <span className="text-[10px] text-gray-400">{tier.minXp}+ XP</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top 3 Podium */}
                    {!isLoading && leaderboard.length >= 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {leaderboard.slice(0, 3).map((leader, idx) => {
                                const medals = [
                                    { bg: 'border-yellow-400 bg-yellow-50/40', badge: 'bg-yellow-400 text-black', label: '1° Lugar 🏆' },
                                    { bg: 'border-slate-300 bg-slate-50/50', badge: 'bg-slate-300 text-slate-900', label: '2° Lugar 🥈' },
                                    { bg: 'border-amber-600/40 bg-amber-50/30', badge: 'bg-amber-600 text-white', label: '3° Lugar 🥉' },
                                ];
                                const style = medals[idx] || medals[2];

                                return (
                                    <div
                                        key={leader.id}
                                        className={`rounded-2xl border-2 p-6 bg-white shadow-xs flex flex-col justify-between ${style.bg}`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black ${style.badge}`}>
                                                {style.label}
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">{leader.level}</span>
                                        </div>

                                        <div className="flex items-center gap-3.5 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-black text-primary flex items-center justify-center font-black text-base shrink-0">
                                                {getInitials(leader.name)}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="font-black text-slate-900 truncate">
                                                    {leader.name} {leader.isCurrentUser ? '(Tú)' : ''}
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    {leader.contractsCount} proyecto{leader.contractsCount !== 1 ? 's' : ''} PPA financiado{leader.contractsCount !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500">Puntos de Impacto</span>
                                            <span className="text-lg font-black text-slate-900">
                                                {leader.points.toLocaleString()} XP
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Full Leaderboard Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Tabla General de Clasificación</h3>
                            <span className="text-xs text-slate-500">
                                Top {leaderboard.length} inversores activos
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center text-slate-400">Cargando clasificación...</div>
                        ) : leaderboard.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                Aún no hay inversores registrados en la clasificación.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-gray-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                                            <th className="px-6 py-4">Posición</th>
                                            <th className="px-6 py-4">Inversor</th>
                                            <th className="px-6 py-4">Nivel</th>
                                            <th className="px-6 py-4">Insignias</th>
                                            <th className="px-6 py-4">Contratos PPA</th>
                                            <th className="px-6 py-4 text-right">Puntos XP</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {leaderboard.map((entry) => (
                                            <tr
                                                key={entry.id}
                                                className={`transition-colors ${
                                                    entry.isCurrentUser
                                                        ? 'bg-primary/15 font-semibold'
                                                        : 'hover:bg-slate-50'
                                                }`}
                                            >
                                                <td className="px-6 py-4 font-black text-slate-900">
                                                    #{entry.rank}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-slate-900 text-primary flex items-center justify-center text-xs font-bold">
                                                            {getInitials(entry.name)}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-slate-900">
                                                                {entry.name}
                                                            </span>
                                                            {entry.isCurrentUser && (
                                                                <span className="ml-2 px-2 py-0.5 rounded bg-black text-primary text-[10px] font-bold">
                                                                    TÚ
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                                                        {entry.level}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {entry.badges.length > 0 ? (
                                                        <div className="flex items-center gap-1.5">
                                                            {entry.badges.map((b) => (
                                                                <span
                                                                    key={b.id}
                                                                    title={b.name}
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">
                                                                        {b.icon || 'military_tech'}
                                                                    </span>
                                                                    {b.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">En progreso</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-700">
                                                    {entry.contractsCount}
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-slate-900">
                                                    {entry.points.toLocaleString()} XP
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
