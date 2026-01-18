import 'server-only'
import { initializeApp, getApps, cert, ServiceAccount, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Service account configuration from environment variables
const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Initialize Firebase Admin (prevent re-initialization)
let adminApp: App;

if (getApps().length === 0) {
    adminApp = initializeApp({
        credential: cert(serviceAccount),
    });
} else {
    adminApp = getApps()[0];
}

export const adminAuth: Auth = getAuth(adminApp);
export const adminFirestore: Firestore = getFirestore(adminApp);

export { adminApp };
