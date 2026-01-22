'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Contract {
    id: string;
    name: string;
    imageUrl: string | null;
    energyType: string;
    marketType: string;
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

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function ContractsListPage() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [energyFilter, setEnergyFilter] = useState('');
    const [marketFilter, setMarketFilter] = useState('');

    useEffect(() => {
        fetchContracts();
    }, [pagination.page, statusFilter, energyFilter]);

    const fetchContracts = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: '10',
            });
            if (statusFilter) params.append('status', statusFilter);

            const res = await fetch(`/api/panel-admin/contracts?${params}`);
            if (!res.ok) throw new Error('Error al cargar contratos');
            const data = await res.json();
            setContracts(data.contracts || []);
            setPagination(data.pagination || pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este contrato?')) return;

        try {
            const res = await fetch(`/api/panel-admin/contracts/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al eliminar');
            }
            fetchContracts();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al eliminar');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-800',
            ACTIVE: 'bg-blue-100 text-blue-800',
            FUNDED: 'bg-green-100 text-green-800',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
            COMPLETED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
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
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getEnergyBadge = (type: string) => {
        const config: Record<string, { bg: string; icon: string; label: string }> = {
            SOLAR: { bg: 'bg-yellow-100 text-yellow-800', icon: 'sunny', label: 'Solar' },
            WIND: { bg: 'bg-blue-100 text-blue-800', icon: 'air', label: 'Eólica' },
            HYDRO: { bg: 'bg-cyan-100 text-cyan-800', icon: 'water_drop', label: 'Hidro' },
            BIOMASS: { bg: 'bg-emerald-100 text-emerald-800', icon: 'eco', label: 'Biomasa' },
            GEOTHERMAL: { bg: 'bg-orange-100 text-orange-800', icon: 'landslide', label: 'Geotérmica' },
            HYBRID: { bg: 'bg-purple-100 text-purple-800', icon: 'bolt', label: 'Híbrido' },
        };
        const c = config[type] || { bg: 'bg-gray-100 text-gray-800', icon: 'bolt', label: type };
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${c.bg}`}>
                <span className="material-symbols-outlined text-[14px]">{c.icon}</span>
                {c.label}
            </span>
        );
    };

    const getMarketBadge = (type: string) => {
        if (type === 'SECONDARY') {
            return (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                    Secundario
                </span>
            );
        }
        return (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                Primario
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getProgressPercentage = (current: number, total: number) => {
        if (!total) return 0;
        return Math.min(Math.round((current / total) * 100), 100);
    };

    const filteredContracts = contracts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!energyFilter || c.energyType === energyFilter) &&
        (!marketFilter || c.marketType === marketFilter)
    );

    return (
        <>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-6 shrink-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-black">Lista de Contratos de Inversión</h1>
                        <p className="text-gray-500 mt-1">Gestión integral del catálogo de energía renovable.</p>
                    </div>
                    <Link
                        href="/panel-admin/contracts/new"
                        className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Nuevo Contrato
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-200 focus:ring-primary focus:border-primary"
                                    placeholder="Buscar por nombre..."
                                />
                            </div>
                        </div>
                        <div className="w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full py-2 rounded-lg border-gray-200 focus:ring-primary"
                            >
                                <option value="">Estado: Todos</option>
                                <option value="DRAFT">Borrador</option>
                                <option value="ACTIVE">Activo</option>
                                <option value="FUNDED">Financiado</option>
                                <option value="COMPLETED">Completado</option>
                            </select>
                        </div>
                        <div className="w-48">
                            <select
                                value={energyFilter}
                                onChange={(e) => setEnergyFilter(e.target.value)}
                                className="w-full py-2 rounded-lg border-gray-200 focus:ring-primary"
                            >
                                <option value="">Tipo Energía: Todas</option>
                                <option value="SOLAR">Solar</option>
                                <option value="WIND">Eólica</option>
                                <option value="HYDRO">Hidroeléctrica</option>
                                <option value="BIOMASS">Biomasa</option>
                            </select>
                        </div>
                        <div className="relative">
                            <select
                                value={marketFilter}
                                onChange={(e) => setMarketFilter(e.target.value)}
                                className="w-44 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white pr-10"
                            >
                                <option value="">Mercado: Todos</option>
                                <option value="PRIMARY">Primario</option>
                                <option value="SECONDARY">Secundario</option>
                            </select>
                        </div>
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
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Imagen</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Nombre</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Tipo Energía</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Mercado</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Rentabilidad</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Meta ($)</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Recaudado</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Estado</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Creado</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredContracts.map((contract) => {
                                        const progress = getProgressPercentage(Number(contract.currentRaised), Number(contract.totalCapacity));
                                        return (
                                            <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    {contract.imageUrl ? (
                                                        <img
                                                            src={contract.imageUrl}
                                                            alt={contract.name}
                                                            className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-primary">bolt</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-bold">{contract.name}</td>
                                                <td className="px-6 py-4">{getEnergyBadge(contract.energyType)}</td>
                                                <td className="px-6 py-4">{getMarketBadge(contract.marketType)}</td>
                                                <td className="px-6 py-4 text-green-600 font-bold">
                                                    {Number(contract.annualReturn).toFixed(1)}%
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium">
                                                    ${Number(contract.totalCapacity).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1 min-w-[120px]">
                                                        <span className="text-xs font-bold">
                                                            ${Number(contract.currentRaised || 0).toLocaleString()} ({progress}%)
                                                        </span>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                            <div className="bg-primary h-full" style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">{getStatusBadge(contract.status)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(contract.createdAt)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={`/panel-admin/contracts/${contract.id}`}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-primary transition-all"
                                                            title="Ver"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                                        </Link>
                                                        <Link
                                                            href={`/panel-admin/contracts/${contract.id}/edit`}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-primary transition-all"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">edit</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(contract.id)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                                                            title="Eliminar"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredContracts.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">description</span>
                                                No hay contratos que coincidan con los filtros
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && pagination.totalPages > 1 && (
                        <div className="flex justify-between items-center px-2">
                            <span className="text-sm text-gray-500">
                                Mostrando {filteredContracts.length} de {pagination.total} contratos
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    Anterior
                                </button>
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setPagination(p => ({ ...p, page }))}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors ${pagination.page === page ? 'bg-primary text-black' : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
