import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const COMMISSION_RATE = 0.03; // 3%

// GET /api/listings - List all active listings
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const [listings, total] = await Promise.all([
            prisma.secondaryListing.findMany({
                where: { status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    investment: {
                        include: {
                            contract: {
                                select: {
                                    id: true,
                                    name: true,
                                    imageUrl: true,
                                    energyType: true,
                                    annualReturn: true,
                                    generatorLocation: true,
                                },
                            },
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            firstName: true,
                        },
                    },
                },
            }),
            prisma.secondaryListing.count({ where: { status: 'ACTIVE' } }),
        ]);

        return NextResponse.json({
            listings,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

// POST /api/listings - Create new listing (sell position)
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { investmentId, askingPrice } = await request.json();

        if (!investmentId || !askingPrice) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
        }

        // Verify investment exists and belongs to user
        const investment = await prisma.investment.findUnique({
            where: { id: investmentId },
            include: { listing: true },
        });

        if (!investment) {
            return NextResponse.json({ error: 'Inversión no encontrada' }, { status: 404 });
        }

        if (investment.userId !== session.user.id) {
            return NextResponse.json({ error: 'No tienes permiso para vender esta inversión' }, { status: 403 });
        }

        if (investment.status !== 'CONFIRMED') {
            return NextResponse.json({ error: 'Solo puedes vender inversiones confirmadas' }, { status: 400 });
        }

        if (investment.listing) {
            return NextResponse.json({ error: 'Esta inversión ya está en venta' }, { status: 400 });
        }

        // Calculate commission
        const price = Number(askingPrice);
        const commission = price * COMMISSION_RATE;

        // Create listing
        const listing = await prisma.secondaryListing.create({
            data: {
                investmentId,
                sellerId: session.user.id,
                askingPrice: price,
                originalAmount: Number(investment.amount),
                commission,
            },
        });

        return NextResponse.json({ success: true, listing });
    } catch (error) {
        console.error('Error creating listing:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
