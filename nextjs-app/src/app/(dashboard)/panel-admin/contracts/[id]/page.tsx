'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Contract {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    annualReturn: number;
    totalCapacity: number;
    currentRaised: number;
    minInvestment: number;
    maxInvestment: number;
    generator: string;
    generatorLocation: string | null;
    buyer: string;
    buyerIndustry: string;
    energyType: string;
    energyAmount: number;
    termMonths: number;
    co2Emissions: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        investments: number;
        documents: number;
    };
}

export default function ContractDetailPage() {
    const params = useParams();
    const contractId = params.id as string;

    const [contract, setContract] = useState<Contract | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchContract();
    }, [contractId]);

    const fetchContract = async () => {
        try {
            const res = await fetch(`/api/admin/contracts/${contractId}`);
            if (!res.ok) throw new Error('Error al cargar el contrato');
            const data = await res.json();
            setContract(data.contract);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; label: string }> = {
            DRAFT: { bg: 'bg-gray-100 text-gray-800', label: 'Borrador' },
            ACTIVE: { bg: 'bg-blue-100 text-blue-800', label: 'Activo' },
            FUNDED: { bg: 'bg-green-100 text-green-800', label: 'Financiado' },
            COMPLETED: { bg: 'bg-green-100 text-green-800', label: 'Completado' },
            CANCELLED: { bg: 'bg-red-100 text-red-800', label: 'Cancelado' },
        };
        const c = config[status] || { bg: 'bg-gray-100 text-gray-800', label: status };
        return <span className={`px-3 py-1 rounded-full text-sm font-bold ${c.bg}`}>{c.label}</span>;
    };

    const getEnergyTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            SOLAR: 'Solar Fotovoltaica',
            WIND: 'Eólica Onshore',
            WIND_OFFSHORE: 'Eólica Offshore',
            BIOMASS: 'Biomasa',
            HYDRO: 'Hidroeléctrica',
            GEOTHERMAL: 'Geotérmica',
            HYBRID: 'Híbrido',
        };
        return labels[type] || type;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getProgressPercentage = () => {
        if (!contract || !contract.totalCapacity) return 0;
        return Math.min(Math.round((contract.currentRaised / contract.totalCapacity) * 100), 100);
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !contract) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">error</span>
                    <p className="text-gray-500">{error || 'Contrato no encontrado'}</p>
                    <Link href="/panel-admin/contracts" className="text-primary font-bold mt-4 inline-block">Volver a contratos</Link>
                </div>
            </div>
        );
    }

    const progress = getProgressPercentage();

    return (
        <>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-6 shrink-0">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <Link href="/panel-admin/contracts" className="hover:underline">Contratos</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="font-bold text-black">Detalle</span>
                    </div>
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-extrabold text-black">{contract.name}</h1>
                            {getStatusBadge(contract.status)}
                        </div>
                        <Link
                            href={`/panel-admin/contracts/${contract.id}/edit`}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-bold hover:brightness-95 transition-all"
                        >
                            <span className="material-symbols-outlined">edit</span>
                            Editar Contrato
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Image */}
                    {contract.imageUrl && (
                        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                            <img src={contract.imageUrl} alt={contract.name} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Progress & Stats */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="text-center p-4 bg-primary/10 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Rentabilidad Anual</p>
                                <p className="text-3xl font-extrabold text-black">{contract.annualReturn}%</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Meta Financiación</p>
                                <p className="text-2xl font-bold text-black">{formatCurrency(contract.totalCapacity)}</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Recaudado</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(contract.currentRaised || 0)}</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Inversiones</p>
                                <p className="text-2xl font-bold text-black">{contract._count?.investments || 0}</p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold">{progress}% completado</span>
                                <span className="text-gray-500">{formatCurrency(contract.totalCapacity - (contract.currentRaised || 0))} restantes</span>
                            </div>
                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Detalles Financieros */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <span className="material-symbols-outlined text-black">payments</span>
                                </div>
                                <h2 className="text-xl font-bold text-black">Detalles Financieros</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Tipo de Energía</span>
                                    <span className="font-bold">{getEnergyTypeLabel(contract.energyType)}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Inversión Mínima</span>
                                    <span className="font-bold">{formatCurrency(contract.minInvestment)}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Inversión Máxima</span>
                                    <span className="font-bold">{formatCurrency(contract.maxInvestment)}</span>
                                </div>
                                <div className="flex justify-between py-3">
                                    <span className="text-gray-500">Plazo</span>
                                    <span className="font-bold">
                                        {contract.termMonths >= 12
                                            ? `${Math.floor(contract.termMonths / 12)} años`
                                            : `${contract.termMonths} meses`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Especificaciones */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <span className="material-symbols-outlined text-black">tune</span>
                                </div>
                                <h2 className="text-xl font-bold text-black">Especificaciones</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Generador</span>
                                    <span className="font-bold">{contract.generator}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Comprador (Off-taker)</span>
                                    <span className="font-bold">{contract.buyer}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Industria</span>
                                    <span className="font-bold">{contract.buyerIndustry || '-'}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500">Volumen Energía</span>
                                    <span className="font-bold">{contract.energyAmount?.toLocaleString() || 0} MWh</span>
                                </div>
                                <div className="flex justify-between py-3">
                                    <span className="text-gray-500">CO2 Evitado</span>
                                    <span className="font-bold text-green-600">{contract.co2Emissions?.toLocaleString() || 0} toneladas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <span className="material-symbols-outlined text-black">info</span>
                            </div>
                            <h2 className="text-xl font-bold text-black">Información del Sistema</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">ID del Contrato</p>
                                <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg">{contract.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Creado</p>
                                <p className="font-medium">{formatDate(contract.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Última Actualización</p>
                                <p className="font-medium">{formatDate(contract.updatedAt)}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
