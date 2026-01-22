'use client';

import React, { useState, useEffect } from 'react';

interface KycDocument {
    id: string;
    userId: string;
    documentType: string;
    documentNumber: string | null;
    frontImageUrl: string | null;
    backImageUrl: string | null;
    selfieUrl: string | null;
    addressProofUrl: string | null;
    status: string;
    submittedAt: string;
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
}

export default function AdminKycPage() {
    const [kycDocs, setKycDocs] = useState<KycDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('Imagen borrosa');

    useEffect(() => {
        fetchKycDocs();
    }, []);

    const fetchKycDocs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/panel-admin/kyc');
            if (!res.ok) throw new Error('Error al cargar documentos KYC');
            const data = await res.json();
            setKycDocs(data.documents || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (documentId: string) => {
        setProcessingId(documentId);
        try {
            const res = await fetch('/api/panel-admin/kyc', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentId, action: 'approve' }),
            });
            if (!res.ok) throw new Error('Error al aprobar');
            fetchKycDocs();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (documentId: string) => {
        setProcessingId(documentId);
        try {
            const res = await fetch('/api/panel-admin/kyc', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentId, action: 'reject', reason: rejectReason }),
            });
            if (!res.ok) throw new Error('Error al rechazar');
            setRejectingId(null);
            fetchKycDocs();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error');
        } finally {
            setProcessingId(null);
        }
    };

    const getInitials = (doc: KycDocument) => {
        const first = doc.user.firstName?.[0] || doc.user.email[0];
        const last = doc.user.lastName?.[0] || '';
        return (first + last).toUpperCase();
    };

    const getInitialsBgColor = (index: number) => {
        const colors = ['bg-purple-100 text-purple-600', 'bg-green-100 text-green-600', 'bg-blue-100 text-blue-600', 'bg-orange-100 text-orange-600'];
        return colors[index % colors.length];
    };

    const getDocTypeBadge = (type: string) => {
        const config: Record<string, { bg: string; label: string }> = {
            DNI: { bg: 'bg-blue-100 text-blue-800', label: 'DNI / NIE' },
            NIE: { bg: 'bg-blue-100 text-blue-800', label: 'DNI / NIE' },
            PASSPORT: { bg: 'bg-purple-100 text-purple-800', label: 'Pasaporte' },
            DRIVERS_LICENSE: { bg: 'bg-green-100 text-green-800', label: 'Licencia' },
        };
        const c = config[type] || { bg: 'bg-gray-100 text-gray-800', label: type };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg}`}>
                {c.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    const filteredDocs = kycDocs.filter(doc => {
        const searchLower = searchTerm.toLowerCase();
        return (
            doc.user.email.toLowerCase().includes(searchLower) ||
            (doc.user.firstName || '').toLowerCase().includes(searchLower) ||
            (doc.user.lastName || '').toLowerCase().includes(searchLower) ||
            (doc.documentNumber || '').toLowerCase().includes(searchLower)
        );
    });

    return (
        <>
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 shrink-0">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-black">
                    <span className="material-symbols-outlined text-yellow-500">verified</span>
                    Gestión de KYC de Usuarios
                </h1>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Buscar por nombre, email o DNI..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                                Filtrar: Pendientes
                            </button>
                            <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">sort</span>
                                Ordenar: Fecha
                            </button>
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                            <th className="px-6 py-4">Usuario</th>
                                            <th className="px-6 py-4">Tipo Documento</th>
                                            <th className="px-6 py-4">Doc. Frontal</th>
                                            <th className="px-6 py-4">Doc. Trasero</th>
                                            <th className="px-6 py-4">Selfie</th>
                                            <th className="px-6 py-4">Residencia</th>
                                            <th className="px-6 py-4">Fecha Envío</th>
                                            <th className="px-6 py-4 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredDocs.map((doc, index) => {
                                            const dateInfo = formatDate(doc.submittedAt);
                                            const isRejecting = rejectingId === doc.id;

                                            return (
                                                <tr
                                                    key={doc.id}
                                                    className={`hover:bg-gray-50 transition-colors ${isRejecting ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${getInitialsBgColor(index)}`}>
                                                                {getInitials(doc)}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {doc.user.firstName && doc.user.lastName
                                                                        ? `${doc.user.firstName} ${doc.user.lastName}`
                                                                        : doc.user.email.split('@')[0]
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500">{doc.user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getDocTypeBadge(doc.documentType)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {doc.frontImageUrl ? (
                                                            <a href={doc.frontImageUrl} target="_blank" rel="noopener noreferrer" className="group relative h-12 w-20 bg-gray-200 rounded overflow-hidden cursor-pointer border border-gray-300 block">
                                                                <img src={doc.frontImageUrl} alt="Doc frontal" className="h-full w-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-white text-lg">visibility</span>
                                                                </div>
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">No disponible</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {doc.backImageUrl ? (
                                                            <a href={doc.backImageUrl} target="_blank" rel="noopener noreferrer" className="group relative h-12 w-20 bg-gray-200 rounded overflow-hidden cursor-pointer border border-gray-300 block">
                                                                <img src={doc.backImageUrl} alt="Doc trasero" className="h-full w-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-white text-lg">visibility</span>
                                                                </div>
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {doc.selfieUrl ? (
                                                            <a href={doc.selfieUrl} target="_blank" rel="noopener noreferrer" className="group relative h-12 w-12 rounded-full bg-gray-200 overflow-hidden cursor-pointer border border-gray-300 block">
                                                                <img src={doc.selfieUrl} alt="Selfie" className="h-full w-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-white text-lg">face</span>
                                                                </div>
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">No disponible</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {doc.addressProofUrl ? (
                                                            <a href={doc.addressProofUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                                                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                                                <span className="text-sm">Ver PDF</span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">No disponible</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {dateInfo.date}<br />
                                                        <span className="text-xs">{dateInfo.time}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {isRejecting ? (
                                                            <div className="flex flex-col gap-2">
                                                                <label className="block text-xs font-semibold text-red-700">Razón del rechazo:</label>
                                                                <div className="flex gap-2">
                                                                    <select
                                                                        value={rejectReason}
                                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                                        className="w-full text-xs rounded border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    >
                                                                        <option>Imagen borrosa</option>
                                                                        <option>Documento vencido</option>
                                                                        <option>Datos no coinciden</option>
                                                                        <option>Documento ilegible</option>
                                                                        <option>Otro</option>
                                                                    </select>
                                                                    <button
                                                                        onClick={() => handleReject(doc.id)}
                                                                        disabled={processingId === doc.id}
                                                                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded disabled:opacity-50"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">send</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setRejectingId(null)}
                                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-1 rounded"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleApprove(doc.id)}
                                                                    disabled={processingId === doc.id}
                                                                    className="bg-primary hover:brightness-95 text-black font-semibold px-3 py-1.5 rounded-md shadow-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">check</span>
                                                                    Aprobar
                                                                </button>
                                                                <button
                                                                    onClick={() => setRejectingId(doc.id)}
                                                                    disabled={processingId === doc.id}
                                                                    className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                                    Rechazar
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredDocs.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">verified_user</span>
                                                    No hay documentos KYC pendientes de revisión
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Mostrando <span className="font-medium text-gray-900">{filteredDocs.length}</span> solicitudes
                                </div>
                                <div className="flex gap-1">
                                    <button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50">«</button>
                                    <button className="px-3 py-1 border border-primary bg-primary text-black font-bold rounded">1</button>
                                    <button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50">»</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
