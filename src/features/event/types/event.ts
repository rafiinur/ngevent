import { Timestamp } from "firebase/firestore";
import { User } from "@/features/auth/types/user";

// ============================================
// LOCATION TYPES (Google Maps Integration)
// ============================================

export interface Coordinates {
	lat: number;
	lng: number;
}

export interface Location {
	name: string;
	address: string;
	placeId: string;
	coordinates: Coordinates;
}

// ============================================
// EVENT TYPES (Discriminated Union)
// ============================================

export const EventType = {
	WORKSHOP: "WORKSHOP",
	CONCERT: "CONCERT",
	SEMINAR: "SEMINAR",
	MEETUP: "MEETUP",
} as const;

export type EventTypeValue = (typeof EventType)[keyof typeof EventType];

// Base fields for all event types
interface EventBase {
	id?: string;
	title: string;
	description: string;
	price?: number; // Free if omitted
	orgId: string;
	orgName: string; // Denormalized for performance
	location: Location;
	date: Timestamp;
	bannerUrl?: string;
	createdAt?: Timestamp;
	updatedAt?: Timestamp;
}

// Workshop event
export interface WorkshopEvent extends EventBase {
	type: "WORKSHOP";
	mentorName: string;
	syllabus: string[];
	maxParticipants?: number;
}

// Concert event
export interface ConcertEvent extends EventBase {
	type: "CONCERT";
	lineup: string[];
	gateOpen: string;
}

// Seminar event
export interface SeminarEvent extends EventBase {
	type: "SEMINAR";
	speakers: {
		name: string;
		title?: string;
		photoUrl?: string;
	}[];
	topics?: string[];
}

// Meetup event
export interface MeetupEvent extends EventBase {
	type: "MEETUP";
	agenda?: string;
	maxParticipants?: number;
}

// Discriminated union type
export type Event = WorkshopEvent | ConcertEvent | SeminarEvent | MeetupEvent;

// ============================================
// EVENT FORM TYPES
// ============================================

export interface LocationInput {
	name: string;
	address: string;
	placeId?: string;
	coordinates?: Coordinates;
}

export interface CreateEventFormData {
	type: EventTypeValue;
	title: string;
	description: string;
	location: LocationInput;
	date: string; // ISO string for form
	time: string;
	bannerUrl?: string;
	// Type-specific fields (optional, depends on type)
	mentorName?: string;
	syllabus?: string[];
	lineup?: string[];
	gateOpen?: string;
	speakers?: { name: string; title?: string }[];
	topics?: string[];
	agenda?: string;
	maxParticipants?: number;
}

export interface UpdateEventFormData extends Partial<CreateEventFormData> { }

// ============================================
// EVENT HELPER TYPES
// ============================================

// Event with organization details
export type EventWithOrganization = Event & {
	organization?: {
		id: string;
		name: string;
		slug: string;
		logoUrl?: string;
	};
};

// Legacy compatibility alias
export type EventWithOrganizer = Event & {
	organizer?: User;
};

// Legacy custom field types (for backward compatibility)
export const CustomFieldType = {
	TEXT: "text",
	NUMBER: "number",
	DATE: "date",
	TIME: "time",
	SELECT: "select",
	CHECKBOX: "checkbox",
	RADIO: "radio",
	EMAIL: "email",
	PHONE: "phone",
	TEXTAREA: "textarea",
} as const;

export type CustomFieldTypeValue =
	(typeof CustomFieldType)[keyof typeof CustomFieldType];

export interface CustomField {
	id: string;
	label: string;
	type: CustomFieldTypeValue;
	options?: string[];
	required?: boolean;
	placeholder?: string;
}
