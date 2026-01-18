"use server";

import { cookies } from "next/headers";
import {
    createSessionCookie,
    verifyIdToken,
    verifySessionCookie,
    revokeRefreshTokens,
} from "../services/session.service";

// Session cookie name
const SESSION_COOKIE_NAME = "__session";

// Cookie options
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

/**
 * Create a session cookie from a Firebase ID token
 * Call this from the client after successful Firebase authentication
 */
export async function createSession(idToken: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        if (!idToken) {
            return { success: false, error: "ID token is required" };
        }

        // Verify the ID token first
        const decodedToken = await verifyIdToken(idToken);
        if (!decodedToken) {
            return { success: false, error: "Invalid ID token" };
        }

        // Create session cookie (5 days expiration)
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
        const sessionCookie = await createSessionCookie(idToken, expiresIn);

        if (!sessionCookie) {
            return { success: false, error: "Failed to create session" };
        }

        // Set the session cookie
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
            ...COOKIE_OPTIONS,
            maxAge: expiresIn / 1000, // Convert to seconds
        });

        return { success: true };
    } catch (error) {
        console.error("Error creating session:", error);
        return { success: false, error: "Internal server error" };
    }
}

/**
 * Revoke the session cookie
 * Call this from the client before or after Firebase signOut
 */
export async function revokeSession(options?: {
    revokeTokens?: boolean;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

        // Optionally revoke refresh tokens for extra security
        if (options?.revokeTokens && sessionCookie?.value) {
            const decodedClaims = await verifySessionCookie(sessionCookie.value);
            if (decodedClaims?.uid) {
                await revokeRefreshTokens(decodedClaims.uid);
            }
        }

        // Clear the session cookie
        cookieStore.delete(SESSION_COOKIE_NAME);

        return { success: true };
    } catch (error) {
        console.error("Error revoking session:", error);
        return { success: false, error: "Internal server error" };
    }
}

/**
 * Check if the current session is valid
 * Can be called from Server Components or Server Actions
 */
export async function getSession(): Promise<{
    authenticated: boolean;
    user: {
        uid: string;
        email: string | undefined;
        emailVerified: boolean;
    } | null;
}> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

        if (!sessionCookie?.value) {
            return { authenticated: false, user: null };
        }

        const decodedClaims = await verifySessionCookie(sessionCookie.value);

        if (!decodedClaims) {
            // Clear invalid session cookie
            cookieStore.delete(SESSION_COOKIE_NAME);
            return { authenticated: false, user: null };
        }

        return {
            authenticated: true,
            user: {
                uid: decodedClaims.uid,
                email: decodedClaims.email,
                emailVerified: decodedClaims.email_verified ?? false,
            },
        };
    } catch (error) {
        console.error("Error checking session:", error);
        return { authenticated: false, user: null };
    }
}

/**
 * Refresh the session with a new ID token
 * Call this periodically or before the session expires
 */
export async function refreshSession(idToken: string): Promise<{
    success: boolean;
    error?: string;
}> {
    // Simply create a new session with the fresh token
    return createSession(idToken);
}

/**
 * Get the current authenticated user with full Firestore data
 * Use this in Server Components to get complete user information
 * @returns Full user data from Firestore, or null if not authenticated
 */
export async function getCurrentUser(): Promise<{
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
} | null> {
    try {
        const { authenticated, user: sessionUser } = await getSession();

        if (!authenticated || !sessionUser) {
            return null;
        }

        // Get full user data from Firestore
        const { adminFirestore } = await import("@/lib/firebase/admin");
        const userDoc = await adminFirestore
            .collection("users")
            .doc(sessionUser.uid)
            .get();

        if (!userDoc.exists) {
            return null;
        }

        const data = userDoc.data();
        return {
            uid: sessionUser.uid,
            email: data?.email || sessionUser.email || null,
            displayName: data?.displayName || null,
            photoURL: data?.photoURL || null,
            role: data?.role || "guest",
            createdAt: data?.createdAt?.toDate() || new Date(),
            updatedAt: data?.updatedAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

