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
];

// Rutas públicas de autenticación (redirigir si ya está logueado)
const authRoutes = ["/login", "/signup", "/forgot-password"];

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

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
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         * - api routes (except auth)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
