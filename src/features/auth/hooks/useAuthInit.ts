/**
 * useAuthInit Hook - Firebase Auth Listener
 * Handles initialization of Firebase auth state
 */

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "../store/auth.store";
import { getUserData } from "../services/user.service";

/**
 * Initialize Firebase auth listener
 * Should be called once in the root layout
 */
export function useAuthInit() {
    const setUser = useAuthStore((state) => state.setUser);
    const setFirebaseUser = useAuthStore((state) => state.setFirebaseUser);
    const setLoading = useAuthStore((state) => state.setLoading);
    const setInitialized = useAuthStore((state) => state.setInitialized);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setFirebaseUser(firebaseUser);

            if (firebaseUser) {
                // User is signed in, fetch user data from Firestore
                const userData = await getUserData(firebaseUser.uid);
                setUser(userData);
            } else {
                // User is signed out
                setUser(null);
            }

            setLoading(false);
            setInitialized(true);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [setUser, setFirebaseUser, setLoading, setInitialized]);
}

/**
 * Hook to check if auth is ready
 * Returns true when Firebase auth has finished initializing
 */
export function useAuthReady() {
    const initialized = useAuthStore((state) => state.initialized);
    const loading = useAuthStore((state) => state.loading);

    return {
        isReady: initialized && !loading,
        isInitializing: !initialized || loading,
    };
}
