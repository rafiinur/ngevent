import { z } from "zod";
import { FirestoreTimestamp } from "@/features/event/schemas/location-schema";

// ============================================
// ORGANIZATION SCHEMA
// ============================================

/**
 * Schema untuk dokumen Organization di Firestore
 * Representasi komunitas/organisasi yang bisa membuat event
 */
export const OrganizationSchema = z.object({
    id: z.string().optional(), // Auto-generated oleh Firestore
    name: z.string().min(3, "Nama komunitas minimal 3 karakter"),
    slug: z.string().min(3, "Slug minimal 3 karakter"), // Untuk URL unik: /org/komunitas-react
    description: z.string().max(500, "Deskripsi maksimal 500 karakter"),
    logoUrl: z.string().url("URL logo tidak valid").optional(),
    ownerId: z.string().min(1, "Owner ID wajib diisi"), // UID Pemilik
    createdAt: FirestoreTimestamp,
});

export type OrganizationDocData = z.infer<typeof OrganizationSchema>;

// Schema untuk create organization (form input)
export const CreateOrganizationSchema = z.object({
    name: z.string().min(3, "Nama komunitas minimal 3 karakter"),
    slug: z.string()
        .min(3, "Slug minimal 3 karakter")
        .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
    description: z.string().max(500, "Deskripsi maksimal 500 karakter"),
    logoUrl: z.string().url("URL logo tidak valid").optional().or(z.literal("")),
});

export type CreateOrganizationData = z.infer<typeof CreateOrganizationSchema>;

// Schema untuk update organization
export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

export type UpdateOrganizationData = z.infer<typeof UpdateOrganizationSchema>;
