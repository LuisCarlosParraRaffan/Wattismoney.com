import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

// Crear pool de conexión
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Crear adaptador y cliente
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seeding de la base de datos...');

    // Limpiar datos existentes (solo en desarrollo)
    if (process.env.NODE_ENV !== 'production') {
        console.log('🗑️  Limpiando datos existentes...');
        await prisma.investorProfile.deleteMany();
        await prisma.kycDocument.deleteMany();
        await prisma.session.deleteMany();
        await prisma.account.deleteMany();
        await prisma.user.deleteMany();
        await prisma.verificationToken.deleteMany();
    }

    // Crear usuario de prueba (Carlos Rodriguez - el usuario del mockup)
    console.log('👤 Creando usuarios de prueba...');

    const passwordHash = await bcrypt.hash('Wattismoney2024!', 12);

    const carlosUser = await prisma.user.create({
        data: {
            email: 'carlos.rodriguez@example.com',
            firstName: 'Carlos',
            lastName: 'Rodriguez',
            passwordHash,
            status: 'ACTIVE',
            role: 'INVESTOR',
            emailVerified: new Date(),
            phone: '+34 612 345 678',
            nationality: 'ES',
            points: 2450,
            level: 5,
        },
    });

    console.log(`   ✅ Usuario creado: ${carlosUser.email}`);

    // Crear perfil de inversor para Carlos
    await prisma.investorProfile.create({
        data: {
            userId: carlosUser.id,
            investmentGoal: 'capital_growth',
            investmentHorizon: '3_5_years',
            riskTolerance: 'moderate',
            initialInvestment: '5000_20000',
            profileType: 'MODERATE',
            preferredProjectTypes: ['solar', 'wind'],
            monthlyLimit: 2500,
        },
    });

    console.log('   ✅ Perfil de inversor creado');

    // Crear documento KYC aprobado
    await prisma.kycDocument.create({
        data: {
            userId: carlosUser.id,
            documentType: 'DNI',
            documentNumber: '12345678A',
            status: 'APPROVED',
            submittedAt: new Date('2024-01-15'),
            reviewedAt: new Date('2024-01-16'),
        },
    });

    console.log('   ✅ Documento KYC creado');

    // Crear usuario pendiente de KYC (para pruebas de flujo)
    const pendingUser = await prisma.user.create({
        data: {
            email: 'nuevo.inversor@example.com',
            firstName: 'María',
            lastName: 'García',
            passwordHash,
            status: 'PENDING_KYC',
            role: 'INVESTOR',
            emailVerified: new Date(),
        },
    });

    console.log(`   ✅ Usuario pendiente KYC: ${pendingUser.email}`);

    // Crear usuario admin
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@wattismoney.com',
            firstName: 'Admin',
            lastName: 'Wattismoney',
            passwordHash: await bcrypt.hash('AdminSecure123!', 12),
            status: 'ACTIVE',
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    });

    console.log(`   ✅ Admin creado: ${adminUser.email}`);

    console.log('');
    console.log('🎉 Seeding completado exitosamente!');
    console.log('');
    console.log('📝 Credenciales de prueba:');
    console.log('   Usuario activo: carlos.rodriguez@example.com / Wattismoney2024!');
    console.log('   Usuario pendiente: nuevo.inversor@example.com / Wattismoney2024!');
    console.log('   Admin: admin@wattismoney.com / AdminSecure123!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error('❌ Error durante el seeding:', e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
