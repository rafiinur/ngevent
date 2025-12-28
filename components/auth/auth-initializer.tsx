"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"

interface AuthInitializerProps {
    children: React.ReactNode
}

/**
 * Component to initialize Firebase auth listener on app mount.
 * This should be placed in the root layout to ensure auth state
 * is available throughout the app.
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
    const initialize = useAuthStore((state) => state.initialize)
    const initialized = useAuthStore((state) => state.initialized)

    useEffect(() => {
        const unsubscribe = initialize()
        return () => unsubscribe()
    }, [initialize])

    // Show loading screen while initializing auth
    if (!initialized) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Memuat...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
