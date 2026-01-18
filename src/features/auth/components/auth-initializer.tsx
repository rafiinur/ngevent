"use client"

import { Spinner } from "@/components/ui/spinner"
import { useAuthInit, useAuthReady } from "../hooks"

interface AuthInitializerProps {
    children: React.ReactNode
}

/**
 * Component to initialize Firebase auth listener on app mount.
 * This should be placed in the root layout to ensure auth state
 * is available throughout the app.
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
    // Initialize Firebase auth listener
    useAuthInit()

    // Check if auth is ready
    const { isReady } = useAuthReady()

    // Show loading screen while initializing auth
    if (!isReady) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner />
                    <p className="text-sm text-muted-foreground">Memuat...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
