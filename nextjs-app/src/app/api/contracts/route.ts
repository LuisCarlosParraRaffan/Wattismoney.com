import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure we always fetch fresh data

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const marketType = searchParams.get('marketType') || 'PRIMARY';

        // Fetch contracts filtered by marketType
        const contracts = await prisma.contract.findMany({
            where: {
                status: {
                    in: ['ACTIVE', 'FUNDED', 'IN_PROGRESS']
                },
                marketType: marketType as 'PRIMARY' | 'SECONDARY'
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(contracts);

    } catch (error) {
        console.error('Error fetching public contracts:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
