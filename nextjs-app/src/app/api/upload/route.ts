import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';

// Lazy initialization of Supabase client
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (!supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            throw new Error('Supabase credentials not configured');
        }

        supabase = createClient(url, key);
    }
    return supabase;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Determine bucket based on upload type
function getBucketAndPath(type: string, userId: string, fileExtension: string): { bucket: string; path: string } {
    const timestamp = Date.now();

    // Contract assets go to separate bucket
    if (type === 'contract-image' || type === 'contract-document') {
        return {
            bucket: 'contract-assets',
            path: `contracts/${type === 'contract-image' ? 'images' : 'documents'}/${timestamp}.${fileExtension}`
        };
    }

    // Avatar images go to user-avatars bucket
    if (type === 'avatar') {
        return {
            bucket: 'user-avatars',
            path: `${userId}/avatar_${timestamp}.${fileExtension}`
        };
    }

    // KYC documents stay in their original bucket (front, back, residence, etc.)
    return {
        bucket: 'kyc-documents',
        path: `${userId}/${type || 'document'}_${timestamp}.${fileExtension}`
    };
}

export async function POST(request: NextRequest) {
    try {
        // Verificar autenticación
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const type = formData.get('type') as string | null; // 'front', 'back', 'residence', 'contract-image', 'contract-document'

        if (!file) {
            return NextResponse.json(
                { error: 'No se proporcionó ningún archivo' },
                { status: 400 }
            );
        }

        // Validar tipo de archivo
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Tipo de archivo no permitido. Usa JPG, PNG, WEBP o PDF' },
                { status: 400 }
            );
        }

        // Validar tamaño
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'El archivo excede el tamaño máximo de 10MB' },
                { status: 400 }
            );
        }

        // Generar nombre único para el archivo
        const fileExtension = file.name.split('.').pop() || 'bin';
        const { bucket, path: filePath } = getBucketAndPath(type || 'document', session.user.id, fileExtension);

        // Convertir File a ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Subir a Supabase Storage
        const client = getSupabaseClient();
        const { data, error } = await client.storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Error uploading to Supabase:', error);
            return NextResponse.json(
                { error: `Error al subir el archivo: ${error.message}` },
                { status: 500 }
            );
        }

        // Obtener URL pública del archivo
        const { data: publicUrlData } = client.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            path: data.path,
            fileName: file.name,
            fileSize: file.size,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

