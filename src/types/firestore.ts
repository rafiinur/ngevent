/**
 * Firestore Document Types
 * Types derived from Zod schemas in lib/database.schema.ts
 */

import { z } from "zod";
import {
    UserSchema,
    OrganizationSchema,
    EventSchema,
    RegistrationSchema,
    LocationSchema,
    MembershipSchema,
    WorkshopEventSchema,
    ConcertEventSchema,
    SeminarEventSchema,
    MeetupEventSchema,
    CreateUserSchema,
    CreateOrganizationSchema,
    CreateRegistrationSchema,
    UpdateRegistrationStatusSchema,
    QRCodeDataSchema,
} from "@/lib/database.schema";

// ============================================
// CORE DOCUMENT TYPES
// ============================================

/** User document in Firestore */
export type User = z.infer<typeof UserSchema>;

/** Organization/Community document in Firestore */
export type Organization = z.infer<typeof OrganizationSchema>;

/** Event document in Firestore (discriminated union) */
export type Event = z.infer<typeof EventSchema>;

/** Registration document in Firestore */
export type Registration = z.infer<typeof RegistrationSchema>;

/** Location embedded object */
export type Location = z.infer<typeof LocationSchema>;

/** Membership embedded object */
export type Membership = z.infer<typeof MembershipSchema>;

// ============================================
// EVENT TYPE VARIANTS
// ============================================

/** Workshop event type */
export type WorkshopEvent = z.infer<typeof WorkshopEventSchema>;

/** Concert event type */
export type ConcertEvent = z.infer<typeof ConcertEventSchema>;

/** Seminar event type */
export type SeminarEvent = z.infer<typeof SeminarEventSchema>;

/** Meetup event type */
export type MeetupEvent = z.infer<typeof MeetupEventSchema>;

// ============================================
// FORM INPUT TYPES
// ============================================

/** Data for creating a new user */
export type CreateUser = z.infer<typeof CreateUserSchema>;

/** Data for creating a new organization */
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;

/** Data for creating a new registration */
export type CreateRegistration = z.infer<typeof CreateRegistrationSchema>;

/** Data for updating registration status */
export type UpdateRegistrationStatus = z.infer<typeof UpdateRegistrationStatusSchema>;

/** QR Code data structure */
export type QRCode = z.infer<typeof QRCodeDataSchema>;

// ============================================
// UTILITY TYPES
// ============================================

/** Event type discriminator */
export type EventType = Event["type"];

/** Status options for registration */
export type RegistrationStatus = Registration["status"];

/** Role options for organization membership */
export type MembershipRole = Membership["role"];