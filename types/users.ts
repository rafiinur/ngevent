export interface User {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
	role: "organizer" | "guest";
	createdAt: Date;
	updatedAt: Date;
}
