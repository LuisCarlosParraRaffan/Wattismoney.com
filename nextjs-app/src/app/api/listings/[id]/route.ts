import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// DELETE /api/listings/[id] - Cancel an active secondary listing
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;

        const listing = await prisma.secondaryListing.findUnique({
            where: { id },
        });

        if (!listing) {
            return NextResponse.json({ error: 'Listado no encontrado' }, { status: 404 });
        }

        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';
        if (listing.sellerId !== session.user.id && !isAdmin) {
            return NextResponse.json({ error: 'No tienes permiso para cancelar este listado' }, { status: 403 });
        }

        if (listing.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Solo se pueden cancelar listados activos' }, { status: 400 });
        }

        await prisma.secondaryListing.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        return NextResponse.json({
            success: true,
            message: 'Publicación en Mercado Secundario cancelada exitosamente',
        });
    } catch (error) {
        console.error('Error cancelling listing:', error);
        return NextResponse.json({ error: 'Error al cancelar listado' }, { status: 500 });
    }
}
