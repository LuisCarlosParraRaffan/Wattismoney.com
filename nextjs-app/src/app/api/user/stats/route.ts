import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get all confirmed investments for the user
        const investments = await prisma.investment.findMany({
            where: {
                userId: session.user.id,
                status: 'CONFIRMED'
            },
            include: {
                contract: {
                    select: {
                        id: true,
                        name: true,
                        annualReturn: true,
                        energyType: true,
                        energyAmount: true,
                        generatorLocation: true,
                        buyerIndustry: true,
                        co2Emissions: true,
                        status: true,
                    }
                }
            }
        });

        // Calculate metrics
        const totalInvested = investments.reduce(
            (sum, inv) => sum + Number(inv.amount), 0
        );

        const totalExpectedReturn = investments.reduce(
            (sum, inv) => sum + Number(inv.expectedReturn || 0), 0
        );

        const netGain = totalExpectedReturn - totalInvested;

        // Calculate weighted average TIR
        let weightedTIR = 0;
        if (totalInvested > 0) {
            const totalWeightedReturn = investments.reduce(
                (sum, inv) => sum + Number(inv.amount) * Number(inv.contract.annualReturn), 0
            );
            weightedTIR = totalWeightedReturn / totalInvested;
        }

        // Get unique contracts and industries
        const uniqueContracts = new Set(investments.map(inv => inv.contractId));
        const uniqueIndustries = new Set(
            investments
                .map(inv => inv.contract.buyerIndustry)
                .filter(Boolean)
        );

        // Calculate environmental impact (estimated based on investment proportion)
        let totalEnergy = 0;
        let totalCO2Avoided = 0;

        for (const investment of investments) {
            const contract = investment.contract;
            // Estimate energy based on investment proportion of total capacity
            const energyProportion = Number(investment.amount) / totalInvested;
            totalEnergy += Number(contract.energyAmount || 0) * energyProportion;
            totalCO2Avoided += Number(contract.co2Emissions || 0) * energyProportion;
        }

        // Energy type distribution
        const energyTypeMap = new Map<string, number>();
        for (const investment of investments) {
            const type = investment.contract.energyType;
            const currentAmount = energyTypeMap.get(type) || 0;
            energyTypeMap.set(type, currentAmount + Number(investment.amount));
        }

        const energyTypeDistribution = Array.from(energyTypeMap.entries()).map(([type, amount]) => ({
            type,
            amount,
            percentage: totalInvested > 0 ? Math.round((amount / totalInvested) * 100) : 0
        }));

        // Active investments for table
        const activeInvestments = investments.map(inv => ({
            id: inv.id,
            contractId: inv.contract.id,
            contractName: inv.contract.name,
            contractLocation: inv.contract.generatorLocation || 'No especificada',
            energyType: inv.contract.energyType,
            investmentAmount: Number(inv.amount),
            expectedReturn: Number(inv.expectedReturn || 0),
            annualReturn: Number(inv.contract.annualReturn),
            status: inv.status,
            contractStatus: inv.contract.status,
            industry: inv.contract.buyerIndustry || 'General',
            createdAt: inv.createdAt,
        }));

        return NextResponse.json({
            // Main KPIs
            totalInvested,
            totalContracts: uniqueContracts.size,
            averageTIR: Math.round(weightedTIR * 10) / 10,
            expectedReturn: Math.round(totalExpectedReturn * 100) / 100,
            netGain: Math.round(netGain * 100) / 100,

            // Environmental impact
            totalEnergy: Math.round(totalEnergy * 100) / 100, // GWh
            co2Avoided: Math.round(totalCO2Avoided), // Tons
            industriesImpacted: uniqueIndustries.size,

            // Distribution
            energyTypeDistribution,

            // Table data
            activeInvestments,
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { error: 'Error al obtener estadísticas' },
            { status: 500 }
        );
    }
}
