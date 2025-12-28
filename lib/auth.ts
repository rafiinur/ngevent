import { RegisterFormData } from "@/types/auth";
import { User } from "@/types/users";
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
import { auth, db } from "./firebase";
import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	Timestamp,
} from "firebase/firestore";

interface AuthError {
	code: string;
	message: string;
}

export async function signUp(data: RegisterFormData) {
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
			createdAt: new Date(),
			updatedAt: new Date(),
			photoURL: null,
			role: data.role,
		};

		await setDoc(doc(db, "users", firebaseUser.uid), {
			...userData,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});

		return userData;
	} catch (error) {
		const authError = error as AuthError;
		throw new Error(getAuthErrorMessage(authError.code));
	}
}

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
		const authError = error as AuthError;
		throw new Error(getAuthErrorMessage(authError.code));
	}
}

export async function signOut() {
	try {
		await firebaseSignOut(auth);
	} catch {
		throw new Error("Failed to sign out");
	}
}

export async function signInWithGoogle(): Promise<User> {
	try {
		const provider = new GoogleAuthProvider();

		const res = await signInWithPopup(auth, provider);
		const firebaseUser = res.user;

		let userData = await getUserData(firebaseUser.uid);

		if (!userData) {
			userData = {
				uid: firebaseUser.uid,
				email: firebaseUser.email,
				displayName: firebaseUser.displayName,
				createdAt: new Date(),
				updatedAt: new Date(),
				photoURL: firebaseUser.photoURL,
				role: "guest",
			};

			await setDoc(doc(db, "users", firebaseUser.uid), {
				...userData,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
		}

		return userData;
	} catch (error) {
		const authError = error as AuthError;
		// If user closed the popup, don't throw an error - just return silently
		if (authError.code === "auth/popup-closed-by-user") {
			console.log("Google sign-in popup was closed by user");
			throw new Error(""); // Empty error to signal cancellation
		}
		console.error("Google Sign In Error:", error);
		throw new Error(getAuthErrorMessage(authError.code || authError.message));
	}
}

export async function resetPassword(email: string): Promise<void> {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error) {
		const authError = error as AuthError;
		throw new Error(getAuthErrorMessage(authError.code));
	}
}

export async function getUserData(uid: string): Promise<User | null> {
	try {
		const docRef = doc(db, "users", uid);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const data = docSnap.data();
			return {
				...data,
				uid: docSnap.id,

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
