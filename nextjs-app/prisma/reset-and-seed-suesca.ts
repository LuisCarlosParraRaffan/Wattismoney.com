/**
 * Reinicia la plataforma a cero y deja "El Dorado — Suesca" como único proyecto.
 *
 * Borra: transacciones, listados del mercado secundario, inversiones, documentos de
 * contratos, contratos y billeteras. Reinicia puntos y nivel de los usuarios.
 * Conserva: usuarios, documentos KYC, perfiles de inversor e insignias.
 *
 * Uso (desde nextjs-app/, con DATABASE_URL apuntando a la base deseada):
 *   npm run db:reset-suesca                 -> simulación: solo muestra qué se borraría
 *   npm run db:reset-suesca -- --confirm    -> ejecuta; el proyecto queda en BORRADOR
 *   npm run db:reset-suesca -- --confirm --publish   -> lo deja ACTIVO y visible para invertir
 *
 * Términos comerciales definidos por Klik Energy el 16-nov-2026 (cada uno se puede
 * sobrescribir con una variable de entorno):
 *   SUESCA_ANNUAL_RETURN   8        % efectivo anual estimado
 *   SUESCA_TERM_MONTHS     24       plazo en meses
 *   SUESCA_MIN_COP         2000000  ticket mínimo en pesos
 *   SUESCA_MAX_COP         20000000 ticket máximo en pesos
 *   SUESCA_BUYER           Beam Energy Innovations S.A.S. E.S.P.
 *   SUESCA_BUYER_INDUSTRY  Comercialización de energía
 *   SUESCA_TARGET_COP      meta de recaudo en pesos (por defecto, USD 20.000.000 × TRM del día)
 */
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';
import { getTrm } from '../src/lib/trm';

const TARGET_USD = 20_000_000;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const args = new Set(process.argv.slice(2));
const confirm = args.has('--confirm');
const publish = args.has('--publish');

function numberFromEnv(name: string): number | null {
    const raw = process.env[name];
    if (raw === undefined || raw.trim() === '') return null;
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} debe ser un número positivo`);
    return value;
}

async function main() {
    const dbHost = (() => {
        try {
            return new URL(process.env.DATABASE_URL || '').host;
        } catch {
            return '(DATABASE_URL inválida)';
        }
    })();
    console.log(`Base de datos: ${dbHost}`);

    const [transactions, listings, investments, documents, contracts, wallets, users] = await Promise.all([
        prisma.transaction.count(),
        prisma.secondaryListing.count(),
        prisma.investment.count(),
        prisma.contractDocument.count(),
        prisma.contract.count(),
        prisma.wallet.count(),
        prisma.user.count(),
    ]);
    console.log('Registros actuales:', { transactions, listings, investments, documents, contracts, wallets, users });

    const annualReturn = numberFromEnv('SUESCA_ANNUAL_RETURN') ?? 8;
    const termMonths = numberFromEnv('SUESCA_TERM_MONTHS') ?? 24;
    const minCop = numberFromEnv('SUESCA_MIN_COP') ?? 2_000_000;
    const buyer = process.env.SUESCA_BUYER?.trim() || 'Beam Energy Innovations S.A.S. E.S.P.';

    let targetCop = numberFromEnv('SUESCA_TARGET_COP');
    if (targetCop === null) {
        const trm = await getTrm();
        targetCop = Math.round(TARGET_USD * trm.value);
        console.log(`Meta: USD ${TARGET_USD.toLocaleString('en-US')} × TRM ${trm.value} = COP ${targetCop.toLocaleString('es-CO')}`);
    }
    const maxCop = numberFromEnv('SUESCA_MAX_COP') ?? 20_000_000;
    const status = publish ? 'ACTIVE' : 'DRAFT';

    if (!confirm) {
        console.log('\nSIMULACIÓN: no se modificó nada.');
        console.log(`Con --confirm se borrarían los registros anteriores (se conservan ${users} usuarios y su KYC)`);
        console.log(`y se crearía "El Dorado — Parque Solar Suesca" en estado ${status}.`);
        return;
    }

    const contract = await prisma.$transaction(async (tx) => {
        await tx.transaction.deleteMany();
        await tx.secondaryListing.deleteMany();
        await tx.investment.deleteMany();
        await tx.contractDocument.deleteMany();
        await tx.contract.deleteMany();
        await tx.wallet.deleteMany();
        await tx.user.updateMany({ data: { points: 0, level: 1, levelName: null } });

        return tx.contract.create({
            data: {
                name: 'El Dorado — Parque Solar Suesca',
                description:
                    'Parque solar fotovoltaico con seguidores y módulos bifaciales en Suesca, Cundinamarca, ' +
                    'desarrollado por Klik Energy. 20 MWn / 25 MWp en 12 plantas y 2 fases, conectadas a la red de ' +
                    'ENEL Colombia a 34,5 kV. Generación estimada de 40,4 GWh/año (P50, primer año completo) y ' +
                    '6.626 t de CO₂ evitadas al año. 36 ha en arriendo a 25 años. Hito Ready To Build: fase 1 en ' +
                    'diciembre de 2026 y fase 2 en junio de 2027.',
                annualReturn,
                minInvestment: minCop,
                maxInvestment: maxCop,
                totalCapacity: targetCop as number,
                currentRaised: 0,
                generator: 'Klik Energy',
                generatorLocation: 'Suesca, Cundinamarca',
                buyer,
                buyerIndustry: process.env.SUESCA_BUYER_INDUSTRY?.trim() || 'Comercialización de energía',
                energyType: 'SOLAR',
                energyAmount: 40400, // MWh/año (P50)
                co2Emissions: 6626, // t CO₂/año
                termMonths,
                status,
                marketType: 'PRIMARY',
                contractType: 'Infraestructura',
                contractSubtype: 'Proyecto solar',
                tokenSymbol: 'WIM-SUESCA-01',
            },
        });
    });

    console.log(`\nPlataforma reiniciada. Proyecto creado: ${contract.id} (${contract.status}).`);
    if (!publish) console.log('Quedó en BORRADOR. Publícalo con --publish o desde /panel-admin/contracts.');
}

main()
    .catch((error) => {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
