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
        const type = formData.get('type') as string | null; // 'front', 'back', 'residence'

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
        const fileExtension = file.name.split('.').pop();
        const timestamp = Date.now();
        const fileName = `${session.user.id}/${type || 'document'}_${timestamp}.${fileExtension}`;

        // Convertir File a ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Subir a Supabase Storage
        const client = getSupabaseClient();
        const { data, error } = await client.storage
            .from('kyc-documents')
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Error uploading to Supabase:', error);
            return NextResponse.json(
                { error: 'Error al subir el archivo' },
                { status: 500 }
            );
        }

        // Obtener URL pública del archivo
        const { data: publicUrlData } = client.storage
            .from('kyc-documents')
            .getPublicUrl(data.path);

        return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            path: data.path,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
