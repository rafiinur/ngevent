import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Session cookie name (must match the one in Server Actions)
const SESSION_COOKIE_NAME = "__session";

// Auth routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ["/signin", "/signup"];

// Protected routes that require authentication
const PROTECTED_ROUTE_PREFIXES = [
    "/organizer",
    "/admin",
    "/dashboard",
];

/**
 * Check if the current path matches any of the given routes/prefixes
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
    return routes.some((route) => {
        // Exact match or starts with (for nested routes)
        return pathname === route || pathname.startsWith(`${route}/`);
    });
}

/**
 * Middleware for Firebase Authentication
 * 
 * Note: This middleware only checks for cookie PRESENCE, not validity.
 * Full token verification happens in Server Components/Actions via getSession().
 * This is because:
 * 1. Middleware runs on Edge Runtime which has limited API
 * 2. Firebase Admin SDK doesn't work in Edge Runtime
 * 3. Cookie presence check is fast and sufficient for redirect logic
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session cookie (presence check only)
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    const hasSession = !!sessionCookie?.value;

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTE_PREFIXES);

    // If user has session cookie and trying to access auth routes, redirect to dashboard
    if (hasSession && isAuthRoute) {
        return NextResponse.redirect(new URL("/organizer/dashboard", request.url));
    }

    // If accessing a protected route without session cookie, redirect to signin
    if (!hasSession && isProtectedRoute) {
        const signinUrl = new URL("/signin", request.url);
        signinUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signinUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
    ],
};

