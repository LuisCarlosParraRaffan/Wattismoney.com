'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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
    termValue: string;
    termUnit: 'years' | 'months';
    co2Emissions: string;
    status: string;
}

interface UploadedDocument {
    id: string;
    name: string;
    url: string;
    size: string;
    uploadedAt: string;
}

export default function EditContractPage() {
    const router = useRouter();
    const params = useParams();
    const contractId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

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
        energyType: '',
        energyAmount: '',
        termValue: '',
        termUnit: 'years',
        co2Emissions: '',
        status: 'DRAFT',
    });

    useEffect(() => {
        fetchContract();
    }, [contractId]);

    const fetchContract = async () => {
        try {
            const res = await fetch(`/api/admin/contracts/${contractId}`);
            if (!res.ok) throw new Error('Error al cargar el contrato');
            const data = await res.json();

            const termMonths = data.contract.termMonths || 12;
            const isYears = termMonths >= 12 && termMonths % 12 === 0;

            setFormData({
                name: data.contract.name || '',
                description: data.contract.description || '',
                imageUrl: data.contract.imageUrl || '',
                annualReturn: data.contract.annualReturn?.toString() || '',
                totalCapacity: data.contract.totalCapacity?.toString() || '',
                minInvestment: data.contract.minInvestment?.toString() || '',
                maxInvestment: data.contract.maxInvestment?.toString() || '',
                generator: data.contract.generator || '',
                generatorLocation: data.contract.generatorLocation || '',
                buyer: data.contract.buyer || '',
                buyerIndustry: data.contract.buyerIndustry || '',
                energyType: data.contract.energyType || '',
                energyAmount: data.contract.energyAmount?.toString() || '',
                termValue: isYears ? (termMonths / 12).toString() : termMonths.toString(),
                termUnit: isYears ? 'years' : 'months',
                co2Emissions: data.contract.co2Emissions?.toString() || '',
                status: data.contract.status || 'DRAFT',
            });

            if (data.contract.documents?.length) {
                setUploadedDocuments(data.contract.documents.map((doc: any) => ({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    size: doc.size ? `${Math.round(doc.size / 1024)} KB` : 'PDF',
                    uploadedAt: new Date(doc.uploadedAt).toLocaleDateString(),
                })));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const parseNumber = (value: string): number => {
        const cleaned = value.replace(/,/g, '');
        return parseFloat(cleaned) || 0;
    };

    const getTermMonths = (): number => {
        const value = parseInt(formData.termValue) || 0;
        return formData.termUnit === 'years' ? value * 12 : value;
    };

    const buildContractPayload = (status: string) => ({
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl || null,
        annualReturn: parseNumber(formData.annualReturn),
        totalCapacity: parseNumber(formData.totalCapacity),
        minInvestment: parseNumber(formData.minInvestment),
        maxInvestment: parseNumber(formData.maxInvestment),
        generator: formData.generator,
        generatorLocation: formData.generatorLocation || null,
        buyer: formData.buyer,
        buyerIndustry: formData.buyerIndustry,
        energyType: formData.energyType,
        energyAmount: parseNumber(formData.energyAmount),
        termMonths: getTermMonths(),
        co2Emissions: parseNumber(formData.co2Emissions),
        status,
    });

    const validateForm = (): string | null => {
        if (!formData.name.trim()) return 'El nombre del contrato es obligatorio';
        if (!formData.energyType) return 'Selecciona el tipo de energía';
        if (!formData.annualReturn) return 'La rentabilidad anual es obligatoria';
        if (!formData.totalCapacity) return 'La meta de financiación es obligatoria';
        if (!formData.generator.trim()) return 'El generador energético es obligatorio';
        if (!formData.buyer.trim()) return 'La empresa compradora es obligatoria';
        if (!formData.termValue) return 'El plazo es obligatorio';
        return null;
    };

    const handleSaveDraft = async () => {
        setError(null);
        setIsSubmitting(true);

        try {
            const payload = buildContractPayload('DRAFT');
            const res = await fetch(`/api/admin/contracts/${contractId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al guardar');
            }

            router.push('/admin/contracts');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePublish = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const payload = buildContractPayload('ACTIVE');
            const res = await fetch(`/api/admin/contracts/${contractId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al publicar');
            }

            router.push('/admin/contracts');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeDocument = async (docId: string) => {
        try {
            const res = await fetch(`/api/admin/contracts/${contractId}/documents?documentId=${docId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setUploadedDocuments(prev => prev.filter(d => d.id !== docId));
            }
        } catch (err) {
            console.error('Error deleting document:', err);
        }
    };

    const handleImageUpload = async (file: File) => {
        setIsUploadingImage(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'contract-image');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al subir imagen');
            }

            const data = await res.json();
            setFormData(prev => ({ ...prev, imageUrl: data.url }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al subir imagen');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleDocumentUpload = async (files: FileList) => {
        setIsUploadingDoc(true);
        setError(null);
        try {
            for (const file of Array.from(files)) {
                // 1. Upload to storage
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', 'contract-document');

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const data = await uploadRes.json();
                    throw new Error(data.error || 'Error al subir documento');
                }

                const uploadData = await uploadRes.json();

                // 2. Save to database
                const docRes = await fetch(`/api/admin/contracts/${contractId}/documents`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: file.name,
                        url: uploadData.url,
                        type: 'contract',
                        size: file.size,
                    }),
                });

                if (!docRes.ok) {
                    throw new Error('Error al guardar documento');
                }

                const docData = await docRes.json();
                setUploadedDocuments(prev => [...prev, {
                    id: docData.document.id,
                    name: file.name,
                    url: uploadData.url,
                    size: `${Math.round(file.size / 1024)} KB`,
                    uploadedAt: new Date().toLocaleDateString(),
                }]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al subir documentos');
        } finally {
            setIsUploadingDoc(false);
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, { text: string; color: string }> = {
            DRAFT: { text: 'Borrador', color: 'bg-gray-100 text-gray-800' },
            ACTIVE: { text: 'Activo', color: 'bg-blue-100 text-blue-800' },
            FUNDED: { text: 'Financiado', color: 'bg-green-100 text-green-800' },
            COMPLETED: { text: 'Completado', color: 'bg-green-100 text-green-800' },
            CANCELLED: { text: 'Cancelado', color: 'bg-red-100 text-red-800' },
        };
        return labels[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const statusInfo = getStatusLabel(formData.status);

    return (
        <>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-6 shrink-0">
                <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                            <Link href="/admin/contracts" className="hover:underline">Contratos</Link>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                            <span className="font-bold text-black">Editar Contrato</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-black leading-tight">Editar Contrato</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                                {statusInfo.text}
                            </span>
                        </div>
                        <p className="text-gray-500 mt-1">Panel de administración para la edición de contratos de energía.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSaveDraft}
                            disabled={isSubmitting}
                            className="flex items-center justify-center rounded-xl h-12 px-6 bg-white border-2 border-primary text-black text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Guardar Borrador
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isSubmitting}
                            className="flex items-center justify-center rounded-xl h-12 px-8 bg-primary text-black text-sm font-bold shadow-md hover:brightness-95 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Publicar Contrato'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    {/* Section 1: Imagen Promocional */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <span className="material-symbols-outlined text-black">image</span>
                            </div>
                            <h2 className="text-xl font-bold text-black">Imagen Promocional</h2>
                            {isUploadingImage && (
                                <span className="text-sm text-gray-500 animate-pulse">Subiendo...</span>
                            )}
                        </div>
                        <div className="w-full">
                            {formData.imageUrl ? (
                                <div className="relative group w-full aspect-[21/9] rounded-xl overflow-hidden border border-gray-200">
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                            className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm"
                                        >
                                            Cambiar imagen
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative group cursor-pointer w-full aspect-[21/9] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-primary/5 hover:border-primary transition-all flex flex-col items-center justify-center overflow-hidden">
                                    <div className="flex flex-col items-center p-6 text-center">
                                        {isUploadingImage ? (
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-3"></div>
                                        ) : (
                                            <span className="material-symbols-outlined text-5xl text-gray-400 group-hover:text-primary mb-3 transition-colors">cloud_upload</span>
                                        )}
                                        <p className="text-lg font-bold text-gray-700">Arrastra tu imagen aquí o haz clic para subir</p>
                                        <p className="text-sm text-gray-500 mt-1">Soporta JPG y PNG de alta resolución (máx 10MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        disabled={isUploadingImage}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                handleImageUpload(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Section 2: Detalles y Finanzas */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <span className="material-symbols-outlined text-black">payments</span>
                            </div>
                            <h2 className="text-xl font-bold text-black">Detalles y Finanzas</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-700">Nombre del Contrato *</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all placeholder:text-gray-400"
                                    placeholder="Ej: Parque Solar Almería III"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Tipo de energía *</label>
                                <select
                                    name="energyType"
                                    value={formData.energyType}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all"
                                >
                                    <option value="" disabled>Seleccionar tipo</option>
                                    <option value="SOLAR">Energía Solar Fotovoltaica</option>
                                    <option value="WIND">Energía Eólica Onshore</option>
                                    <option value="WIND_OFFSHORE">Energía Eólica Offshore</option>
                                    <option value="BIOMASS">Biomasa</option>
                                    <option value="HYDRO">Hidroeléctrica</option>
                                    <option value="GEOTHERMAL">Geotérmica</option>
                                    <option value="HYBRID">Híbrido</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Rentabilidad anual (%) *</label>
                                <div className="relative">
                                    <input
                                        name="annualReturn"
                                        value={formData.annualReturn}
                                        onChange={handleChange}
                                        type="number"
                                        step="0.1"
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-4 pr-10 transition-all font-medium"
                                        placeholder="0.00"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Meta financiación ($) *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                    <input
                                        name="totalCapacity"
                                        value={formData.totalCapacity}
                                        onChange={handleChange}
                                        type="number"
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-8 pr-4 transition-all font-medium"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Inversión mínima ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                                        <input
                                            name="minInvestment"
                                            value={formData.minInvestment}
                                            onChange={handleChange}
                                            type="number"
                                            className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-6 pr-3 transition-all font-medium text-sm"
                                            placeholder="Min"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Inversión máxima ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                                        <input
                                            name="maxInvestment"
                                            value={formData.maxInvestment}
                                            onChange={handleChange}
                                            type="number"
                                            className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-6 pr-3 transition-all font-medium text-sm"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Especificaciones */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <span className="material-symbols-outlined text-black">tune</span>
                            </div>
                            <h2 className="text-xl font-bold text-black">Especificaciones</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Generador energético *</label>
                                <input
                                    name="generator"
                                    value={formData.generator}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all"
                                    placeholder="Nombre de la empresa generadora"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Empresa compradora *</label>
                                <input
                                    name="buyer"
                                    value={formData.buyer}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all"
                                    placeholder="Nombre del off-taker"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Industria del comprador</label>
                                <select
                                    name="buyerIndustry"
                                    value={formData.buyerIndustry}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all"
                                >
                                    <option value="" disabled>Seleccionar industria</option>
                                    <option value="Tecnología">Tecnología</option>
                                    <option value="Manufactura">Manufactura</option>
                                    <option value="Transporte">Transporte</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Agroindustria">Agroindustria</option>
                                    <option value="Minería">Minería</option>
                                    <option value="Telecomunicaciones">Telecomunicaciones</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Volumen energía (MWh)</label>
                                <input
                                    name="energyAmount"
                                    value={formData.energyAmount}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all"
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Plazo *</label>
                                <div className="flex gap-2">
                                    <input
                                        name="termValue"
                                        value={formData.termValue}
                                        onChange={handleChange}
                                        type="number"
                                        className="flex-1 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all"
                                        placeholder="Duración"
                                    />
                                    <select
                                        name="termUnit"
                                        value={formData.termUnit}
                                        onChange={handleChange}
                                        className="w-32 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all"
                                    >
                                        <option value="years">Años</option>
                                        <option value="months">Meses</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">CO2 evitado (toneladas)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">co2</span>
                                    <input
                                        name="co2Emissions"
                                        value={formData.co2Emissions}
                                        onChange={handleChange}
                                        type="number"
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-10 pr-4 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Documentos */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <span className="material-symbols-outlined text-black">description</span>
                            </div>
                            <h2 className="text-xl font-bold text-black">Documentos</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-primary transition-all cursor-pointer">
                                {isUploadingDoc ? (
                                    <>
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
                                        <p className="text-sm font-bold text-black">Subiendo documentos...</p>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">picture_as_pdf</span>
                                        <p className="text-sm font-bold text-black">Carga múltiple de PDFs</p>
                                        <p className="text-xs text-gray-500 mb-4">Verificaciones legales, contratos, auditorías (máx 10MB)</p>
                                        <span className="px-5 py-2 bg-black text-white text-xs font-bold rounded-lg">Seleccionar Archivos</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept=".pdf"
                                    multiple
                                    disabled={isUploadingDoc}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                                    onChange={(e) => {
                                        if (e.target.files?.length) {
                                            handleDocumentUpload(e.target.files);
                                        }
                                    }}
                                />
                            </div>

                            {uploadedDocuments.length > 0 && (
                                <div className="rounded-xl border border-gray-100 overflow-hidden">
                                    {uploadedDocuments.map((doc, index) => (
                                        <div
                                            key={doc.id}
                                            className={`flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors ${index < uploadedDocuments.length - 1 ? 'border-b border-gray-50' : ''}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-red-50 p-2 rounded-lg text-red-500">
                                                    <span className="material-symbols-outlined">picture_as_pdf</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-black">{doc.name}</p>
                                                    <p className="text-xs text-gray-400">{doc.size} • Subido {doc.uploadedAt}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeDocument(doc.id)}
                                                className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
