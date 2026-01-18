import { z } from "zod";

// ============================================
// FIRESTORE HELPERS
// ============================================

/**
 * Helper untuk menangani Timestamp Firestore
 * Bisa berupa Date, Object Firebase Timestamp, atau null
 */
export const FirestoreTimestamp = z.any();

// ============================================
// LOCATION SCHEMA (Google Maps Integration)
// ============================================

/**
 * Skema Lokasi dengan integrasi Google Maps Places API
 */
export const LocationSchema = z.object({
    name: z.string().min(1, "Nama tempat harus diisi"),
    address: z.string().min(5, "Alamat lengkap diperlukan"),
    placeId: z.string().min(1, "Place ID dari Google Maps diperlukan"),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
    }),
});

export type LocationData = z.infer<typeof LocationSchema>;

// Schema untuk form input lokasi (tanpa placeId untuk manual input)
export const LocationInputSchema = z.object({
    name: z.string().min(1, "Nama tempat harus diisi"),
    address: z.string().min(5, "Alamat lengkap diperlukan"),
    placeId: z.string().optional(),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
});

export type LocationInputData = z.infer<typeof LocationInputSchema>;
