'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { TREASURY_BANK_DETAILS } from '@/lib/web3-config';

export interface BankTransferResult {
    reference: string;
    amountCop: number;
    expectedReturn: number;
    trm: number | null;
}

interface Props {
    contractId: string;
    contractName: string;
    initialAmountCop: number;
    minInvestment: number;
    maxInvestment: number;
    onClose: () => void;
    onSuccess: (result: BankTransferResult) => void;
}

const formatCop = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
const formatUsd = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

/**
 * Checkout de inversión por transferencia bancaria en pesos colombianos.
 * El inversionista transfiere a la cuenta recaudadora y registra su comprobante;
 * la inversión queda PENDIENTE hasta que Tesorería valida el abono.
 */
export default function BankTransferCheckout({
    contractId,
    contractName,
    initialAmountCop,
    minInvestment,
    maxInvestment,
    onClose,
    onSuccess,
}: Props) {
    const [inputCurrency, setInputCurrency] = useState<'COP' | 'USD'>('COP');
    const [amount, setAmount] = useState<number>(initialAmountCop);
    const [trm, setTrm] = useState<number | null>(null);
    const [trmError, setTrmError] = useState(false);
    const [bankReference, setBankReference] = useState('');
    const [receiptUrl, setReceiptUrl] = useState('');
    const [receiptName, setReceiptName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/trm')
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error('TRM'))))
            .then((data: { value: number }) => {
                if (!cancelled) setTrm(Number(data.value));
            })
            .catch(() => {
                if (!cancelled) setTrmError(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const amountCop = useMemo(() => {
        if (!Number.isFinite(amount) || amount <= 0) return 0;
        if (inputCurrency === 'COP') return Math.round(amount);
        return trm ? Math.round(amount * trm) : 0;
    }, [amount, inputCurrency, trm]);

    const amountIssue = useMemo(() => {
        if (amountCop <= 0) return 'Ingresa un monto válido.';
        if (amountCop < minInvestment) return `El monto mínimo es ${formatCop(minInvestment)}.`;
        if (maxInvestment > 0 && amountCop > maxInvestment) return `El monto máximo es ${formatCop(maxInvestment)}.`;
        return null;
    }, [amountCop, minInvestment, maxInvestment]);

    const switchCurrency = (next: 'COP' | 'USD') => {
        if (next === inputCurrency) return;
        if (trm && amount > 0) {
            setAmount(next === 'USD' ? Math.round((amount / trm) * 100) / 100 : Math.round(amount * trm));
        }
        setInputCurrency(next);
    };

    const handleReceiptUpload = async (file: File | undefined) => {
        if (!file) return;
        setIsUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'receipt');
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'No se pudo subir el comprobante');
            setReceiptUrl(data.url);
            setReceiptName(file.name);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo subir el comprobante');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch('/api/payments/fiat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contractId,
                    amount,
                    inputCurrency,
                    bankReference: bankReference.trim(),
                    receiptUrl: receiptUrl || undefined,
                    acceptedTerms,
                    rail: 'BANK_TRANSFER',
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'No se pudo registrar la inversión');
            onSuccess({
                reference: data.reference,
                amountCop: Number(data.amountCop),
                expectedReturn: Number(data.investment?.expectedReturn ?? 0),
                trm: data.trm ?? null,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    };

    const bankReady = TREASURY_BANK_DETAILS.configured;
    const canSubmit =
        bankReady && !amountIssue && bankReference.trim().length >= 4 && acceptedTerms && !isSubmitting && !isUploading;

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
        >
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-gray-200 my-8">
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-primary/30 text-black rounded-full">
                            Transferencia bancaria · COP
                        </span>
                        <h3 id="checkout-title" className="text-xl font-black text-slate-900 mt-1">
                            Invertir en {contractName}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Paso 1: monto */}
                <section className="space-y-2 mb-5">
                    <p className="text-xs font-bold text-slate-700 uppercase">1. Monto de tu inversión</p>
                    <div className="flex gap-2">
                        <div className="flex rounded-xl border border-gray-300 overflow-hidden shrink-0">
                            {(['COP', 'USD'] as const).map((cur) => (
                                <button
                                    key={cur}
                                    type="button"
                                    disabled={cur === 'USD' && !trm}
                                    onClick={() => switchCurrency(cur)}
                                    className={`px-3.5 text-xs font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                                        inputCurrency === cur ? 'bg-black text-primary' : 'bg-white text-slate-600'
                                    }`}
                                >
                                    {cur}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            inputMode="decimal"
                            aria-label={`Monto en ${inputCurrency}`}
                            className="flex-1 h-12 px-4 border border-gray-300 rounded-xl font-black text-lg outline-none focus:ring-2 focus:ring-primary"
                            value={Number.isFinite(amount) ? amount : ''}
                            min={0}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap justify-between gap-x-4">
                        <span>
                            Vas a transferir: <strong className="text-slate-900">{formatCop(amountCop)}</strong>
                            {trm && amountCop > 0 ? ` (≈ ${formatUsd(amountCop / trm)})` : ''}
                        </span>
                        <span>
                            {trm
                                ? `TRM del día: ${formatCop(trm)} por USD`
                                : trmError
                                ? 'TRM no disponible: ingresa el monto en COP'
                                : 'Consultando TRM…'}
                        </span>
                    </div>
                    {amountIssue && <p className="text-xs text-red-600 font-medium">{amountIssue}</p>}
                </section>

                {/* Paso 2: cuenta recaudadora */}
                <section className="space-y-2 mb-5">
                    <p className="text-xs font-bold text-slate-700 uppercase">2. Transfiere a la cuenta recaudadora</p>
                    {bankReady ? (
                        <dl className="p-4 rounded-xl bg-slate-50 border border-gray-200 text-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                            <dt className="text-slate-500">Banco</dt>
                            <dd className="font-bold text-slate-900">{TREASURY_BANK_DETAILS.bankName}</dd>
                            {TREASURY_BANK_DETAILS.accountType && (
                                <>
                                    <dt className="text-slate-500">Tipo de cuenta</dt>
                                    <dd className="font-bold text-slate-900">{TREASURY_BANK_DETAILS.accountType}</dd>
                                </>
                            )}
                            <dt className="text-slate-500">Número</dt>
                            <dd className="font-mono font-bold text-slate-900">{TREASURY_BANK_DETAILS.accountNumber}</dd>
                            <dt className="text-slate-500">Titular</dt>
                            <dd className="font-bold text-slate-900">{TREASURY_BANK_DETAILS.beneficiary}</dd>
                            {TREASURY_BANK_DETAILS.beneficiaryId && (
                                <>
                                    <dt className="text-slate-500">NIT</dt>
                                    <dd className="font-bold text-slate-900">{TREASURY_BANK_DETAILS.beneficiaryId}</dd>
                                </>
                            )}
                            <dt className="text-slate-500">Valor exacto</dt>
                            <dd className="font-black text-slate-900">{formatCop(amountCop)}</dd>
                        </dl>
                    ) : (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
                            La cuenta recaudadora del proyecto está en proceso de configuración. Podrás invertir en
                            cuanto esté disponible.
                        </div>
                    )}
                </section>

                {/* Paso 3: comprobante */}
                <section className="space-y-2 mb-5">
                    <p className="text-xs font-bold text-slate-700 uppercase">3. Registra tu comprobante</p>
                    <input
                        type="text"
                        value={bankReference}
                        onChange={(e) => setBankReference(e.target.value)}
                        placeholder="Número de comprobante o aprobación de la transferencia *"
                        aria-label="Número de comprobante de la transferencia"
                        maxLength={64}
                        className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-sm font-mono"
                    />
                    <label className="flex items-center justify-between gap-3 h-11 px-3 rounded-lg border border-dashed border-gray-300 text-sm text-slate-600 cursor-pointer hover:bg-slate-50">
                        <span className="truncate">
                            {isUploading
                                ? 'Subiendo comprobante…'
                                : receiptName || 'Adjuntar comprobante (PDF o imagen, recomendado)'}
                        </span>
                        <span className="material-symbols-outlined text-[18px]">
                            {receiptUrl ? 'check_circle' : 'upload_file'}
                        </span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,application/pdf"
                            className="hidden"
                            onChange={(e) => handleReceiptUpload(e.target.files?.[0])}
                        />
                    </label>
                </section>

                <label className="flex items-start gap-2.5 text-xs text-slate-600 mb-4 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-0.5"
                    />
                    <span>
                        Declaro que revisé la información del proyecto y entiendo que esta inversión implica riesgo de
                        pérdida parcial o total del capital, y que la rentabilidad mostrada es una estimación, no una
                        garantía.
                    </span>
                </label>

                {error && (
                    <div role="alert" className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    className="w-full h-12 bg-primary hover:brightness-95 text-black font-black rounded-xl shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Registrando…' : `Registrar inversión de ${formatCop(amountCop)}`}
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-3">
                    Tu inversión queda pendiente hasta que Tesorería valide el abono en la cuenta recaudadora.
                </p>
            </div>
        </div>
    );
}
