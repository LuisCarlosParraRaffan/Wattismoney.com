import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                investorProfile: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({
            monthlyLimit: Number(user.investorProfile?.monthlyLimit || 2500),
            preferredProjectTypes: user.investorProfile?.preferredProjectTypes || ['SOLAR', 'WIND_ONSHORE'],
            hasPassword: !!user.passwordHash,
        });
    } catch (error) {
        console.error('Error in GET /api/user/settings:', error);
        return NextResponse.json({ error: 'Error al obtener ajustes' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const {
            currentPassword,
            newPassword,
            monthlyLimit,
            preferredProjectTypes,
        } = body;

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { investorProfile: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // 1. Si el usuario ingresó cambio de contraseña, validarla y actualizarla
        if (newPassword) {
            if (newPassword.length < 6) {
                return NextResponse.json(
                    { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
                    { status: 400 }
                );
            }

            if (user.passwordHash && currentPassword) {
                const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
                if (!isValid) {
                    return NextResponse.json(
                        { error: 'La contraseña actual ingresada es incorrecta' },
                        { status: 400 }
                    );
                }
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: hashed },
            });
        }

        // 2. Actualizar preferencias de inversión en InvestorProfile
        if (user.investorProfile) {
            await prisma.investorProfile.update({
                where: { userId: user.id },
                data: {
                    ...(monthlyLimit !== undefined ? { monthlyLimit: Number(monthlyLimit) } : {}),
                    ...(Array.isArray(preferredProjectTypes) ? { preferredProjectTypes } : {}),
                },
            });
        } else {
            await prisma.investorProfile.create({
                data: {
                    userId: user.id,
                    profileType: 'MODERATE',
                    monthlyLimit: Number(monthlyLimit || 2500),
                    preferredProjectTypes: Array.isArray(preferredProjectTypes)
                        ? preferredProjectTypes
                        : ['SOLAR'],
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Tus ajustes de seguridad y preferencias de inversión han sido guardados.',
        });
    } catch (error) {
        console.error('Error in PATCH /api/user/settings:', error);
        return NextResponse.json({ error: 'Error al guardar ajustes' }, { status: 500 });
    }
}
