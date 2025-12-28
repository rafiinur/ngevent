"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: "organizer" | "guest"
    fallbackUrl?: string
}

/**
 * Component to protect routes that require authentication.
 * Optionally can require a specific role (organizer or guest).
 */
export function ProtectedRoute({
    children,
    requiredRole,
    fallbackUrl = "/signin",
}: ProtectedRouteProps) {
    const router = useRouter()
    const pathname = usePathname()
    const user = useAuthStore((state) => state.user)
    const loading = useAuthStore((state) => state.loading)
    const initialized = useAuthStore((state) => state.initialized)

    useEffect(() => {
        // Wait until auth is initialized
        if (!initialized || loading) return

        // If not logged in, redirect to login with return URL
        if (!user) {
            const returnUrl = encodeURIComponent(pathname)
            router.push(`${fallbackUrl}?returnUrl=${returnUrl}`)
            return
        }

        // If role is required and doesn't match, redirect
        if (requiredRole && user.role !== requiredRole) {
            router.push("/unauthorized")
            return
        }
    }, [user, loading, initialized, requiredRole, router, pathname, fallbackUrl])

    // Show loading while checking auth
    if (!initialized || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Memverifikasi akses...</p>
                </div>
            </div>
        )
    }

    // Don't render if not authorized
    if (!user) {
        return null
    }

    if (requiredRole && user.role !== requiredRole) {
        return null
    }

    return <>{children}</>
}
