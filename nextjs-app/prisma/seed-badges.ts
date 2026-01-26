import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';

// Crear pool de conexión
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Crear adaptador y cliente
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initialBadges = [
    {
        name: 'Early Investor',
        description: 'Uno de los primeros inversores en la plataforma',
        icon: 'rocket_launch',
        color: 'yellow',
        category: 'investment',
        pointsValue: 500,
    },
    {
        name: 'Risky Investor',
        description: 'Inversionista que apuesta por proyectos innovadores',
        icon: 'trending_up',
        color: 'purple',
        category: 'risk',
        pointsValue: 750,
    },
    {
        name: 'Innovative',
        description: 'Pionero en nuevas tecnologías de energía renovable',
        icon: 'lightbulb',
        color: 'green',
        category: 'innovation',
        pointsValue: 500,
    },
];

async function seedBadges() {
    console.log('🏅 Creando insignias iniciales...');

    for (const badge of initialBadges) {
        const existing = await prisma.badge.findUnique({
            where: { name: badge.name },
        });

        if (existing) {
            console.log(`  ⏭️  Insignia "${badge.name}" ya existe, saltando...`);
            continue;
        }

        await prisma.badge.create({
            data: badge,
        });
        console.log(`  ✅ Creada: ${badge.name}`);
    }

    console.log('✨ Seed de insignias completado!');
}

seedBadges()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error('Error en seed:', e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
