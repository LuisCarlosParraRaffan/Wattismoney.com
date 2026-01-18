import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';
import { ContractStatus, EnergyType } from '@/generated/prisma';

// GET /api/admin/contracts - List all contracts
export async function GET(request: Request) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status') || '';

        const skip = (page - 1) * limit;

        const where = status ? { status: status as ContractStatus } : {};

        const [contracts, total] = await Promise.all([
            prisma.contract.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { investments: true, documents: true },
                    },
                },
            }),
            prisma.contract.count({ where }),
        ]);

        return NextResponse.json({
            contracts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching contracts:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// POST /api/admin/contracts - Create a new contract
export async function POST(request: Request) {
    const { error, session } = await checkAdminAccess();
    if (error) return error;

    try {
        const body = await request.json();

        const {
            name,
            description,
            imageUrl,
            annualReturn,
            minInvestment,
            maxInvestment,
            totalCapacity,
            generator,
            generatorLocation,
            buyer,
            buyerIndustry,
            energyType,
            energyAmount,
            co2Emissions,
            termMonths,
            startDate,
            endDate,
            status,
        } = body;

        // Validate required fields
        if (!name || !generator || !buyer || !buyerIndustry || !termMonths) {
            return NextResponse.json(
                { error: 'Campos requeridos: name, generator, buyer, buyerIndustry, termMonths' },
                { status: 400 }
            );
        }

        const contract = await prisma.contract.create({
            data: {
                name,
                description,
                imageUrl,
                annualReturn: annualReturn || 0,
                minInvestment: minInvestment || 0,
                maxInvestment: maxInvestment || 0,
                totalCapacity: totalCapacity || 0,
                generator,
                generatorLocation,
                buyer,
                buyerIndustry,
                energyType: energyType || EnergyType.SOLAR,
                energyAmount: energyAmount || 0,
                co2Emissions: co2Emissions || 0,
                termMonths,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                status: status || ContractStatus.DRAFT,
                createdBy: session?.user?.id,
            },
        });

        return NextResponse.json({ contract }, { status: 201 });
    } catch (err) {
        console.error('Error creating contract:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
