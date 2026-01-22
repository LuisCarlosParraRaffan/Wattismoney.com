'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Listing {
    id: string;
    askingPrice: number;
    originalAmount: number;
    commission: number;
    createdAt: string;
    investment: {
        contract: {
            id: string;
            name: string;
            imageUrl: string | null;
            energyType: string;
            annualReturn: number;
            generatorLocation: string | null;
        };
    };
    seller: {
        id: string;
        firstName: string | null;
    };
}

export default function MercadoSecundario() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuying, setIsBuying] = useState<string | null>(null);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await fetch('/api/listings');
            if (res.ok) {
                const data = await res.json();
                setListings(data.listings || []);
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuy = async (listingId: string) => {
        if (!confirm('¿Confirmas la compra de esta posición?')) return;

        setIsBuying(listingId);
        try {
            const res = await fetch(`/api/listings/${listingId}/buy`, {
                method: 'POST',
            });

            if (res.ok) {
                alert('¡Compra exitosa! La posición ha sido añadida a tu cartera.');
                fetchListings();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al procesar la compra');
            }
        } catch (error) {
            alert('Error al procesar la compra');
        } finally {
            setIsBuying(null);
        }
    };

    const getEnergyIcon = (type: string) => {
        const icons: Record<string, { icon: string; bg: string }> = {
            SOLAR: { icon: 'solar_power', bg: 'bg-yellow-100 text-yellow-700' },
            WIND: { icon: 'air', bg: 'bg-blue-100 text-blue-700' },
            WIND_ONSHORE: { icon: 'air', bg: 'bg-blue-100 text-blue-700' },
            WIND_OFFSHORE: { icon: 'air', bg: 'bg-cyan-100 text-cyan-700' },
            HYDRO: { icon: 'water_drop', bg: 'bg-cyan-100 text-cyan-700' },
            BIOMASS: { icon: 'eco', bg: 'bg-emerald-100 text-emerald-700' },
            GEOTHERMAL: { icon: 'landslide', bg: 'bg-orange-100 text-orange-700' },
        };
        return icons[type] || { icon: 'bolt', bg: 'bg-gray-100 text-gray-700' };
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-text-main">
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10">
                <div>
                    <h1 className="text-xl font-bold text-text-main">Mercado Secundario</h1>
                    <p className="text-sm text-slate-500">Posiciones de otros inversores disponibles para compra</p>
                </div>
                <Link href="/mercado-primario" className="px-4 py-2 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg text-sm">
                    Ver Mercado Primario
                </Link>
            </header>

            <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && listings.length === 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">storefront</span>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">No hay posiciones disponibles</h2>
                            <p className="text-gray-500 mb-6">Cuando otros usuarios vendan sus posiciones, aparecerán aquí.</p>
                            <Link href="/mercado-primario" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:brightness-95 transition-all">
                                <span className="material-symbols-outlined">bolt</span>
                                Invertir en Mercado Primario
                            </Link>
                        </div>
                    )}

                    {/* Listings Grid */}
                    {!isLoading && listings.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map((listing) => {
                                const energy = getEnergyIcon(listing.investment.contract.energyType);
                                return (
                                    <div key={listing.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-lg ${energy.bg} flex items-center justify-center`}>
                                                <span className="material-symbols-outlined">{energy.icon}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-main">{listing.investment.contract.name}</h3>
                                                <p className="text-xs text-slate-500">{listing.investment.contract.generatorLocation || 'Ubicación N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between mb-4">
                                            <div>
                                                <span className="text-xs text-slate-500">Precio</span>
                                                <p className="text-lg font-black text-text-main">{formatCurrency(Number(listing.askingPrice))}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">TIR</span>
                                                <p className="text-lg font-black text-green-600">{Number(listing.investment.contract.annualReturn).toFixed(1)}%</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 mb-4">
                                            Vendedor: {listing.seller.firstName || 'Inversor'}
                                        </div>
                                        <button
                                            onClick={() => handleBuy(listing.id)}
                                            disabled={isBuying === listing.id}
                                            className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        >
                                            {isBuying === listing.id ? 'Comprando...' : 'Comprar Posición'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
