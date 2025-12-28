import { User } from "./users";

// Form types
export interface LoginFormData {
    email: string;
    password: string;
}
export interface RegisterFormData {
    email: string;
    password: string;
    role: "organizer" | "guest";
}
// Auth state type
export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}