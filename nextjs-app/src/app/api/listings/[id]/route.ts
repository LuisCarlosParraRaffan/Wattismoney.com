import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/listings/[id] - Get single listing
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const listing = await prisma.secondaryListing.findUnique({
            where: { id },
            include: {
                investment: {
                    include: {
                        contract: true,
                    },
                },
                seller: {
                    select: { id: true, firstName: true },
                },
            },
        });

        if (!listing) {
            return NextResponse.json({ error: 'Listado no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ listing });
    } catch (error) {
        console.error('Error fetching listing:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

// DELETE /api/listings/[id] - Cancel listing (only seller)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const listing = await prisma.secondaryListing.findUnique({
            where: { id },
        });

        if (!listing) {
            return NextResponse.json({ error: 'Listado no encontrado' }, { status: 404 });
        }

        if (listing.sellerId !== session.user.id) {
            return NextResponse.json({ error: 'No tienes permiso' }, { status: 403 });
        }

        if (listing.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Solo puedes cancelar listados activos' }, { status: 400 });
        }

        await prisma.secondaryListing.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error cancelling listing:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
