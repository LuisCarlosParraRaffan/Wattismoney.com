#!/bin/bash

# ===========================================
# Wattismoney - Script de Configuración de BD
# ===========================================

echo "🏗️  Wattismoney - Configuración de Base de Datos"
echo "================================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio nextjs-app"
    exit 1
fi

# Verificar si existe .env
if [ ! -f ".env" ]; then
    echo "📋 Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
    echo ""
fi

# Verificar DATABASE_URL
if grep -q "password@localhost" .env 2>/dev/null; then
    echo "⚠️  Advertencia: Parece que no has configurado tu DATABASE_URL en .env"
    echo ""
    echo "📝 INSTRUCCIONES:"
    echo "   1. Abre .env en tu editor"
    echo "   2. Reemplaza DATABASE_URL con tu URL de Supabase"
    echo "   3. Vuelve a ejecutar este script"
    echo ""
    echo "Tu DATABASE_URL de Supabase se ve así:"
    echo "   postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
    echo ""
    exit 1
fi

echo "🔄 Generando cliente de Prisma..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Error al generar cliente Prisma"
    exit 1
fi

echo ""
echo "📦 Sincronizando schema con la base de datos..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Error al sincronizar la base de datos"
    echo "   Verifica que tu DATABASE_URL sea correcta"
    exit 1
fi

echo ""
echo "🌱 ¿Deseas sembrar datos de prueba? (s/n)"
read -r response

if [[ "$response" =~ ^[Ss]$ ]]; then
    echo "🌱 Sembrando datos de prueba..."
    npx tsx prisma/seed.ts
    
    if [ $? -ne 0 ]; then
        echo "⚠️  Error al sembrar datos (puede que ya existan)"
    else
        echo "✅ Datos de prueba creados"
    fi
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📝 Credenciales de prueba:"
echo "   Usuario: carlos.rodriguez@example.com"
echo "   Contraseña: Wattismoney2024!"
echo ""
echo "🚀 Ejecuta 'npm run dev' para iniciar el servidor"
