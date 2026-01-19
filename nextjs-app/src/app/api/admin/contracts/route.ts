import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ContractStatus, EnergyType } from '@/generated/prisma';

export async function POST(request: NextRequest) {
    try {
        // 1. Verify Authentication & Admin Role
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check role - assuming 'ADMIN' or 'SUPER_ADMIN' is required
        if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
        }

        // 2. Parse Request Body
        const body = await request.json();

        // Destructure fields based on the form
        const {
            name,
            contractType,
            contractSubtype,
            energyType,
            annualReturn,
            financingGoal, // Maps to totalCapacity (target amount to raise)
            minInvestment,
            maxInvestment,

            // Specifications
            generatorName,
            buyerName,
            buyerIndustry,
            energyVolume, // Maps to energyAmount
            termDuration,
            termUnit, // 'Años' or 'Meses'
            co2Avoided, // Maps to co2Emissions

            // Images & Docs
            imageUrl,

            // Status action
            action // 'draft' or 'publish'
        } = body;

        // 3. Validation
        if (!name || !financingGoal || !annualReturn) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 4. Transform Data
        // Convert term to months if needed (simplified logic)
        const termMonths = termUnit === 'Años' ? Math.round(Number(termDuration) * 12) : Math.round(Number(termDuration));

        // Map Status
        const status: ContractStatus = action === 'publish' ? 'ACTIVE' : 'DRAFT';

        // Map Energy Type string to Enum
        // Logic to try and match the string from the dropdown to the Enum
        let mappedEnergyType: EnergyType = 'SOLAR';
        if (energyType.includes('Solar')) mappedEnergyType = 'SOLAR';
        else if (energyType.includes('Eólica Onshore')) mappedEnergyType = 'WIND_ONSHORE';
        else if (energyType.includes('Eólica Offshore')) mappedEnergyType = 'WIND_OFFSHORE';
        else if (energyType.includes('Hidro')) mappedEnergyType = 'HYDRO';
        else if (energyType.includes('Biomasa')) mappedEnergyType = 'BIOMASS';

        // 5. Create Contract in DB
        const newContract = await prisma.contract.create({
            data: {
                name,
                // Financials
                annualReturn: Number(annualReturn),
                totalCapacity: Number(financingGoal),
                currentRaised: 0, // Starts at 0
                minInvestment: Number(minInvestment) || 0,
                maxInvestment: Number(maxInvestment) || Number(financingGoal),

                // Details
                contractType,
                contractSubtype,

                // Parties
                generator: generatorName || 'Unknown Generator', // Fallback if missing
                buyer: buyerName || 'Unknown Buyer',
                buyerIndustry: buyerIndustry || 'General',

                // Energy Specs
                energyType: mappedEnergyType,
                energyAmount: Number(energyVolume) || 0,
                co2Emissions: Number(co2Avoided) || 0,

                // Terms
                termMonths: termMonths || 0,

                // Visuals
                imageUrl: imageUrl || null,

                // Meta
                status,
                createdBy: session.user.id
            }
        });

        return NextResponse.json({
            success: true,
            contractId: newContract.id,
            message: status === 'ACTIVE' ? 'Contrato publicado exitosamente' : 'Borrador guardado'
        });

    } catch (error) {
        console.error('Error creating contract:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
