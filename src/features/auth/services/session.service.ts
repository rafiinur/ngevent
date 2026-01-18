import "server-only"
import { adminAuth } from "@/lib/firebase/admin";

/**
 * Verify a Firebase ID token
 * @param token - The ID token to verify
 * @returns The decoded token or null if invalid
 */
export async function verifyIdToken(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}

/**
 * Verify a session cookie
 * @param sessionCookie - The session cookie to verify
 * @returns The decoded token or null if invalid
 */
export async function verifySessionCookie(sessionCookie: string) {
    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        return decodedClaims;
    } catch (error) {
        console.error("Error verifying session cookie:", error);
        return null;
    }
}

/**
 * Create a session cookie from an ID token
 * @param idToken - The Firebase ID token
 * @param expiresIn - Cookie expiration in milliseconds (default: 5 days)
 * @returns The session cookie string
 */
export async function createSessionCookie(idToken: string, expiresIn: number = 60 * 60 * 24 * 5 * 1000) {
    try {
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        return sessionCookie;
    } catch (error) {
        console.error("Error creating session cookie:", error);
        return null;
    }
}

/**
 * Revoke refresh tokens for a user
 * @param uid - The user's Firebase UID
 */
export async function revokeRefreshTokens(uid: string) {
    try {
        await adminAuth.revokeRefreshTokens(uid);
        return true;
    } catch (error) {
        console.error("Error revoking refresh tokens:", error);
        return false;
    }
}
