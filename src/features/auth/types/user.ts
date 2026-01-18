import { Timestamp } from "firebase/firestore";

// ============================================
// MEMBERSHIP TYPES (New Structure)
// ============================================

export const MembershipRole = {
    ADMIN: "admin",
    MEMBER: "member",
} as const;

export type MembershipRoleType = (typeof MembershipRole)[keyof typeof MembershipRole];

export interface Membership {
    orgId: string;
    role: MembershipRoleType;
}

// ============================================
// USER TYPES (New Structure with Memberships)
// ============================================

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    memberships: Membership[];
    createdAt?: Date | Timestamp;
    updatedAt?: Date | Timestamp;
}

export interface CreateUserData {
    email: string;
    displayName: string;
    photoURL?: string | null;
}

// ============================================
// AUTH FORM TYPES
// ============================================

export interface LoginFormData {
    email: string;
    password: string;
}

export interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordFormData {
    email: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

// Type for register API call (without confirmPassword)
export interface RegisterCredentials {
    email: string;
    password: string;
}
