/**
 * Auth Store - Pure State Management
 * Only contains state and setters, no business logic
 */

import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "../types/user";

// ============================================
// STATE INTERFACE
// ============================================

interface AuthState {
    // State
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

interface AuthActions {
    // Setters
    setUser: (user: User | null) => void;
    setFirebaseUser: (firebaseUser: FirebaseUser | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setInitialized: (initialized: boolean) => void;

    // Utility
    reset: () => void;
    clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

// ============================================
// INITIAL STATE
// ============================================

const initialState: AuthState = {
    user: null,
    firebaseUser: null,
    loading: true,
    error: null,
    initialized: false,
};

// ============================================
// STORE
// ============================================

export const useAuthStore = create<AuthStore>()((set) => ({
    ...initialState,

    // Setters
    setUser: (user) => set({ user }),
    setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setInitialized: (initialized) => set({ initialized }),

    // Utility
    reset: () => set(initialState),
    clearError: () => set({ error: null }),
}));

// ============================================
// SELECTORS (for optimized re-renders)
// ============================================

export const selectUser = (state: AuthStore) => state.user;
export const selectFirebaseUser = (state: AuthStore) => state.firebaseUser;
export const selectLoading = (state: AuthStore) => state.loading;
export const selectError = (state: AuthStore) => state.error;
export const selectInitialized = (state: AuthStore) => state.initialized;
export const selectIsAuthenticated = (state: AuthStore) => !!state.user;
