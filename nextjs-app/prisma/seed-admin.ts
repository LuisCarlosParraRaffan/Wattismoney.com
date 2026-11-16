import { PrismaClient, UserRole, UserStatus } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
    // Las credenciales del administrador solo llegan por variables de entorno: nunca en el código.
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword || adminPassword.length < 14) {
        throw new Error('Define ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 14 caracteres) como variables de entorno.');
    }

    console.log(`Seeding admin user: ${adminEmail}`);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('Admin user already exists.');

        // Update to SUPER_ADMIN if not already
        if (existingAdmin.role !== UserRole.SUPER_ADMIN) {
            await prisma.user.update({
                where: { id: existingAdmin.id },
                data: { role: UserRole.SUPER_ADMIN },
            });
            console.log('Updated existing user to SUPER_ADMIN role.');
        }
        return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            passwordHash,
            firstName: 'Luis Carlos',
            lastName: 'Parra',
            role: UserRole.SUPER_ADMIN,
            status: UserStatus.ACTIVE, // Skip KYC for admin
            emailVerified: new Date(),
        },
    });

    console.log(`Admin user created successfully with ID: ${admin.id}`);
}

seedAdmin()
    .catch((e) => {
        console.error('Error seeding admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
