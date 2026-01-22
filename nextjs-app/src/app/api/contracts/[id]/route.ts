import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/contracts/[id] - Get single contract by ID (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const contract = await prisma.contract.findUnique({
            where: { id },
            include: {
                documents: {
                    orderBy: { uploadedAt: 'desc' },
                },
            },
        });

        if (!contract) {
            return NextResponse.json(
                { error: 'Contrato no encontrado' },
                { status: 404 }
            );
        }

        // Only return public contracts (ACTIVE, FUNDED, IN_PROGRESS, COMPLETED)
        if (contract.status === 'DRAFT' || contract.status === 'CANCELLED') {
            return NextResponse.json(
                { error: 'Contrato no disponible' },
                { status: 404 }
            );
        }

        return NextResponse.json({ contract });
    } catch (error) {
        console.error('Error fetching contract:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
