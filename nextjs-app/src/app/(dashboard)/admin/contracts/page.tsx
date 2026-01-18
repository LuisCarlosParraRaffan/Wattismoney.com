'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Contract {
    id: string;
    name: string;
    imageUrl: string | null;
    energyType: string;
    annualReturn: number;
    totalCapacity: number;
    currentRaised: number;
    status: string;
    createdAt: string;
    _count: {
        investments: number;
        documents: number;
    };
}

export default function ContractsListPage() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const res = await fetch('/api/admin/contracts');
            if (!res.ok) throw new Error('Error al cargar contratos');
            const data = await res.json();
            setContracts(data.contracts || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-600',
            ACTIVE: 'bg-green-100 text-green-700',
            FUNDED: 'bg-blue-100 text-blue-700',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
            COMPLETED: 'bg-purple-100 text-purple-700',
            CANCELLED: 'bg-red-100 text-red-700',
        };
        const labels: Record<string, string> = {
            DRAFT: 'Borrador',
            ACTIVE: 'Activo',
            FUNDED: 'Financiado',
            IN_PROGRESS: 'En Progreso',
            COMPLETED: 'Completado',
            CANCELLED: 'Cancelado',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getEnergyIcon = (type: string) => {
        const icons: Record<string, string> = {
            SOLAR: 'sunny',
            WIND: 'air',
            HYDRO: 'water_drop',
            BIOMASS: 'compost',
            GEOTHERMAL: 'landslide',
            HYBRID: 'energy_program_saving',
        };
        return icons[type] || 'bolt';
    };

    return (
        <>
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-black">Gestión de Contratos</h1>
                    <p className="text-sm text-slate-500">Administra las oportunidades de inversión</p>
                </div>
                <Link
                    href="/admin/contracts/new"
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-black text-sm font-black rounded-lg shadow-md hover:brightness-105 transition-all"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Nuevo Contrato
                </Link>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-6xl mx-auto">

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && contracts.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">description</span>
                            <h2 className="text-lg font-bold text-gray-700 mb-2">No hay contratos aún</h2>
                            <p className="text-sm text-gray-500 mb-6">Crea tu primer contrato de inversión</p>
                            <Link
                                href="/admin/contracts/new"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-lg"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Crear Contrato
                            </Link>
                        </div>
                    )}

                    {/* Contracts Table */}
                    {!isLoading && contracts.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Contrato</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tipo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Rentabilidad</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Progreso</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contracts.map((contract) => (
                                        <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-primary">{getEnergyIcon(contract.energyType)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-black">{contract.name}</p>
                                                        <p className="text-xs text-slate-500">{contract._count.investments} inversiones</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">{contract.energyType}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-green-600">{Number(contract.annualReturn).toFixed(1)}%</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-full">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-slate-500">${Number(contract.currentRaised).toLocaleString()}</span>
                                                        <span className="font-bold">${Number(contract.totalCapacity).toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{ width: `${Math.min((Number(contract.currentRaised) / Number(contract.totalCapacity)) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(contract.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/contracts/${contract.id}`}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Ver detalle"
                                                    >
                                                        <span className="material-symbols-outlined text-slate-500">visibility</span>
                                                    </Link>
                                                    <button
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-slate-500">edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
