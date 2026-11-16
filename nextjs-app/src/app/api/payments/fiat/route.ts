import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getOrCreateWallet } from '@/lib/wallet';
import { requireActiveInvestor, featureDisabled } from '@/lib/guards';
import { FEATURES, PLATFORM_CURRENCY } from '@/lib/features';
import { TREASURY_BANK_DETAILS } from '@/lib/web3-config';
import { getTrm, type TrmQuote } from '@/lib/trm';

/**
 * POST /api/payments/fiat
 *
 * Registra una inversión por TRANSFERENCIA BANCARIA en pesos colombianos.
 * La inversión nace PENDING y no suma al recaudo del proyecto: solo Tesorería,
 * tras validar el abono contra el extracto bancario, la confirma desde
 * /panel-admin/transactions (PATCH /api/admin/transactions).
 *
 * El inversionista puede expresar el monto en COP o en USD; en USD se convierte a
 * COP con la TRM vigente y la tasa queda registrada en la transacción.
 */
const BodySchema = z.object({
    contractId: z.string().min(1),
    amount: z.coerce.number().positive().finite(),
    inputCurrency: z.enum(['COP', 'USD']).default('COP'),
    bankReference: z.string().trim().min(4).max(64),
    receiptUrl: z.union([z.string().url(), z.literal('')]).optional(),
    acceptedTerms: z.literal(true),
    rail: z.string().optional(),
    purpose: z.string().optional(),
});

const fmtCop = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

export async function POST(request: NextRequest) {
    try {
        const guard = await requireActiveInvestor();
        if (!guard.ok) return guard.response;
        const userId = guard.user.id;

        const parsed = BodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            const acceptedIssue = parsed.error.issues.some((i) => i.path[0] === 'acceptedTerms');
            return NextResponse.json(
                {
                    error: acceptedIssue
                        ? 'Debes aceptar los términos y la declaración de riesgos para invertir.'
                        : 'Datos de inversión inválidos. Revisa el monto y el número de comprobante.',
                },
                { status: 400 }
            );
        }
        const { contractId, amount, inputCurrency, bankReference, receiptUrl, rail, purpose } = parsed.data;

        if (rail && rail !== 'BANK_TRANSFER') return featureDisabled('El pago en línea con tarjeta o PSE');
        if (purpose === 'WALLET_DEPOSIT') return featureDisabled('El depósito a billetera');
        if (!FEATURES.bankTransfer) return featureDisabled('La transferencia bancaria');

        if (!TREASURY_BANK_DETAILS.configured) {
            return NextResponse.json(
                { error: 'La cuenta recaudadora aún no está configurada. Intenta más tarde.' },
                { status: 503 }
            );
        }

        // TRM: obligatoria si el monto viene en USD; informativa si viene en COP.
        let trm: TrmQuote | null = null;
        try {
            trm = await getTrm();
        } catch (trmError) {
            if (inputCurrency === 'USD') {
                console.error('TRM no disponible para conversión USD→COP:', trmError);
                return NextResponse.json(
                    { error: 'No pudimos obtener la TRM del día. Ingresa el monto en pesos (COP).' },
                    { status: 503 }
                );
            }
        }

        const amountCop = inputCurrency === 'USD' ? Math.round(amount * (trm as TrmQuote).value) : Math.round(amount);

        const contract = await prisma.contract.findUnique({ where: { id: contractId } });
        if (!contract || contract.status !== 'ACTIVE') {
            return NextResponse.json(
                { error: 'El proyecto seleccionado no está activo para inversión' },
                { status: 400 }
            );
        }

        const minInvestment = Number(contract.minInvestment);
        const maxInvestment = Number(contract.maxInvestment);
        const pending = await prisma.investment.aggregate({
            _sum: { amount: true },
            where: { contractId, status: 'PENDING' },
        });
        const remainingCapacity =
            Number(contract.totalCapacity) - Number(contract.currentRaised) - Number(pending._sum.amount ?? 0);

        if (amountCop < minInvestment) {
            return NextResponse.json(
                { error: `La inversión mínima en este proyecto es ${fmtCop(minInvestment)}` },
                { status: 400 }
            );
        }
        if (maxInvestment > 0 && amountCop > maxInvestment) {
            return NextResponse.json(
                { error: `La inversión máxima permitida es ${fmtCop(maxInvestment)}` },
                { status: 400 }
            );
        }
        if (amountCop > remainingCapacity) {
            return NextResponse.json(
                { error: `El proyecto solo dispone de ${fmtCop(Math.max(0, remainingCapacity))} de cupo restante` },
                { status: 400 }
            );
        }

        // Un mismo comprobante bancario no puede respaldar dos inversiones.
        const duplicate = await prisma.transaction.findFirst({
            where: { bankReference, paymentRail: 'BANK_TRANSFER', status: { in: ['PENDING', 'COMPLETED'] } },
            select: { id: true },
        });
        if (duplicate) {
            return NextResponse.json(
                { error: 'Este número de comprobante ya fue registrado en otra inversión.' },
                { status: 409 }
            );
        }

        const wallet = await getOrCreateWallet(userId);
        // Tasa efectiva anual, compuesta al plazo del contrato.
        const annualReturn = Number(contract.annualReturn) / 100;
        const termYears = Math.max(1, Number(contract.termMonths || 12)) / 12;
        const expectedReturn = Math.round(amountCop * Math.pow(1 + annualReturn, termYears));
        const reference = `WIM-${randomBytes(4).toString('hex').toUpperCase()}`;

        const result = await prisma.$transaction(async (tx) => {
            const investment = await tx.investment.create({
                data: {
                    userId,
                    contractId,
                    amount: amountCop,
                    expectedReturn,
                    paymentRail: 'BANK_TRANSFER',
                    currency: PLATFORM_CURRENCY,
                    status: 'PENDING',
                },
            });

            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    walletId: wallet.id,
                    contractId,
                    investmentId: investment.id,
                    type: 'INVESTMENT_PRIMARY',
                    status: 'PENDING',
                    paymentRail: 'BANK_TRANSFER',
                    amount: amountCop,
                    fee: 0,
                    netAmount: amountCop,
                    currency: PLATFORM_CURRENCY,
                    // Si el inversionista cotizó en USD se conserva el monto original y la TRM aplicada.
                    originalAmount: inputCurrency === 'USD' ? amount : amountCop,
                    exchangeRate: trm ? trm.value : null,
                    externalReference: reference,
                    bankReference,
                    bankName: TREASURY_BANK_DETAILS.bankName,
                    receiptUrl: receiptUrl || null,
                    description:
                        `Inversión por transferencia bancaria en ${contract.name} (comprobante ${bankReference}). ` +
                        `Monto cotizado en ${inputCurrency}` +
                        (trm ? `, TRM ${trm.value}` : '') +
                        `. Términos y riesgos aceptados el ${new Date().toISOString()}.`,
                },
            });

            return { investment, transaction };
        });

        return NextResponse.json({
            success: true,
            status: 'PENDING',
            reference,
            amountCop,
            trm: trm?.value ?? null,
            earnedXp: 0,
            message:
                'Inversión registrada como PENDIENTE. Se confirmará cuando Tesorería valide tu transferencia bancaria.',
            investment: {
                id: result.investment.id,
                amount: amountCop,
                expectedReturn,
                status: result.investment.status,
            },
        });
    } catch (error) {
        console.error('Error in POST /api/payments/fiat:', error);
        return NextResponse.json({ error: 'Error al registrar la inversión' }, { status: 500 });
    }
}
