# Plan de Implementación: Migración Wattismoney a Next.js

## Resumen Ejecutivo
Migrar Wattismoney.com de Vite/React a Next.js 16 con App Router, manteniendo la funcionalidad visual exacta y preparando la arquitectura para backend futuro.

---

## Fase 1: Configuración Base (Sprint 1 - Parte A)

### 1.1 ✅ Inicializar Proyecto Next.js
- **Estado**: COMPLETADO
- **Ubicación**: `/nextjs-app`
- **Tecnologías**: Next.js 16, TypeScript, Tailwind CSS 4, ESLint

### 1.2 Migrar Configuración de Estilos
**Objetivo**: Replicar el sistema de diseño exacto de Wattismoney

**Acciones**:
1. Configurar `globals.css` con:
   - Importar fuentes: Inter, Cairo, Material Symbols  
   - Variables CSS personalizadas (colores de marca)
   - Clases utilitarias personalizadas
   
2. Configurar Tailwind CSS con colores:
   - `w-accent`: #dced31
   - `w-dark`: #151715
   - `primary`: #eeff00
   - `neon-yellow`: #EAFF04
   - Paleta emerald personalizada

**Test de Verificación**: La página base debe mostrar estilos correctos

---

## Fase 2: Migración del Frontend (Sprint 1 - Parte B)

### 2.1 Migrar Componentes Compartidos
**Archivos a migrar**:
- `components/Icons.tsx` → `src/components/Icons.tsx`
- `components/AppImages.tsx` → `src/components/AppImages.tsx`

**Cambios requeridos**:
- Ningún cambio (componentes puros sin dependencias de router)

### 2.2 Migrar Página Landing
**Archivo**: `pages/Landing.tsx` → `src/app/page.tsx`

**Cambios requeridos**:
- Reemplazar `Link` de react-router-dom → `next/link`
- Mantener como Client Component por ahora (`'use client'`)

**Test de Verificación**: Landing visible en http://localhost:3001

### 2.3 Migrar Layout del Dashboard
**Archivos**:
- `components/Layout.tsx` → `src/app/(dashboard)/layout.tsx`

**Cambios requeridos**:
- Reemplazar `Link` → `next/link`
- Reemplazar `Outlet` → `{children}` 
- Reemplazar `useLocation` → `usePathname` de `next/navigation`

### 2.4 Migrar Páginas Públicas (Sin Layout Dashboard)
| Página Actual | Ruta Next.js |
|---------------|--------------|
| Landing.tsx | `app/page.tsx` |
| Login.tsx | `app/login/page.tsx` |
| Signup.tsx | `app/signup/page.tsx` |
| SignupSuccess.tsx | `app/signup-success/page.tsx` |
| ForgotPassword.tsx | `app/forgot-password/page.tsx` |
| KYCUpload.tsx | `app/kyc-upload/page.tsx` |
| KYCSuccess.tsx | `app/kyc-success/page.tsx` |
| InvestorProfileQuiz.tsx | `app/investor-profile/page.tsx` |
| InvestorProfileSuccess.tsx | `app/investor-profile-success/page.tsx` |
| Impacto.tsx | `app/impacto/page.tsx` |
| Contratos.tsx | `app/contratos/page.tsx` |
| ComoFunciona.tsx | `app/como-funciona/page.tsx` |
| HojaDeRuta.tsx | `app/hoja-de-ruta/page.tsx` |

### 2.5 Migrar Páginas del Dashboard (Con Layout)
| Página Actual | Ruta Next.js |
|---------------|--------------|
| Dashboard.tsx | `app/(dashboard)/dashboard/page.tsx` |
| Oportunidades.tsx | `app/(dashboard)/mercado-primario/page.tsx` |
| Marketplace.tsx | `app/(dashboard)/mercado-secundario/page.tsx` |
| Cartera.tsx | `app/(dashboard)/cartera/page.tsx` |
| UserImpact.tsx | `app/(dashboard)/mi-impacto/page.tsx` |
| Profile.tsx | `app/(dashboard)/perfil/page.tsx` |
| Settings.tsx | `app/(dashboard)/ajustes/page.tsx` |
| Clasificacion.tsx | `app/(dashboard)/clasificacion/page.tsx` |
| Ayuda.tsx | `app/(dashboard)/ayuda/page.tsx` |
| ContractDetail.tsx | `app/(dashboard)/contrato/[id]/page.tsx` |

---

## Estructura de Carpetas Final

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx (Root Layout con fuentes)
│   │   ├── page.tsx (Landing)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── impacto/page.tsx
│   │   ├── contratos/page.tsx
│   │   ├── como-funciona/page.tsx
│   │   ├── hoja-de-ruta/page.tsx
│   │   └── (dashboard)/
│   │       ├── layout.tsx (Sidebar Layout)
│   │       ├── dashboard/page.tsx
│   │       ├── mercado-primario/page.tsx
│   │       ├── cartera/page.tsx
│   │       └── ...resto
│   └── components/
│       ├── Icons.tsx
│       ├── AppImages.tsx
│       └── ui/ (componentes reutilizables futuros)
```

---

## Tests de Verificación por Fase

| Fase | Test | Criterio de Éxito |
|------|------|-------------------|
| 1.2 | Build & Dev | `npm run dev` sin errores |
| 2.2 | Visual Landing | Landing idéntica visualmente |
| 2.3 | Navegación | Links funcionan correctamente |
| 2.5 | Dashboard | Sidebar y navegación funcional |

---

## Dependencias a Instalar

```bash
npm install recharts
```

---

## ¿Procedemos con la Fase 1.2?
