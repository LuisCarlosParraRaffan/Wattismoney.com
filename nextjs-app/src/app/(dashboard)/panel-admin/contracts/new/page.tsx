'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// Type definition for form data
type ContractFormData = {
    name: string;
    contractType: string;
    contractSubtype: string;
    energyType: string;
    annualReturn: number;
    financingGoal: number;
    minInvestment: number;
    maxInvestment: number;
    generatorName: string;
    buyerName: string;
    buyerIndustry: string;
    energyVolume: number; // MWh
    termDuration: number;
    termUnit: string;
    co2Avoided: number;
};

export default function NewContractPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Form Hook
    const { register, handleSubmit, formState: { errors } } = useForm<ContractFormData>();

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image Upload Handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'contract-image');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Error al subir imagen');

            const data = await response.json();
            setImageUrl(data.url);
        } catch (error) {
            console.error(error);
            setUploadError('No se pudo subir la imagen. Intente de nuevo.');
        } finally {
            setUploadingImage(false);
        }
    };

    // Submission Handler
    const onSubmit = async (data: ContractFormData, action: 'draft' | 'publish') => {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                imageUrl,
                action
            };

            const response = await fetch('/api/admin/contracts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Error al guardar el contrato');

            const result = await response.json();
            if (result.success) {
                // Redirect back to contract list or dashboard
                router.push('/panel-admin/contracts');
                router.refresh();
            }

        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al guardar el contrato.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto px-6 py-10 font-sans text-slate-900">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
                        <span className="hover:underline cursor-pointer" onClick={() => router.push('/panel-admin/contracts')}>Contratos</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="font-bold text-black">Nuevo Contrato</span>
                    </div>
                    <h1 className="text-4xl font-black text-black leading-tight">Admin: Nuevo/Editar Contrato</h1>
                    <p className="text-slate-500 mt-2 text-lg">Panel de administración para la creación y edición de contratos de energía.</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                        onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-xl h-12 px-6 bg-white border-2 border-primary text-black text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Guardar Borrador
                    </button>
                    <button
                        onClick={handleSubmit((data) => onSubmit(data, 'publish'))}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-xl h-12 px-8 bg-primary text-black text-sm font-bold shadow-md hover:bg-[#d1df0c] transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Guardando...' : 'Publicar Contrato'}
                    </button>
                </div>
            </div>

            <form className="space-y-8">

                {/* 1. Imagen Promocional */}
                <section className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <span className="material-symbols-outlined text-black">image</span>
                        </div>
                        <h2 className="text-xl font-bold text-black">Imagen Promocional</h2>
                    </div>

                    <div className="w-full">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative group cursor-pointer w-full aspect-[21/9] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden 
                                ${imageUrl ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50 hover:bg-primary/5 hover:border-primary'}
                            `}
                        >
                            {imageUrl ? (
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-bold">Clic para cambiar imagen</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center p-6 text-center">
                                    {uploadingImage ? (
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500 mb-2"></div>
                                    ) : (
                                        <span className="material-symbols-outlined text-5xl text-gray-400 group-hover:text-primary mb-3 transition-colors">cloud_upload</span>
                                    )}
                                    <p className="text-lg font-bold text-gray-700">
                                        {uploadingImage ? 'Subiendo...' : 'Arrastra tu imagen aquí o haz clic para subir'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Soporta JPG y PNG de alta resolución</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept=".jpg, .jpeg, .png"
                                className="hidden"
                                type="file"
                            />
                        </div>
                        {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                    </div>
                </section>

                {/* 2. Detalles y Finanzas */}
                <section className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 p-8">
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
                                {...register('name', { required: true })}
                                className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all placeholder:text-gray-400"
                                placeholder="Ej: Parque Solar Almería III"
                                type="text"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Tipo de contrato</label>
                            <select {...register('contractType')} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all">
                                <option value="">Seleccionar tipo</option>
                                <option value="Infraestructura">Infraestructura</option>
                                <option value="Liquidez">Liquidez en contratos</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Subtipo de contrato</label>
                            <select {...register('contractSubtype')} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all">
                                <option value="">Seleccionar subtipo</option>
                                <option value="Proyecto solar">Proyecto solar</option>
                                <option value="Proyecto eólico">Proyecto eólico</option>
                                <option value="Infraestructura de carga">Infraestructura de carga</option>
                                <option value="Smart grids">Smart grids</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Tipo de energía</label>
                            <select {...register('energyType')} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all">
                                <option value="">Seleccionar tipo</option>
                                <option value="Energía Solar Fotovoltaica">Energía Solar Fotovoltaica</option>
                                <option value="Energía Eólica Onshore">Energía Eólica Onshore</option>
                                <option value="Energía Eólica Offshore">Energía Eólica Offshore</option>
                                <option value="Biomasa">Biomasa</option>
                                <option value="Hidroeléctrica">Hidroeléctrica</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Rentabilidad anual (%) *</label>
                            <div className="relative">
                                <input
                                    {...register('annualReturn', { required: true })}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-4 pr-10 transition-all font-medium"
                                    placeholder="0.00"
                                    step="0.01"
                                    type="number"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Meta financiación ($) *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                <input
                                    {...register('financingGoal', { required: true })}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-8 pr-4 transition-all font-medium"
                                    placeholder="0.00"
                                    type="number"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Inversión mínima ($)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                                    <input
                                        {...register('minInvestment')}
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-6 pr-3 transition-all font-medium text-sm"
                                        placeholder="Min"
                                        type="number"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Inversión máxima ($)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                                    <input
                                        {...register('maxInvestment')}
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-6 pr-3 transition-all font-medium text-sm"
                                        placeholder="Max"
                                        type="number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Especificaciones */}
                <section className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <span className="material-symbols-outlined text-black">tune</span>
                        </div>
                        <h2 className="text-xl font-bold text-black">Especificaciones</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Generador energético</label>
                            <input {...register('generatorName')} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all" placeholder="Nombre de la empresa generadora" type="text" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Empresa compradora</label>
                            <input {...register('buyerName')} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all" placeholder="Nombre del off-taker" type="text" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Industria del comprador</label>
                            <select {...register('buyerIndustry')} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all">
                                <option value="">Seleccionar industria</option>
                                <option value="Tecnología">Tecnología</option>
                                <option value="Manufactura">Manufactura</option>
                                <option value="Transporte">Transporte</option>
                                <option value="Retail">Retail</option>
                                <option value="Minería">Minería</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Volumen energía (Total MWh)</label>
                            <input {...register('energyVolume')} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all" placeholder="0" type="number" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Plazo</label>
                            <div className="flex gap-2">
                                <input {...register('termDuration')} className="flex-1 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all" placeholder="Duración" type="number" />
                                <select {...register('termUnit')} className="w-32 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 px-4 transition-all">
                                    <option value="Años">Años</option>
                                    <option value="Meses">Meses</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">CO2 evitado (toneladas)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">co2</span>
                                <input {...register('co2Avoided')} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary h-12 pl-10 px-4 transition-all" placeholder="0" type="number" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Documentos (Placeholder) */}
                <section className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 p-8 opacity-60">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <span className="material-symbols-outlined text-black">description</span>
                        </div>
                        <h2 className="text-xl font-bold text-black">Documentos (Próximamente)</h2>
                    </div>
                    <p className="text-sm text-gray-500">La carga de documentos PPA y auditorías estará disponible en la siguiente versión.</p>
                </section>

            </form>
        </div>
    );
}
