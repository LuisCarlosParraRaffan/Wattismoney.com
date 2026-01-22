'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WattismoneyLogo } from '@/components/Icons';

interface ContractDocument {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number | null;
}

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
    generator: string | null;
    generatorLocation: string | null;
    buyer: string | null;
    buyerIndustry: string | null;
    energyType: string;
    energyAmount: number;
    termMonths: number | null;
    co2Emissions: number | null;
    status: string;
    documents: ContractDocument[];
}

export default function ContractDetail() {
    const params = useParams();
    const contractId = params.id as string;

    const [contract, setContract] = useState<Contract | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [investAmount, setInvestAmount] = useState(1000);

    useEffect(() => {
        fetchContract();
    }, [contractId]);

    const fetchContract = async () => {
        try {
            const res = await fetch(`/api/contracts/${contractId}`);
            if (!res.ok) {
                if (res.status === 404) throw new Error('Contrato no encontrado');
                throw new Error('Error al cargar el contrato');
            }
            const data = await res.json();
            setContract(data.contract);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const getEnergyLabel = (type: string) => {
        const labels: Record<string, string> = {
            SOLAR: 'Solar',
            WIND: 'Eólica',
            WIND_ONSHORE: 'Eólica Onshore',
            WIND_OFFSHORE: 'Eólica Offshore',
            HYDRO: 'Hidroeléctrica',
            BIOMASS: 'Biomasa',
            GEOTHERMAL: 'Geotérmica',
            HYBRID: 'Híbrido',
        };
        return labels[type] || type;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatTerm = (months: number | null) => {
        if (!months) return 'N/A';
        if (months >= 12 && months % 12 === 0) {
            const years = months / 12;
            return `${years} ${years === 1 ? 'año' : 'años'}`;
        }
        return `${months} meses`;
    };

    const getProgress = () => {
        if (!contract) return 0;
        return Math.min(Math.round((Number(contract.currentRaised) / Number(contract.totalCapacity)) * 100), 100);
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando contrato...</p>
                </div>
            </div>
        );
    }

    if (error || !contract) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error_outline</span>
                    <h2 className="text-xl font-bold text-gray-700">{error || 'Contrato no encontrado'}</h2>
                    <Link href="/mercado-primario" className="text-primary hover:underline mt-2 inline-block">
                        Volver al mercado
                    </Link>
                </div>
            </div>
        );
    }

    const progress = getProgress();

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-text-main">
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/mercado-primario" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-text-main">Detalle del Contrato</h1>
                        <p className="text-xs text-gray-500">ID: {contractId}</p>
                    </div>
                </div>
                <Link href="/" className="hidden md:block">
                    <WattismoneyLogo className="h-8 w-auto" />
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Hero */}
                            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                                <div
                                    className="h-64 bg-cover bg-center relative"
                                    style={{
                                        backgroundImage: contract.imageUrl
                                            ? `url("${contract.imageUrl}")`
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <span className="px-3 py-1 bg-primary text-black text-xs font-bold rounded-full mb-2 inline-block">
                                            {getEnergyLabel(contract.energyType)}
                                        </span>
                                        <h2 className="text-3xl font-black text-white">{contract.name}</h2>
                                        {contract.generatorLocation && (
                                            <p className="text-gray-300 flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                {contract.generatorLocation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 leading-relaxed">
                                        {contract.description || `Contrato de energía ${getEnergyLabel(contract.energyType).toLowerCase()} con ${contract.generator || 'generador certificado'}. ${contract.buyer ? `Suministro a ${contract.buyer}` : ''} ${contract.buyerIndustry ? `del sector ${contract.buyerIndustry}` : ''}. Plazo de ${formatTerm(contract.termMonths)}.`}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Volumen Energía</p>
                                    <p className="text-xl font-black text-black">{Number(contract.energyAmount).toLocaleString()} GWh</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Plazo</p>
                                    <p className="text-xl font-black text-black">{formatTerm(contract.termMonths)}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">TIR Estimada</p>
                                    <p className="text-xl font-black text-green-600">{Number(contract.annualReturn).toFixed(1)}%</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">CO2 Evitado/Año</p>
                                    <p className="text-xl font-black text-black">
                                        {contract.co2Emissions ? `${Number(contract.co2Emissions).toLocaleString()} t` : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-lg mb-4">Documentación del Proyecto</h3>
                                {contract.documents.length > 0 ? (
                                    <div className="space-y-3">
                                        {contract.documents.map((doc) => (
                                            <a
                                                key={doc.id}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                                                <span className="font-medium">{doc.name}</span>
                                                <span className="ml-auto text-xs text-gray-500">
                                                    PDF {doc.size ? `• ${formatFileSize(doc.size)}` : ''}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No hay documentos disponibles para este proyecto.</p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar - Investment */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-6">
                                <h3 className="font-bold text-lg mb-4">Invertir en este Proyecto</h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-500">Financiado</span>
                                            <span className="font-bold">{progress}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>{formatCurrency(Number(contract.currentRaised))}</span>
                                            <span>{formatCurrency(Number(contract.totalCapacity))}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Inversión Mínima</p>
                                        <p className="text-2xl font-black text-black">{formatCurrency(Number(contract.minInvestment))}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block">
                                        <span className="text-sm font-bold text-gray-700">Monto a invertir</span>
                                        <div className="relative mt-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                                placeholder="1,000"
                                                value={investAmount}
                                                onChange={(e) => setInvestAmount(Number(e.target.value))}
                                                min={Number(contract.minInvestment)}
                                                max={Number(contract.maxInvestment)}
                                            />
                                        </div>
                                    </label>

                                    <button className="w-full py-4 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">bolt</span>
                                        Invertir Ahora
                                    </button>

                                    <p className="text-xs text-gray-500 text-center">
                                        Al invertir, aceptas los <a href="#" className="underline">términos y condiciones</a>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-600">verified</span>
                                    <div>
                                        <p className="font-bold text-green-800 text-sm">Proyecto Verificado</p>
                                        <p className="text-xs text-green-700 mt-1">Este proyecto ha pasado nuestra auditoría técnica y legal (Due Diligence).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
