"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth, useAuthReady } from "../hooks"
import { MembershipRoleType, Membership } from "../types"

interface ProtectedRouteProps {
    children: React.ReactNode
    /** Organization ID to check membership for */
    requiredOrgId?: string
    /** Required role within the organization */
    requiredOrgRole?: MembershipRoleType
    fallbackUrl?: string
}

/**
 * Component to protect routes that require authentication.
 * Optionally can require membership in a specific organization with a role.
 */
export function ProtectedRoute({
    children,
    requiredOrgId,
    requiredOrgRole,
    fallbackUrl = "/signin",
}: ProtectedRouteProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, loading } = useAuth()
    const { isReady } = useAuthReady()

    useEffect(() => {
        // Wait until auth is initialized
        if (!isReady || loading) return

        // If not logged in, redirect to login with return URL
        if (!user) {
            const returnUrl = encodeURIComponent(pathname)
            router.push(`${fallbackUrl}?returnUrl=${returnUrl}`)
            return
        }

        // If organization membership is required, check it
        if (requiredOrgId) {
            const membership = user.memberships.find((m: Membership) => m.orgId === requiredOrgId)

            if (!membership) {
                // User is not a member of this organization
                router.push("/unauthorized")
                return
            }

            // If a specific role is required, check it
            if (requiredOrgRole && membership.role !== requiredOrgRole) {
                router.push("/unauthorized")
                return
            }
        }
    }, [user, loading, isReady, requiredOrgId, requiredOrgRole, router, pathname, fallbackUrl])

    // Show loading while checking auth
    if (!isReady || loading) {
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

    // Check organization membership if required
    if (requiredOrgId) {
        const membership = user.memberships.find((m: Membership) => m.orgId === requiredOrgId)

        if (!membership) {
            return null
        }

        if (requiredOrgRole && membership.role !== requiredOrgRole) {
            return null
        }
    }

    return <>{children}</>
}

/**
 * Helper function to check if a user has a specific role in an organization
 */
export function hasOrgRole(
    user: { memberships: { orgId: string; role: MembershipRoleType }[] } | null,
    orgId: string,
    role?: MembershipRoleType
): boolean {
    if (!user) return false

    const membership = user.memberships.find(m => m.orgId === orgId)
    if (!membership) return false

    if (role && membership.role !== role) return false

    return true
}

/**
 * Helper function to check if a user is an admin of any organization
 */
export function isOrgAdmin(
    user: { memberships: { orgId: string; role: MembershipRoleType }[] } | null
): boolean {
    if (!user) return false
    return user.memberships.some(m => m.role === "admin")
}
