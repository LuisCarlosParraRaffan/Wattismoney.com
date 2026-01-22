import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/investments - Create a new investment
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { contractId, amount } = body;

        if (!contractId || !amount) {
            return NextResponse.json(
                { error: 'Se requiere contractId y amount' },
                { status: 400 }
            );
        }

        if (amount <= 0) {
            return NextResponse.json(
                { error: 'El monto debe ser mayor a 0' },
                { status: 400 }
            );
        }

        // Fetch the contract to validate
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            select: {
                id: true,
                name: true,
                status: true,
                minInvestment: true,
                maxInvestment: true,
                totalCapacity: true,
                currentRaised: true,
                annualReturn: true,
            }
        });

        if (!contract) {
            return NextResponse.json(
                { error: 'Contrato no encontrado' },
                { status: 404 }
            );
        }

        if (contract.status !== 'ACTIVE') {
            return NextResponse.json(
                { error: 'Este contrato no está aceptando inversiones' },
                { status: 400 }
            );
        }

        // Validate amount is within limits
        const minInvestment = Number(contract.minInvestment);
        const maxInvestment = Number(contract.maxInvestment);

        if (amount < minInvestment) {
            return NextResponse.json(
                { error: `La inversión mínima es $${minInvestment.toLocaleString()}` },
                { status: 400 }
            );
        }

        if (maxInvestment > 0 && amount > maxInvestment) {
            return NextResponse.json(
                { error: `La inversión máxima es $${maxInvestment.toLocaleString()}` },
                { status: 400 }
            );
        }

        // Check if contract has capacity
        const currentRaised = Number(contract.currentRaised);
        const totalCapacity = Number(contract.totalCapacity);
        const remainingCapacity = totalCapacity - currentRaised;

        if (amount > remainingCapacity) {
            return NextResponse.json(
                { error: `El contrato solo puede aceptar $${remainingCapacity.toLocaleString()} más` },
                { status: 400 }
            );
        }

        // Calculate expected return
        const annualReturn = Number(contract.annualReturn) / 100;
        const expectedReturn = amount * (1 + annualReturn);

        // Create the investment - automatically confirmed (no manual approval)
        const investment = await prisma.$transaction(async (tx) => {
            // Create investment as CONFIRMED directly
            const newInvestment = await tx.investment.create({
                data: {
                    userId: session.user.id,
                    contractId: contractId,
                    amount: amount,
                    expectedReturn: expectedReturn,
                    status: 'CONFIRMED',
                    confirmedAt: new Date(),
                }
            });

            // Update contract's currentRaised
            await tx.contract.update({
                where: { id: contractId },
                data: {
                    currentRaised: {
                        increment: amount
                    }
                }
            });

            return newInvestment;
        });

        return NextResponse.json({
            success: true,
            investment: {
                id: investment.id,
                contractId: investment.contractId,
                contractName: contract.name,
                amount: Number(investment.amount),
                expectedReturn: Number(investment.expectedReturn),
                status: investment.status,
                createdAt: investment.createdAt,
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating investment:', error);
        return NextResponse.json(
            { error: 'Error al procesar la inversión' },
            { status: 500 }
        );
    }
}

// GET /api/investments - Get current user's investments (alias for /api/user/investments)
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const investments = await prisma.investment.findMany({
            where: { userId: session.user.id },
            include: {
                contract: {
                    select: {
                        id: true,
                        name: true,
                        annualReturn: true,
                        energyType: true,
                        generatorLocation: true,
                        status: true,
                    }
                },
                listing: {
                    select: {
                        id: true,
                        status: true,
                        askingPrice: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ investments });
    } catch (error) {
        console.error('Error fetching investments:', error);
        return NextResponse.json(
            { error: 'Error al obtener inversiones' },
            { status: 500 }
        );
    }
}
