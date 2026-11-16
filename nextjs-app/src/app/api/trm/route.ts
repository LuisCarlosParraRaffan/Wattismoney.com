import { NextResponse } from 'next/server';
import { getTrm } from '@/lib/trm';

// GET /api/trm - TRM vigente (COP por USD) para mostrar equivalencias en la interfaz
export async function GET() {
    try {
        return NextResponse.json(await getTrm());
    } catch (error) {
        console.error('Error obteniendo TRM:', error);
        return NextResponse.json({ error: 'TRM no disponible en este momento' }, { status: 503 });
    }
}
