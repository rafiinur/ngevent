/**
 * Auth Service - Firebase Authentication + Session Management
 * 
 * Unified service for:
 * - Client-side Firebase Auth (signIn, signUp, signOut, OAuth)
 * - Server session cookie management
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    UserCredential,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getUserData } from "./user.service";
import {
    createSession,
    revokeSession,
    getSession,
    refreshSession,
} from "@/features/auth/actions";
import { RegisterCredentials, User } from "../types";
import { ApiError } from "@/src/types";

// ============================================
// FIREBASE AUTHENTICATION
// ============================================

/**
 * Register a new user with email and password
 */
export async function signUp(data: RegisterCredentials): Promise<User> {
    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
        );

        const firebaseUser = userCredential.user;

        // Derive displayName from email (first part before @)
        const displayName = data.email.split("@")[0];

        await updateProfile(firebaseUser, {
            displayName: displayName,
        });

        const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: displayName,
            photoURL: null,
            memberships: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await setDoc(doc(db, "users", firebaseUser.uid), {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return userData;
    } catch (error) {
        const authError = error as ApiError;
        throw new Error(getAuthErrorMessage(authError.code));
    }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const userData = await getUserData(userCredential.user.uid);

        if (!userData) {
            throw new Error("User data not found");
        }

        return userData;
    } catch (error) {
        const authError = error as ApiError;
        throw new Error(getAuthErrorMessage(authError.code));
    }
}

/**
 * Sign out from Firebase
 */
export async function signOut(): Promise<void> {
    try {
        await firebaseSignOut(auth);
    } catch {
        throw new Error("Failed to sign out");
    }
}

/**
 * Google Sign-In with Popup
 */
export async function signInWithGoogle(): Promise<User> {
    try {
        const provider = new GoogleAuthProvider();

        const res = await signInWithPopup(auth, provider);
        const firebaseUser = res.user;

        let userData = await getUserData(firebaseUser.uid);

        if (!userData) {
            userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email as string,
                displayName: firebaseUser.displayName as string,
                photoURL: firebaseUser.photoURL as string,
                memberships: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await setDoc(doc(db, "users", firebaseUser.uid), {
                ...userData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        return userData;
    } catch (error) {
        const authError = error as ApiError;
        if (authError.code === "auth/popup-closed-by-user") {
            console.log("Google sign-in popup was closed by user");
            throw new Error("");
        }
        console.error("Google Sign In Error:", error);
        throw new Error(getAuthErrorMessage(authError.code || authError.message));
    }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        const authError = error as ApiError;
        throw new Error(getAuthErrorMessage(authError.code));
    }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Create a server session cookie after Firebase authentication
 * Call this after successful signIn, signUp, or OAuth
 */
export async function createServerSession(): Promise<boolean> {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.warn("No authenticated user found");
            return false;
        }

        const idToken = await user.getIdToken();
        const result = await createSession(idToken);

        if (!result.success) {
            console.error("Failed to create session:", result.error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error creating server session:", error);
        return false;
    }
}

/**
 * Revoke the server session cookie
 * Call this before or after Firebase signOut
 */
export async function revokeServerSession(revokeTokens: boolean = false): Promise<boolean> {
    try {
        const result = await revokeSession({ revokeTokens });

        if (!result.success) {
            console.error("Failed to revoke session:", result.error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error revoking server session:", error);
        return false;
    }
}

/**
 * Check if current server session is valid
 */
export async function checkServerSession(): Promise<{
    authenticated: boolean;
    user: { uid: string; email: string | undefined; emailVerified: boolean } | null;
}> {
    try {
        return await getSession();
    } catch (error) {
        console.error("Error checking server session:", error);
        return { authenticated: false, user: null };
    }
}

/**
 * Refresh server session with a new ID token
 */
export async function refreshServerSession(): Promise<boolean> {
    try {
        const user = auth.currentUser;
        if (!user) return false;

        const idToken = await user.getIdToken(true);
        const result = await refreshSession(idToken);

        return result.success;
    } catch (error) {
        console.error("Error refreshing server session:", error);
        return false;
    }
}

// ============================================
// ERROR HANDLING
// ============================================

function getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
        "auth/email-already-in-use": "Email sudah terdaftar",
        "auth/invalid-email": "Format email tidak valid",
        "auth/operation-not-allowed": "Metode login tidak diizinkan",
        "auth/weak-password": "Password terlalu lemah (minimal 6 karakter)",
        "auth/user-disabled": "Akun telah dinonaktifkan",
        "auth/user-not-found": "Email tidak terdaftar",
        "auth/wrong-password": "Password salah",
        "auth/invalid-credential": "Email atau password salah",
        "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti",
        "auth/popup-closed-by-user": "Login dibatalkan",
    };

    return errorMessages[errorCode] || "Terjadi kesalahan. Silakan coba lagi";
}
