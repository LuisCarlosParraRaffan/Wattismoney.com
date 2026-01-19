import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure we always fetch fresh data

export async function GET(request: NextRequest) {
    try {
        // Fetch only ACTIVE contracts
        // You might want to include FUNDED ones too depending on UI requirements
        const contracts = await prisma.contract.findMany({
            where: {
                status: {
                    in: ['ACTIVE', 'FUNDED', 'IN_PROGRESS']
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform if necessary, or return as is
        return NextResponse.json(contracts);

    } catch (error) {
        console.error('Error fetching public contracts:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
