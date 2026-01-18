import { z } from "zod";
import { FirestoreTimestamp, LocationSchema } from "@/features/event/schemas/location-schema";

// ============================================
// RE-EXPORTS
// ============================================
export {
	FirestoreTimestamp,
	LocationSchema,
	LocationInputSchema,
	type LocationData,
	type LocationInputData,
} from "@/features/event/schemas/location-schema";

export {
	OrganizationSchema,
	CreateOrganizationSchema,
	UpdateOrganizationSchema,
	type OrganizationDocData,
	type CreateOrganizationData,
	type UpdateOrganizationData,
} from "@/features/organization/schemas/organization-schema";

// ============================================
// USER SCHEMA (New Structure with Memberships)
// ============================================

/**
 * Schema keanggotaan user dalam organisasi
 */
export const MembershipSchema = z.object({
	orgId: z.string().min(1, "Organization ID wajib"),
	role: z.enum(["admin", "member"]),
});

export type MembershipData = z.infer<typeof MembershipSchema>;

/**
 * Schema untuk dokumen User di Firestore
 * Struktur baru dengan array memberships untuk multi-org support
 */
export const UserSchema = z.object({
	uid: z.string().min(1, "UID wajib diisi"),
	email: z.email("Format email tidak valid"),
	displayName: z.string().min(1, "Nama wajib diisi"),
	photoURL: z.url("URL foto tidak valid").optional(),
	memberships: z.array(MembershipSchema).default([]),
	createdAt: FirestoreTimestamp.optional(),
	updatedAt: FirestoreTimestamp.optional(),
});

export type UserDocData = z.infer<typeof UserSchema>;

// Schema untuk create user
export const CreateUserSchema = z.object({
	email: z.email("Format email tidak valid"),
	displayName: z.string().min(1, "Nama wajib diisi"),
	photoURL: z.url("URL foto tidak valid").optional(),
});

export type CreateUserData = z.infer<typeof CreateUserSchema>;

// ============================================
// EVENT SCHEMA (Discriminated Union)
// ============================================

// Base fields yang ada di semua tipe event
const EventBaseSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(5, "Judul event minimal 5 karakter"),
	description: z.string().min(1, "Deskripsi event wajib diisi"),
	orgId: z.string().min(1, "Organization ID wajib"),
	orgName: z.string().min(1, "Nama organisasi wajib"), // Denormalisasi untuk performa
	location: LocationSchema,
	date: FirestoreTimestamp,
	bannerUrl: z.string().url("URL banner tidak valid").optional(),
	createdAt: FirestoreTimestamp.optional(),
	updatedAt: FirestoreTimestamp.optional(),
});

/**
 * Schema untuk event tipe WORKSHOP
 */
export const WorkshopEventSchema = EventBaseSchema.extend({
	type: z.literal("WORKSHOP"),
	mentorName: z.string().min(1, "Nama mentor wajib diisi"),
	syllabus: z.array(z.string()).min(1, "Minimal 1 materi silabus"),
	maxParticipants: z.number().positive().optional(),
});

/**
 * Schema untuk event tipe CONCERT
 */
export const ConcertEventSchema = EventBaseSchema.extend({
	type: z.literal("CONCERT"),
	lineup: z.array(z.string()).min(1, "Minimal 1 artis dalam lineup"),
	gateOpen: z.string().min(1, "Waktu buka pintu wajib diisi"), // e.g., "18:00"
});

/**
 * Schema untuk event tipe SEMINAR
 */
export const SeminarEventSchema = EventBaseSchema.extend({
	type: z.literal("SEMINAR"),
	speakers: z
		.array(
			z.object({
				name: z.string().min(1, "Nama pembicara wajib"),
				title: z.string().optional(),
				photoUrl: z.string().url().optional(),
			})
		)
		.min(1, "Minimal 1 pembicara"),
	topics: z.array(z.string()).optional(),
});

/**
 * Schema untuk event tipe MEETUP (generic)
 */
export const MeetupEventSchema = EventBaseSchema.extend({
	type: z.literal("MEETUP"),
	agenda: z.string().optional(),
	maxParticipants: z.number().positive().optional(),
});

/**
 * Discriminated Union untuk semua tipe event
 */
export const EventSchema = z.discriminatedUnion("type", [
	WorkshopEventSchema,
	ConcertEventSchema,
	SeminarEventSchema,
	MeetupEventSchema,
]);

export type EventDocData = z.infer<typeof EventSchema>;
export type WorkshopEventData = z.infer<typeof WorkshopEventSchema>;
export type ConcertEventData = z.infer<typeof ConcertEventSchema>;
export type SeminarEventData = z.infer<typeof SeminarEventSchema>;
export type MeetupEventData = z.infer<typeof MeetupEventSchema>;

// Event type enum untuk UI selects
export const EventTypes = ["WORKSHOP", "CONCERT", "SEMINAR", "MEETUP"] as const;
export type EventType = (typeof EventTypes)[number];

// ============================================
// REGISTRATION SCHEMA (RSVP Replacement)
// ============================================

/**
 * Schema untuk dokumen Registration di Firestore
 * Menggantikan RSVP dengan struktur yang lebih lengkap
 */
export const RegistrationSchema = z.object({
	id: z.string().optional(), // Auto-generated
	eventId: z.string().min(1, "Event ID wajib"),
	orgId: z.string().min(1, "Organization ID wajib"), // Penting untuk dashboard komunitas
	guestName: z.string().min(2, "Nama tamu minimal 2 karakter"),
	guestEmail: z.email("Format email tidak valid"),
	guestPhone: z.string().optional(),
	status: z.enum(["confirmed", "checked-in", "cancelled"]).default("confirmed"),
	qrHash: z.string().min(1, "QR Hash wajib"), // Hash unik untuk keamanan QR
	customData: z.record(z.string(), z.any()).optional(), // Data tambahan dari custom fields
	attendedAt: FirestoreTimestamp.nullable().default(null),
	createdAt: FirestoreTimestamp,
	updatedAt: FirestoreTimestamp.optional(),
});

export type RegistrationDocData = z.infer<typeof RegistrationSchema>;

// Schema untuk create registration (form input)
export const CreateRegistrationSchema = z.object({
	eventId: z.string().min(1, "Event ID wajib"),
	guestName: z.string().min(2, "Nama tamu minimal 2 karakter"),
	guestEmail: z.email("Format email tidak valid"),
	guestPhone: z.string().optional(),
	customData: z.record(z.string(), z.any()).optional(),
});

export type CreateRegistrationData = z.infer<typeof CreateRegistrationSchema>;

// Schema untuk update registration status
export const UpdateRegistrationStatusSchema = z.object({
	status: z.enum(["confirmed", "checked-in", "cancelled"]),
});

export type UpdateRegistrationStatusData = z.infer<
	typeof UpdateRegistrationStatusSchema
>;

// ============================================
// QR CODE SCHEMA
// ============================================

export const QRCodeDataSchema = z.object({
	registrationId: z.string().min(1, "Registration ID wajib"),
	eventId: z.string().min(1, "Event ID wajib"),
	qrHash: z.string().min(1, "QR Hash wajib"),
});

export type QRCodeData = z.infer<typeof QRCodeDataSchema>;
