import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/requireAdmin';
import prisma from '@/lib/prisma';
import { ContractStatus, EnergyType } from '@/generated/prisma';

// GET /api/admin/contracts/[id] - Get contract details
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id } = await params;

    try {
        const contract = await prisma.contract.findUnique({
            where: { id },
            include: {
                documents: true,
                investments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!contract) {
            return NextResponse.json(
                { error: 'Contrato no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ contract });
    } catch (err) {
        console.error('Error fetching contract:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/contracts/[id] - Update contract
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id } = await params;

    try {
        const body = await request.json();

        // Validate status if provided
        if (body.status && !Object.values(ContractStatus).includes(body.status)) {
            return NextResponse.json(
                { error: 'Estado no válido' },
                { status: 400 }
            );
        }

        // Validate energyType if provided
        if (body.energyType && !Object.values(EnergyType).includes(body.energyType)) {
            return NextResponse.json(
                { error: 'Tipo de energía no válido' },
                { status: 400 }
            );
        }

        // Parse dates if provided
        if (body.startDate) body.startDate = new Date(body.startDate);
        if (body.endDate) body.endDate = new Date(body.endDate);

        const contract = await prisma.contract.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ contract });
    } catch (err) {
        console.error('Error updating contract:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/contracts/[id] - Delete contract (only if no investments)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id } = await params;

    try {
        // Check if contract has investments
        const investmentCount = await prisma.investment.count({
            where: { contractId: id },
        });

        if (investmentCount > 0) {
            return NextResponse.json(
                { error: 'No se puede eliminar un contrato con inversiones activas' },
                { status: 400 }
            );
        }

        await prisma.contract.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error deleting contract:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
