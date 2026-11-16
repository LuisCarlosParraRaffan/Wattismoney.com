'use client';

import React, { useState, useEffect } from 'react';

interface AdminTransaction {
    id: string;
    type: string;
    status: string;
    paymentRail: string;
    amount: number;
    fee: number;
    netAmount: number;
    currency: string;
    description: string | null;
    txHash: string | null;
    networkName: string | null;
    bankReference: string | null;
    receiptUrl: string | null;
    toAddress: string | null;
    createdAt: string;
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
    contract: {
        id: string;
        name: string;
    } | null;
}

interface ContractOption {
    id: string;
    name: string;
    annualReturn: number;
    currentRaised: number;
    totalCapacity: number;
    investorsCount: number;
}

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
    const [contracts, setContracts] = useState<ContractOption[]>([]);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED'>('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Yield Distribution state
    const [selectedContractId, setSelectedContractId] = useState('');
    const [yieldCurrency, setYieldCurrency] = useState<'USD' | 'USDC'>('USD');
    const [yieldMonths, setYieldMonths] = useState(1);
    const [isDistributing, setIsDistributing] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

    const fetchData = async (status = statusFilter) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/transactions?status=${status}`);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions || []);
                setContracts(data.contracts || []);
                if (!selectedContractId && data.contracts?.length > 0) {
                    setSelectedContractId(data.contracts[0].id);
                }
            }
        } catch (err) {
            console.error('Error loading admin transactions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(statusFilter);
    }, [statusFilter]);

    const handleReview = async (transactionId: string, action: 'APPROVE' | 'REJECT') => {
        setProcessingId(transactionId);
        setFeedbackMsg(null);
        try {
            const res = await fetch('/api/admin/transactions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId, action }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al procesar');
            setFeedbackMsg(data.message);
            fetchData(statusFilter);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDistributeYield = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContractId) return;
        setIsDistributing(true);
        setFeedbackMsg(null);
        try {
            const res = await fetch('/api/admin/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contractId: selectedContractId,
                    currency: yieldCurrency,
                    periodMonths: yieldMonths,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al dispersar rendimientos');
            setFeedbackMsg(data.message);
            fetchData(statusFilter);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error');
        } finally {
            setIsDistributing(false);
        }
    };

    const getTypeBadge = (type: string) => {
        const map: Record<string, { label: string; style: string }> = {
            DEPOSIT_FIAT: { label: 'Depósito Fiat', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            DEPOSIT_CRYPTO: { label: 'Depósito Crypto', style: 'bg-purple-50 text-purple-700 border-purple-200' },
            WITHDRAWAL_FIAT: { label: 'Retiro Bancario', style: 'bg-orange-50 text-orange-700 border-orange-200' },
            WITHDRAWAL_CRYPTO: { label: 'Retiro Web3', style: 'bg-amber-50 text-amber-800 border-amber-200' },
            INVESTMENT_PRIMARY: { label: 'Inversión PPA', style: 'bg-blue-50 text-blue-700 border-blue-200' },
            SECONDARY_PURCHASE: { label: 'Compra Secundario', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
            SECONDARY_SALE: { label: 'Venta Secundario', style: 'bg-teal-50 text-teal-700 border-teal-200' },
            YIELD_DISTRIBUTION: { label: 'Dividendo PPA', style: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
        };
        const item = map[type] || { label: type, style: 'bg-gray-100 text-gray-700 border-gray-200' };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${item.style}`}>
                {item.label}
            </span>
        );
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary bg-black p-2 rounded-xl">account_balance</span>
                            Tesorería Híbrida (Fiat + Web3) y Dividendos PPA
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Aprueba transferencias bancarias, retiros y dispersa rendimientos energéticos a las billeteras de los inversores.
                        </p>
                    </div>
                </div>

                {feedbackMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 font-medium text-sm">
                            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                            <span>{feedbackMsg}</span>
                        </div>
                        <button onClick={() => setFeedbackMsg(null)} className="text-emerald-700 hover:text-emerald-900">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}

                {/* Panel de Dispersión de Rendimientos Energéticos (Yield Engine) */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-primary/20 text-black">
                            <span className="material-symbols-outlined">bolt</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Motor de Dispersión de Rendimientos PPA</h2>
                            <p className="text-xs text-slate-500">
                                Liquida automáticamente los intereses devengados según la TIR anual del proyecto a todos los inversores activos.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleDistributeYield} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                Contrato Energético (PPA)
                            </label>
                            <select
                                value={selectedContractId}
                                onChange={(e) => setSelectedContractId(e.target.value)}
                                className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm font-medium bg-white"
                            >
                                {contracts.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} — TIR {c.annualReturn}% ({c.investorsCount} inv. • ${c.currentRaised.toLocaleString()} recaudados)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                Moneda & Periodo
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={yieldCurrency}
                                    onChange={(e) => setYieldCurrency(e.target.value as 'USD' | 'USDC')}
                                    className="w-1/2 h-11 px-2.5 rounded-lg border border-gray-300 text-sm font-bold bg-white"
                                >
                                    <option value="USD">USD (Fiat)</option>
                                    <option value="USDC">USDC (Web3)</option>
                                </select>
                                <select
                                    value={yieldMonths}
                                    onChange={(e) => setYieldMonths(Number(e.target.value))}
                                    className="w-1/2 h-11 px-2.5 rounded-lg border border-gray-300 text-sm font-medium bg-white"
                                >
                                    <option value={1}>1 Mes</option>
                                    <option value={3}>Trimestre (3m)</option>
                                    <option value={6}>Semestre (6m)</option>
                                    <option value={12}>Anual (12m)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isDistributing || !selectedContractId}
                                className="w-full h-11 bg-primary hover:brightness-95 text-black font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[20px]">payments</span>
                                {isDistributing ? 'Dispersando...' : 'Dispersar Rendimientos'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Filtros de Estado */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                        {([
                            { key: 'ALL', label: 'Todas las Operaciones' },
                            { key: 'PENDING', label: 'Pendientes de Aprobación' },
                            { key: 'COMPLETED', label: 'Completadas' },
                            { key: 'REJECTED', label: 'Rechazadas' },
                        ] as const).map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                                    statusFilter === tab.key
                                        ? 'bg-black text-primary'
                                        : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabla del Libro Mayor (Ledger) */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="px-6 py-4">Inversor</th>
                                    <th className="px-6 py-4">Operación / Riel</th>
                                    <th className="px-6 py-4">Monto Neto</th>
                                    <th className="px-6 py-4">Detalle / On-Chain / Ref</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4 text-right">Acción Tesorería</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            Cargando libro mayor de transacciones...
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            No se encontraron transacciones para este filtro.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">
                                                    {[tx.user.firstName, tx.user.lastName].filter(Boolean).join(' ') || 'Inversor'}
                                                </div>
                                                <div className="text-xs text-slate-500">{tx.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    {getTypeBadge(tx.type)}
                                                    <span className="text-[11px] text-slate-500 font-medium">
                                                        Riel: {tx.paymentRail} {tx.networkName ? `(${tx.networkName})` : ''}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900">
                                                ${tx.netAmount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}{' '}
                                                <span className="text-xs font-bold text-slate-500">{tx.currency}</span>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="text-xs text-slate-700 truncate" title={tx.description || ''}>
                                                    {tx.description}
                                                </p>
                                                {tx.bankReference && (
                                                    <span className="inline-block mt-1 text-[11px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-700">
                                                        Ref: {tx.bankReference}
                                                    </span>
                                                )}
                                                {tx.txHash && (
                                                    <span className="inline-block mt-1 text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono">
                                                        tx: {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                                                    </span>
                                                )}
                                                {tx.receiptUrl && (
                                                    <a
                                                        href={tx.receiptUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 ml-2 text-xs text-blue-600 hover:underline font-semibold"
                                                    >
                                                        Ver recibo
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        tx.status === 'COMPLETED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : tx.status === 'PENDING'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {tx.status === 'COMPLETED'
                                                        ? 'Completada'
                                                        : tx.status === 'PENDING'
                                                        ? 'Pendiente'
                                                        : tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {new Date(tx.createdAt).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {tx.status === 'PENDING' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleReview(tx.id, 'APPROVE')}
                                                            disabled={processingId === tx.id}
                                                            className="px-3 py-1.5 bg-primary hover:brightness-95 text-black text-xs font-bold rounded-lg shadow-xs disabled:opacity-50"
                                                        >
                                                            Aprobar
                                                        </button>
                                                        <button
                                                            onClick={() => handleReview(tx.id, 'REJECT')}
                                                            disabled={processingId === tx.id}
                                                            className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg disabled:opacity-50"
                                                        >
                                                            Rechazar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Verificada</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
