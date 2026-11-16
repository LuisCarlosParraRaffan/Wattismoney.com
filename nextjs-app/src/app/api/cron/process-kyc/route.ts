import { NextResponse } from 'next/server';

/**
 * La auto-aprobación de KYC fue retirada: toda verificación de identidad la aprueba
 * o rechaza un administrador en /panel-admin/kyc (PATCH /api/admin/kyc).
 */
export async function GET() {
    return NextResponse.json(
        { error: 'La aprobación automática de KYC está deshabilitada.' },
        { status: 410 }
    );
}
