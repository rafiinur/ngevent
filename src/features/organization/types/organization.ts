import { Timestamp } from "firebase/firestore";

// ============================================
// ORGANIZATION TYPES
// ============================================

export interface Organization {
    id?: string;
    name: string;
    slug: string; // For unique URLs: /org/komunitas-react
    description: string;
    logoUrl?: string;
    ownerId: string; // Owner user UID
    createdAt: Timestamp;
}

export interface CreateOrganizationData {
    name: string;
    slug: string;
    description: string;
    logoUrl?: string;
}

export interface UpdateOrganizationData extends Partial<CreateOrganizationData> { }

// Organization with member count for listing
export interface OrganizationWithStats extends Organization {
    memberCount?: number;
    eventCount?: number;
}
