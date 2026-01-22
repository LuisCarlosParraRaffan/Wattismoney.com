import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// POST /api/listings/[id]/buy - Buy a listing
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    try {
        // Find and lock the listing
        const listing = await prisma.secondaryListing.findUnique({
            where: { id },
            include: {
                investment: true,
            },
        });

        if (!listing) {
            return NextResponse.json({ error: 'Listado no encontrado' }, { status: 404 });
        }

        if (listing.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Este listado ya no está disponible' }, { status: 400 });
        }

        if (listing.sellerId === session.user.id) {
            return NextResponse.json({ error: 'No puedes comprar tu propia posición' }, { status: 400 });
        }

        // Process the sale in a transaction
        await prisma.$transaction(async (tx) => {
            // 1. Mark listing as sold
            await tx.secondaryListing.update({
                where: { id },
                data: {
                    status: 'SOLD',
                    soldAt: new Date(),
                    buyerId: session.user!.id,
                },
            });

            // 2. Mark original investment as SOLD
            await tx.investment.update({
                where: { id: listing.investmentId },
                data: { status: 'SOLD' },
            });

            // 3. Create new investment for buyer
            await tx.investment.create({
                data: {
                    userId: session.user!.id,
                    contractId: listing.investment.contractId,
                    amount: listing.askingPrice,
                    status: 'CONFIRMED',
                    expectedReturn: listing.investment.expectedReturn,
                    confirmedAt: new Date(),
                },
            });

            // Note: In production, you'd also:
            // - Process payment
            // - Transfer funds minus commission to seller
            // - Record the commission for Wattismoney
        });

        return NextResponse.json({
            success: true,
            message: 'Posición comprada exitosamente',
        });
    } catch (error) {
        console.error('Error buying listing:', error);
        return NextResponse.json({ error: 'Error al procesar la compra' }, { status: 500 });
    }
}
