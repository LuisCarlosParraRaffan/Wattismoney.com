import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ProfileType } from '@/generated/prisma';

// Map answers to profile type
function calculateProfileType(riskTolerance: string): ProfileType {
    const normalized = riskTolerance.toLowerCase();
    if (normalized.includes('muy conservador')) {
        return ProfileType.VERY_CONSERVATIVE;
    }
    if (normalized.includes('conservador')) {
        return ProfileType.CONSERVATIVE;
    }
    if (normalized.includes('agresivo')) {
        return ProfileType.AGGRESSIVE;
    }
    return ProfileType.MODERATE;
}

// Map investment horizon answer to code
function mapInvestmentHorizon(horizon: string): string {
    if (horizon.includes('Menos de 1')) return 'less_1_year';
    if (horizon.includes('1-3')) return '1_3_years';
    if (horizon.includes('3-5')) return '3_5_years';
    return 'more_5_years';
}

// Map investment goal answer to code
function mapInvestmentGoal(goal: string): string {
    if (goal.includes('ingresos pasivos')) return 'passive_income';
    if (goal.includes('Crecimiento')) return 'capital_growth';
    if (goal.includes('Diversificar')) return 'diversification';
    return 'environmental_impact';
}

// Map risk tolerance answer to code
function mapRiskTolerance(risk: string): string {
    const normalized = risk.toLowerCase();
    if (normalized.includes('muy conservador')) return 'very_conservative';
    if (normalized.includes('conservador')) return 'conservative';
    if (normalized.includes('agresivo')) return 'aggressive';
    return 'moderate';
}

// Map initial investment answer to code
function mapInitialInvestment(amount: string): string {
    if (amount.includes('Menos de')) return 'less_1000';
    if (amount.includes('1,000 - 5,000')) return '1000_5000';
    if (amount.includes('5,000 - 20,000')) return '5000_20000';
    return 'more_20000';
}

// POST /api/user/investor-profile - Create investor profile from questionnaire
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { investmentGoal, investmentHorizon, riskTolerance, initialInvestment } = body;

        if (!investmentGoal || !investmentHorizon || !riskTolerance || !initialInvestment) {
            return NextResponse.json(
                { error: 'Todas las respuestas son requeridas' },
                { status: 400 }
            );
        }

        // Calculate profile type based on risk tolerance
        const profileType = calculateProfileType(riskTolerance);

        // Check if user already has a profile
        const existingProfile = await prisma.investorProfile.findUnique({
            where: { userId: session.user.id },
        });

        let profile;

        if (existingProfile) {
            // Update existing profile
            profile = await prisma.investorProfile.update({
                where: { userId: session.user.id },
                data: {
                    investmentGoal: mapInvestmentGoal(investmentGoal),
                    investmentHorizon: mapInvestmentHorizon(investmentHorizon),
                    riskTolerance: mapRiskTolerance(riskTolerance),
                    initialInvestment: mapInitialInvestment(initialInvestment),
                    profileType,
                },
            });
        } else {
            // Create new profile
            profile = await prisma.investorProfile.create({
                data: {
                    userId: session.user.id,
                    investmentGoal: mapInvestmentGoal(investmentGoal),
                    investmentHorizon: mapInvestmentHorizon(investmentHorizon),
                    riskTolerance: mapRiskTolerance(riskTolerance),
                    initialInvestment: mapInitialInvestment(initialInvestment),
                    profileType,
                },
            });
        }

        // Also update user status if needed
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                status: 'ACTIVE', // User has completed onboarding
            },
        });

        return NextResponse.json({
            message: 'Perfil de inversor creado correctamente',
            profile: {
                id: profile.id,
                profileType: profile.profileType,
                investmentGoal: profile.investmentGoal,
                investmentHorizon: profile.investmentHorizon,
                riskTolerance: profile.riskTolerance,
            },
        });
    } catch (error) {
        console.error('Error creating investor profile:', error);
        return NextResponse.json(
            { error: 'Error al crear perfil de inversor' },
            { status: 500 }
        );
    }
}

// GET /api/user/investor-profile - Get current user's investor profile
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const profile = await prisma.investorProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ profile });
    } catch (error) {
        console.error('Error fetching investor profile:', error);
        return NextResponse.json(
            { error: 'Error al obtener perfil' },
            { status: 500 }
        );
    }
}
