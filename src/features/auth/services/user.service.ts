/**
 * User Service - User Data Operations
 * Client-side user data fetching and management
 */


import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/src/types";

/**
 * Get user data from Firestore by UID
 */
export async function getUserData(uid: string): Promise<User | null> {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                uid: docSnap.id,
                email: data.email || null,
                displayName: data.displayName || null,
                photoURL: data.photoURL || null,
                memberships: data.memberships || [],
                createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
                updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
            } as User;
        }

        return null;
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
}
