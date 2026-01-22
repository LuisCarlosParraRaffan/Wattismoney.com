import { PrismaClient } from '@/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

// Configure connection pool with limits for serverless environment
const pool = new Pool({
    connectionString,
    max: 10, // Maximum number of connections in the pool
    idleTimeoutMillis: 10000, // Close idle connections after 10 seconds
    connectionTimeoutMillis: 5000, // Fail fast if can't connect in 5 seconds
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Cache the Prisma client in ALL environments (including production)
// This is critical for serverless to prevent connection exhaustion
globalForPrisma.prisma = prisma;

export default prisma;
