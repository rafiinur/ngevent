import { Timestamp } from "firebase/firestore";
import { Event } from "@/features/event/types/event";

// ============================================
// REGISTRATION STATUS
// ============================================

export const RegistrationStatus = {
    CONFIRMED: "confirmed",
    CHECKED_IN: "checked-in",
    CANCELLED: "cancelled",
} as const;

export type RegistrationStatusType = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

// ============================================
// REGISTRATION TYPES (Replaces RSVP)
// ============================================

export interface Registration {
    id?: string;
    eventId: string;
    orgId: string; // Important for organization dashboard
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    status: RegistrationStatusType;
    qrHash: string; // Unique hash for QR security
    customData?: Record<string, unknown>;
    attendedAt: Timestamp | null;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

export interface CreateRegistrationData {
    eventId: string;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    customData?: Record<string, unknown>;
}

export interface UpdateRegistrationStatusData {
    status: RegistrationStatusType;
}

// ============================================
// REGISTRATION HELPER TYPES
// ============================================

// Registration with event details
export interface RegistrationWithDetails extends Registration {
    event?: Event;
}

// QR Code data structure
export interface QRCodeData {
    registrationId: string;
    eventId: string;
    qrHash: string;
}
