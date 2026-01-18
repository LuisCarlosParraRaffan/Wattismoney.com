'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Types
interface ContractFormData {
    name: string;
    description: string;
    imageUrl: string;
    annualReturn: string;
    totalCapacity: string;
    minInvestment: string;
    maxInvestment: string;
    generator: string;
    generatorLocation: string;
    buyer: string;
    buyerIndustry: string;
    energyType: string;
    energyAmount: string;
    termMonths: string;
    co2Emissions: string;
}

export default function NewContractPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ContractFormData>({
        name: '',
        description: '',
        imageUrl: '',
        annualReturn: '',
        totalCapacity: '',
        minInvestment: '',
        maxInvestment: '',
        generator: '',
        generatorLocation: '',
        buyer: '',
        buyerIndustry: '',
        energyType: 'SOLAR',
        energyAmount: '',
        termMonths: '',
        co2Emissions: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveDraft = async () => {
        await handleSubmit('DRAFT');
    };

    const handlePublish = async () => {
        await handleSubmit('ACTIVE');
    };

    const handleSubmit = async (status: 'DRAFT' | 'ACTIVE') => {
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/admin/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    annualReturn: parseFloat(formData.annualReturn) || 0,
                    totalCapacity: parseFloat(formData.totalCapacity.replace(/,/g, '')) || 0,
                    minInvestment: parseFloat(formData.minInvestment.replace(/,/g, '')) || 0,
                    maxInvestment: parseFloat(formData.maxInvestment.replace(/,/g, '')) || 0,
                    energyAmount: parseFloat(formData.energyAmount) || 0,
                    termMonths: parseInt(formData.termMonths) || 12,
                    co2Emissions: parseFloat(formData.co2Emissions) || 0,
                    status,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al crear el contrato');
            }

            router.push('/admin/contracts');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-black">Configuración de Nuevo Contrato</h1>
                    <p className="text-sm text-slate-500">Complete los detalles técnicos, financieros y legales.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSaveDraft}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-white border border-gray-200 text-black text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Guardar Borrador
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary text-black text-sm font-black rounded-lg shadow-md hover:brightness-105 transition-all disabled:opacity-50"
                    >
                        Publicar Contrato
                    </button>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/contracts" className="text-slate-500 text-sm font-medium hover:underline">
                            Contratos
                        </Link>
                        <span className="text-slate-500 text-sm">/</span>
                        <span className="text-black text-sm font-bold">Nuevo Contrato</span>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* 1. Imagen Promocional */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <h2 className="text-lg font-bold px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <span className="text-primary material-symbols-outlined">image</span>
                            1. Imagen Promocional
                        </h2>
                        <div className="p-6">
                            <div className="w-full bg-gray-50 rounded-xl min-h-[200px] border-2 border-dashed border-gray-300 hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer">
                                <span className="material-symbols-outlined text-5xl text-gray-400 mb-2">cloud_upload</span>
                                <p className="text-sm font-bold text-gray-500">Haz clic o arrastra para subir la fotografía</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max. 5MB) - 1200x600px recomendado</p>
                            </div>
                        </div>
                    </section>

                    {/* 2. Detalles del Contrato y Finanzas */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <h2 className="text-lg font-bold px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <span className="text-primary material-symbols-outlined">info</span>
                            2. Detalles del Contrato y Finanzas
                        </h2>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Nombre del Contrato</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                    placeholder="Ej: Planta Solar Fotovoltaica Sevilla I"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Tipo de Energía</label>
                                <select
                                    name="energyType"
                                    value={formData.energyType}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                >
                                    <option value="SOLAR">Energía Solar</option>
                                    <option value="WIND">Energía Eólica</option>
                                    <option value="HYDRO">Hidroeléctrica</option>
                                    <option value="BIOMASS">Biomasa</option>
                                    <option value="GEOTHERMAL">Geotérmica</option>
                                    <option value="HYBRID">Híbrido</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Rentabilidad Anual (%)</label>
                                <div className="relative">
                                    <input
                                        name="annualReturn"
                                        value={formData.annualReturn}
                                        onChange={handleChange}
                                        type="number"
                                        step="0.01"
                                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11 pr-10"
                                        placeholder="7.5"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Meta de Financiación (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        name="totalCapacity"
                                        value={formData.totalCapacity}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11 pl-10"
                                        placeholder="500,000.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Inversión Mínima (USD)</label>
                                <input
                                    name="minInvestment"
                                    value={formData.minInvestment}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                    placeholder="1,000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Inversión Máxima (USD)</label>
                                <input
                                    name="maxInvestment"
                                    value={formData.maxInvestment}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                    placeholder="50,000"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 3. Especificaciones Técnicas */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <h2 className="text-lg font-bold px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <span className="text-primary material-symbols-outlined">bolt</span>
                            3. Especificaciones Técnicas y Emisiones
                        </h2>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Generador Energético</label>
                                <input
                                    name="generator"
                                    value={formData.generator}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                    placeholder="Ej: Iberdrola Renewables"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Ubicación del Generador</label>
                                <input
                                    name="generatorLocation"
                                    value={formData.generatorLocation}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                    placeholder="Ej: Sevilla, España"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Empresa Compradora (Off-taker)</label>
                                <input
                                    name="buyer"
                                    value={formData.buyer}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                    placeholder="Nombre de la corporación compradora"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Industria del Comprador</label>
                                <input
                                    name="buyerIndustry"
                                    value={formData.buyerIndustry}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                    placeholder="Ej: Manufactura, Agroindustria"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Volumen de Energía (MWh)</label>
                                <input
                                    name="energyAmount"
                                    value={formData.energyAmount}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                    placeholder="2500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Plazo del Contrato (meses)</label>
                                <input
                                    name="termMonths"
                                    value={formData.termMonths}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11"
                                    placeholder="120"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold">CO2 Evitado (Toneladas/año)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <span className="material-symbols-outlined text-xl">co2</span>
                                    </span>
                                    <input
                                        name="co2Emissions"
                                        value={formData.co2Emissions}
                                        onChange={handleChange}
                                        type="number"
                                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary h-11 pl-12"
                                        placeholder="450"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. Documentos */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-20">
                        <h2 className="text-lg font-bold px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <span className="text-primary material-symbols-outlined">description</span>
                            4. Documentos Legales (PDF)
                        </h2>
                        <div className="p-6">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50">
                                <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">picture_as_pdf</span>
                                <p className="text-sm font-bold">Sube los documentos de verificación legal</p>
                                <button type="button" className="mt-4 px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                                    Seleccionar Archivos
                                </button>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="bg-white border-t border-gray-200 py-4 px-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                        <span className="text-xs font-medium">Todos los cambios se guardan localmente</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/admin/contracts')}
                            className="px-6 py-3 rounded-lg text-sm font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isSubmitting}
                            className="px-10 py-3 rounded-lg text-sm font-black bg-primary text-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creando...' : 'Crear Contrato'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
