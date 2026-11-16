'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WattismoneyLogo } from '@/components/Icons';
import BankTransferCheckout from '@/components/BankTransferCheckout';

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
    const [investAmount, setInvestAmount] = useState(0);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [investSuccess, setInvestSuccess] = useState<{
        amount: number;
        expectedReturn: number;
        railLabel: string;
        status: string;
        earnedXp?: number;
        explorerLink?: string;
    } | null>(null);

    useEffect(() => {
        fetchContractAndWallet();
    }, [contractId]);

    const fetchContractAndWallet = async () => {
        try {
            const contractRes = await fetch(`/api/contracts/${contractId}`);

            if (!contractRes.ok) {
                if (contractRes.status === 404) throw new Error('Contrato no encontrado');
                throw new Error('Error al cargar el contrato');
            }

            const contractData = await contractRes.json();
            setContract(contractData.contract);
            setInvestAmount((current) => current || Number(contractData.contract?.minInvestment || 0));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const getEnergyLabel = (type: string) => {
        const labels: Record<string, string> = {
            SOLAR: 'Solar Fotovoltaica',
            WIND: 'Eólica',
            WIND_ONSHORE: 'Eólica Onshore',
            WIND_OFFSHORE: 'Eólica Offshore',
            HYDRO: 'Hidroeléctrica',
            BIOMASS: 'Biomasa',
            GEOTHERMAL: 'Geotérmica',
            HYBRID: 'Híbrido Renovable',
        };
        return labels[type] || type;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatTerm = (months: number | null) => {
        if (!months) return '12 meses';
        if (months >= 12 && months % 12 === 0) {
            const years = months / 12;
            return `${years} ${years === 1 ? 'año' : 'años'}`;
        }
        return `${months} meses`;
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
                    <p className="text-gray-500">Cargando contrato energético...</p>
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
                        Volver al mercado primario
                    </Link>
                </div>
            </div>
        );
    }

    const totalCapacity = Number(contract.totalCapacity);
    const currentRaised = Number(contract.currentRaised);
    const remainingCapacity = Math.max(0, totalCapacity - currentRaised);
    const minInvestment = Number(contract.minInvestment);
    const maxInvestment =
        Number(contract.maxInvestment) > 0
            ? Math.min(Number(contract.maxInvestment), remainingCapacity)
            : remainingCapacity;
    const progress = Math.min(Math.round((currentRaised / totalCapacity) * 100), 100);

    // Interactive Simulator Calculations
    const annualRate = Number(contract.annualReturn) / 100;
    const termMonths = Number(contract.termMonths || 12);
    const estimatedAnnualGain = investAmount * annualRate;
    const estimatedMonthlyDividend = estimatedAnnualGain / 12;
    const totalExpectedReturn = investAmount * Math.pow(1 + annualRate, termMonths / 12);
    const shareOfProject = totalCapacity > 0 ? investAmount / totalCapacity : 0;
    const estimatedMwhFinanced = Number(contract.energyAmount || 0) * 1000 * shareOfProject;
    const estimatedCo2Tons = Number(contract.co2Emissions || 0) * shareOfProject;

    if (investSuccess) {
        return (
            <div className="flex flex-col h-full bg-background-light font-display text-text-main">
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/cartera" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-text-main">Comprobante de Inversión PPA</h1>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center border border-gray-200">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-5xl text-green-600">
                                {investSuccess.status === 'PENDING' ? 'schedule' : 'verified'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">
                            {investSuccess.status === 'PENDING'
                                ? 'Transferencia en Verificación'
                                : '¡Inversión Energética Confirmada!'}
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            Registraste una inversión de{' '}
                            <span className="font-bold text-black">{formatCurrency(investSuccess.amount)}</span> en el
                            proyecto <strong>{contract.name}</strong> mediante <strong>{investSuccess.railLabel}</strong>.
                        </p>

                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-left">
                            <div>
                                <p className="text-[11px] text-slate-500 uppercase font-bold">Retorno Proyectado</p>
                                <p className="text-lg font-black text-emerald-600">
                                    {formatCurrency(investSuccess.expectedReturn)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 uppercase font-bold">Dividendo Mensual Est.</p>
                                <p className="text-lg font-black text-slate-900">
                                    {formatCurrency(estimatedMonthlyDividend)}/mes
                                </p>
                            </div>
                            {investSuccess.earnedXp ? (
                                <div className="col-span-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">Recompensa Gamificación:</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-primary text-black text-xs font-black">
                                        +{investSuccess.earnedXp} XP Ganados
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        {investSuccess.explorerLink && (
                            <a
                                href={investSuccess.explorerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-2 rounded-lg mb-6 hover:underline"
                            >
                                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                Ver Transacción en Block Explorer
                            </a>
                        )}

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/cartera"
                                className="w-full py-3.5 bg-primary hover:brightness-95 text-black font-black rounded-xl transition-colors"
                            >
                                Ir a mi Cartera e Historial
                            </Link>
                            <Link
                                href="/mercado-primario"
                                className="w-full py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                Explorar más Contratos PPA
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-text-main">
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/mercado-primario" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-text-main">{contract.name}</h1>
                        <p className="text-xs text-gray-500">
                            Inversión en pesos colombianos (COP) por transferencia bancaria
                        </p>
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
                        {/* Left Column: Contract Info & Simulator */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Hero */}
                            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs">
                                <div
                                    className="h-64 bg-cover bg-center relative"
                                    style={{
                                        backgroundImage: contract.imageUrl
                                            ? `url("${contract.imageUrl}")`
                                            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-3 py-1 bg-primary text-black text-xs font-bold rounded-full">
                                                {getEnergyLabel(contract.energyType)}
                                            </span>
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-xs text-white text-xs font-bold rounded-full">
                                                TIR {Number(contract.annualReturn).toFixed(1)}% E.A.
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-black text-white">{contract.name}</h2>
                                        {contract.generatorLocation && (
                                            <p className="text-gray-300 flex items-center gap-1 mt-1 text-sm">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                {contract.generatorLocation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                        {contract.description ||
                                            `Contrato de compra de energía (PPA) de fuente ${getEnergyLabel(
                                                contract.energyType
                                            ).toLowerCase()} operado por ${
                                                contract.generator || 'generador certificado'
                                            }. Suministro eléctrico garantizado para ${
                                                contract.buyer || 'consumidor industrial'
                                            } en el sector ${
                                                contract.buyerIndustry || 'industrial'
                                            } por un plazo de ${formatTerm(contract.termMonths)}.`}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-gray-100">
                                            <span className="material-symbols-outlined text-amber-600 bg-amber-100 p-2 rounded-lg">
                                                solar_power
                                            </span>
                                            <div>
                                                <p className="text-[11px] uppercase font-bold text-slate-400">
                                                    Generador Energético
                                                </p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {contract.generator || 'Generadora Renovable SPV'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-gray-100">
                                            <span className="material-symbols-outlined text-blue-600 bg-blue-100 p-2 rounded-lg">
                                                factory
                                            </span>
                                            <div>
                                                <p className="text-[11px] uppercase font-bold text-slate-400">
                                                    Off-Taker (Comprador PPA)
                                                </p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {contract.buyer || 'Industria Certificada'}{' '}
                                                    {contract.buyerIndustry ? `(${contract.buyerIndustry})` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Volumen Energía</p>
                                    <p className="text-xl font-black text-black">
                                        {Number(contract.energyAmount).toLocaleString()} GWh
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Plazo PPA</p>
                                    <p className="text-xl font-black text-black">{formatTerm(contract.termMonths)}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">TIR Anual</p>
                                    <p className="text-xl font-black text-green-600">
                                        {Number(contract.annualReturn).toFixed(1)}%
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-bold">CO₂ Evitado/Año</p>
                                    <p className="text-xl font-black text-black">
                                        {contract.co2Emissions
                                            ? `${Number(contract.co2Emissions).toLocaleString()} Ton`
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Interactive Financial & Environmental Simulator */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary bg-black p-1.5 rounded-lg text-base">
                                                calculate
                                            </span>
                                            Simulador de Rendimientos e Impacto
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Desliza el monto para proyectar tus dividendos energéticos e impacto ambiental.
                                        </p>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900">
                                        {formatCurrency(investAmount)}
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min={minInvestment}
                                    max={Math.max(minInvestment * 2, maxInvestment)}
                                    step={50}
                                    value={investAmount}
                                    onChange={(e) => setInvestAmount(Number(e.target.value))}
                                    className="w-full accent-black cursor-pointer h-2 bg-gray-200 rounded-lg"
                                />

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                                        <p className="text-[11px] font-bold text-emerald-800 uppercase">
                                            Flujo Mensual Est.
                                        </p>
                                        <p className="text-lg font-black text-emerald-700">
                                            +{formatCurrency(estimatedMonthlyDividend)}
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-900 text-white">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase">
                                            Retorno Total ({formatTerm(contract.termMonths)})
                                        </p>
                                        <p className="text-lg font-black text-primary">
                                            {formatCurrency(totalExpectedReturn)}
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                                        <p className="text-[11px] font-bold text-blue-800 uppercase">
                                            Energía Financiada
                                        </p>
                                        <p className="text-lg font-black text-blue-900">
                                            {estimatedMwhFinanced.toFixed(1)} MWh
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                                        <p className="text-[11px] font-bold text-amber-900 uppercase">
                                            CO₂ Mitigado
                                        </p>
                                        <p className="text-lg font-black text-amber-900">
                                            {estimatedCo2Tons.toFixed(1)} Ton
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                                <h3 className="font-bold text-lg mb-4">Respaldo Legal y Técnico (Due Diligence)</h3>
                                {contract.documents.length > 0 ? (
                                    <div className="space-y-3">
                                        {contract.documents.map((doc) => (
                                            <a
                                                key={doc.id}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-red-500">
                                                    picture_as_pdf
                                                </span>
                                                <span className="font-medium text-sm">{doc.name}</span>
                                                <span className="ml-auto text-xs text-gray-500">
                                                    PDF {doc.size ? `• ${formatFileSize(doc.size)}` : ''}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                                        <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-emerald-600">
                                                verified_user
                                            </span>
                                            <span>Contrato PPA Firmado en Fideicomiso SPV</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-blue-600">bolt</span>
                                            <span>Garantía de Despacho Eléctrico XM / CREG</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar - Investment Action */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-black text-lg text-slate-900">Financiar Contrato</h3>
                                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                                        Abierto
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-500">Progreso de Fondeo</span>
                                            <span className="font-bold">{progress}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                                            <span>Recaudado: {formatCurrency(currentRaised)}</span>
                                            <span>Meta: {formatCurrency(totalCapacity)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                                Ticket Mínimo
                                            </p>
                                            <p className="text-lg font-black text-black">
                                                {formatCurrency(minInvestment)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                                Ticket Máximo
                                            </p>
                                            <p className="text-lg font-black text-emerald-700">
                                                {formatCurrency(maxInvestment)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-xs font-bold text-gray-700 uppercase">
                                            Monto a Invertir (COP)
                                        </span>
                                        <div className="relative mt-1.5">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary font-black text-lg outline-none"
                                                value={investAmount}
                                                onChange={(e) => setInvestAmount(Number(e.target.value))}
                                                min={minInvestment}
                                                max={maxInvestment}
                                            />
                                        </div>
                                    </label>

                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 space-y-1.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Método de pago:</span>
                                            <span className="font-bold text-slate-800">
                                                Transferencia bancaria (COP)
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Retorno estimado al vencimiento:</span>
                                            <span className="font-black text-emerald-700">
                                                {formatCurrency(totalExpectedReturn)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setShowCheckoutModal(true);
                                        }}
                                        disabled={contract.status !== 'ACTIVE'}
                                        className="w-full py-4 bg-primary hover:brightness-95 disabled:bg-gray-300 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined">bolt</span>
                                        Invertir por Transferencia Bancaria
                                    </button>

                                    <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-400 font-medium">
                                        <span>Tu inversión se confirma cuando Tesorería valida el abono</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {showCheckoutModal && (
                <BankTransferCheckout
                    contractId={contractId}
                    contractName={contract.name}
                    initialAmountCop={investAmount}
                    minInvestment={minInvestment}
                    maxInvestment={maxInvestment}
                    onClose={() => setShowCheckoutModal(false)}
                    onSuccess={(result) => {
                        setShowCheckoutModal(false);
                        setInvestAmount(result.amountCop);
                        setInvestSuccess({
                            amount: result.amountCop,
                            expectedReturn: result.expectedReturn,
                            railLabel: `Transferencia Bancaria (Ref. ${result.reference})`,
                            status: 'PENDING',
                        });
                        fetchContractAndWallet();
                    }}
                />
            )}
        </div>
    );
}
