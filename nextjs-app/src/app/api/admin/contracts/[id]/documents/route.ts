import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess } from '@/lib/requireAdmin';

// POST /api/admin/contracts/[id]/documents - Add document to contract
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error, session } = await checkAdminAccess();
    if (error) return error;

    const { id: contractId } = await params;

    try {
        const body = await request.json();
        const { name, url, type, size } = body;

        if (!name || !url) {
            return NextResponse.json(
                { error: 'Nombre y URL son requeridos' },
                { status: 400 }
            );
        }

        // Verify contract exists
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
        });

        if (!contract) {
            return NextResponse.json(
                { error: 'Contrato no encontrado' },
                { status: 404 }
            );
        }

        // Create document record
        const document = await prisma.contractDocument.create({
            data: {
                contractId,
                name,
                url,
                type: type || 'other',
                size: size || null,
            },
        });

        return NextResponse.json({ success: true, document });
    } catch (err) {
        console.error('Error creating document:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// GET /api/admin/contracts/[id]/documents - List documents for contract
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id: contractId } = await params;

    try {
        const documents = await prisma.contractDocument.findMany({
            where: { contractId },
            orderBy: { uploadedAt: 'desc' },
        });

        return NextResponse.json({ documents });
    } catch (err) {
        console.error('Error fetching documents:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/contracts/[id]/documents - Delete a document
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await checkAdminAccess();
    if (error) return error;

    const { id: contractId } = await params;

    try {
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('documentId');

        if (!documentId) {
            return NextResponse.json(
                { error: 'documentId es requerido' },
                { status: 400 }
            );
        }

        // Verify document belongs to this contract
        const document = await prisma.contractDocument.findFirst({
            where: { id: documentId, contractId },
        });

        if (!document) {
            return NextResponse.json(
                { error: 'Documento no encontrado' },
                { status: 404 }
            );
        }

        // Delete from database
        await prisma.contractDocument.delete({
            where: { id: documentId },
        });

        // Note: We're not deleting from Supabase storage to keep files as backup
        // In production, you might want to schedule cleanup of orphaned files

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error deleting document:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
