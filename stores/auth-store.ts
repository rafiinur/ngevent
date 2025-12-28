// lib/stores/auth-store.ts
import { create } from "zustand";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
	signIn,
	signUp,
	signOut,
	getUserData,
	signInWithGoogle,
} from "@/lib/auth";
import { RegisterFormData } from "@/types/auth";
import { User } from "@/types/users";

interface AuthState {
	user: User | null;
	firebaseUser: FirebaseUser | null;
	loading: boolean;
	error: string | null;
	initialized: boolean;

	// Actions
	login: (email: string, password: string) => Promise<void>;
	register: (data: RegisterFormData) => Promise<void>;
	loginWithGoogle: () => Promise<void>;
	logout: () => Promise<void>;
	clearError: () => void;
	initialize: () => () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
	user: null,
	firebaseUser: null,
	loading: true,
	error: null,
	initialized: false,

	login: async (email, password) => {
		try {
			set({ loading: true, error: null });
			const userData = await signIn(email, password);
			set({ user: userData, loading: false });
		} catch (err) {
			const error = err as Error;
			set({ error: error.message, loading: false });
			throw err;
		}
	},

	register: async (data) => {
		try {
			set({ loading: true, error: null });
			const userData = await signUp(data);
			set({ user: userData, loading: false });
		} catch (err) {
			const error = err as Error;
			set({ error: error.message, loading: false });
			throw err;
		}
	},

	loginWithGoogle: async () => {
		try {
			set({ loading: true, error: null });
			const userData = await signInWithGoogle();
			set({ user: userData, loading: false });
		} catch (err) {
			const error = err as Error;
			// Only set error if it's not empty (popup closed by user returns empty)
			const errorMessage = error.message || "";
			set({ error: errorMessage || null, loading: false });
			if (errorMessage) throw err;
		}
	},

	logout: async () => {
		try {
			await signOut();
			set({ user: null, firebaseUser: null });
		} catch (err) {
			const error = err as Error;
			set({ error: error.message });
			throw err;
		}
	},

	clearError: () => set({ error: null }),

	initialize: () => {
		const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
			set({ firebaseUser: fbUser });

			if (fbUser) {
				const userData = await getUserData(fbUser.uid);
				set({ user: userData, loading: false, initialized: true });
			} else {
				set({ user: null, loading: false, initialized: true });
			}
		});

		return unsubscribe;
	},
}));
