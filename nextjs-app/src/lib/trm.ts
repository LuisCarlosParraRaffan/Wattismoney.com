/**
 * TRM (Tasa Representativa del Mercado) vigente, certificada por la Superintendencia
 * Financiera de Colombia y publicada en datos.gov.co (dataset 32sa-8pi3).
 */
const TRM_ENDPOINT =
    'https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde%20DESC';

export interface TrmQuote {
    /** Pesos colombianos por 1 USD */
    value: number;
    validFrom: string;
    validUntil: string;
    source: 'datos.gov.co/SFC';
}

export async function getTrm(): Promise<TrmQuote> {
    const res = await fetch(TRM_ENDPOINT, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`TRM no disponible (HTTP ${res.status})`);

    const rows = (await res.json()) as Array<{
        valor?: string;
        vigenciadesde?: string;
        vigenciahasta?: string;
    }>;
    const row = rows[0];
    const value = Number(row?.valor);

    // Rango de cordura: evita operar con un dato corrupto de la fuente.
    if (!row || !Number.isFinite(value) || value < 1000 || value > 20000) {
        throw new Error('TRM inválida recibida de la fuente');
    }

    return {
        value,
        validFrom: row.vigenciadesde ?? '',
        validUntil: row.vigenciahasta ?? '',
        source: 'datos.gov.co/SFC',
    };
}
