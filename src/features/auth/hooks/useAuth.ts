/**
 * useAuth Hook - Authentication Business Logic
 * Handles login, logout, register operations
 */

import { useCallback } from "react";
import { useAuthStore } from "../store/auth.store";
import {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    createServerSession,
    revokeServerSession,
} from "../services/auth.service";
import { RegisterCredentials } from "../types/user";

export function useAuth() {
    // Get state from store
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);
    const initialized = useAuthStore((state) => state.initialized);

    // Get setters from store
    const setUser = useAuthStore((state) => state.setUser);
    const setLoading = useAuthStore((state) => state.setLoading);
    const setError = useAuthStore((state) => state.setError);
    const clearError = useAuthStore((state) => state.clearError);
    const reset = useAuthStore((state) => state.reset);

    /**
     * Login with email and password
     */
    const login = useCallback(async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const userData = await signIn(email, password);
            await createServerSession();

            setUser(userData);
            setLoading(false);
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            setLoading(false);
            throw err;
        }
    }, [setLoading, setError, setUser]);

    /**
     * Register new user
     */
    const register = useCallback(async (data: RegisterCredentials) => {
        try {
            setLoading(true);
            setError(null);

            const userData = await signUp(data);
            await createServerSession();

            setUser(userData);
            setLoading(false);
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            setLoading(false);
            throw err;
        }
    }, [setLoading, setError, setUser]);

    /**
     * Login with Google OAuth
     */
    const loginWithGoogle = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const userData = await signInWithGoogle();
            await createServerSession();

            setUser(userData);
            setLoading(false);
        } catch (err) {
            const error = err as Error;
            const errorMessage = error.message || "";
            setError(errorMessage || null);
            setLoading(false);

            // Only throw if there's an actual error message
            if (errorMessage) throw err;
        }
    }, [setLoading, setError, setUser]);

    /**
     * Logout current user
     */
    const logout = useCallback(async () => {
        try {
            await revokeServerSession();
            await signOut();
            reset();
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            throw err;
        }
    }, [reset, setError]);

    return {
        // State
        user,
        loading,
        error,
        initialized,
        isAuthenticated: !!user,

        // Actions
        login,
        register,
        loginWithGoogle,
        logout,
        clearError,
    };
}
