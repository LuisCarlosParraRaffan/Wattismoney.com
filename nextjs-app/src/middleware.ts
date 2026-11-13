import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

// Inicializar NextAuth solo con la configuración compatible con Edge
const { auth } = NextAuth(authConfig);

// Rutas que requieren autenticación
const protectedRoutes = [
    "/dashboard",
    "/cartera",
    "/mercado-primario",
    "/mercado-secundario",
    "/mi-impacto",
    "/perfil",
    "/ajustes",
    "/ayuda",
    "/clasificacion",
    "/contrato/", // Added trailing slash to prevent matching /contratos
    "/investor-quiz",
    "/investor-quiz-results",
    "/kyc-success",
    "/kyc-upload",
    "/panel-admin",
];

// Rutas públicas de autenticación (redirigir si ya está logueado)
const authRoutes = ["/login", "/signup", "/forgot-password"];

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = (req.auth?.user as { role?: string } | undefined)?.role;

    // Proteger rutas de administración (/panel-admin)
    if (nextUrl.pathname.startsWith("/panel-admin") || nextUrl.pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            const loginUrl = new URL("/login", nextUrl.origin);
            loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
        }
    }

    // Verificar si es una ruta protegida (exact match or path segment)
    const isProtectedRoute = protectedRoutes.some((route) => {
        // Check if pathname matches route exactly or as a path segment
        const pathname = nextUrl.pathname;
        if (pathname === route || pathname === route.replace(/\/$/, '')) {
            return true;
        }
        // For routes with trailing slash, check if pathname starts with it
        if (route.endsWith('/')) {
            return pathname.startsWith(route);
        }
        // For routes without trailing slash, ensure it's a complete segment
        return pathname.startsWith(route + '/') || pathname === route;
    });

    // Verificar si es una ruta de auth
    const isAuthRoute = authRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    // Si intenta acceder a ruta protegida sin estar logueado
    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Si ya está logueado e intenta acceder a login/signup
    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
