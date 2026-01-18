// Firebase client-side initialization
'use client';

import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { connectFirestoreEmulator, Firestore, getFirestore } from "firebase/firestore";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// Logic untuk menyambungkan ke Emulator jika di mode Development
if (process.env.NODE_ENV === "development") {
    // Sambungkan ke Firestore Emulator
    connectFirestoreEmulator(db, "127.0.0.1", 8080);

    // Sambungkan ke Auth Emulator
    // Pastikan URL-nya lengkap untuk Auth
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}
export { db, auth };

// Analytics (client-side only)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export { app, analytics };