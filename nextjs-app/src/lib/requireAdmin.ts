'use server';

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Verifies that the current user has admin privileges
 * Returns the session if admin, null otherwise
 */
export async function requireAdmin() {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    const role = session.user.role;

    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return null;
    }

    return session;
}

/**
 * Helper for API routes - returns error response if not admin
 */
export async function checkAdminAccess() {
    const session = await requireAdmin();

    if (!session) {
        return {
            error: NextResponse.json(
                { error: 'Acceso no autorizado' },
                { status: 403 }
            ),
            session: null
        };
    }

    return { error: null, session };
}

/**
 * Check if user is super admin
 */
export async function isSuperAdmin() {
    const session = await auth();
    return session?.user?.role === 'SUPER_ADMIN';
}
