import { z } from "zod";

// ============================================
// AUTH FORM SCHEMAS
// ============================================

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),
    password: z
        .string()
        .min(1, "Password wajib diisi")
        .min(6, "Password minimal 6 karakter"),
});

export type LoginSchemaData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),
    password: z
        .string()
        .min(1, "Password wajib diisi")
        .min(6, "Password minimal 6 karakter")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password harus mengandung huruf besar, huruf kecil, dan angka"
        ),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password tidak sama",
        path: ["confirmPassword"],
    });

export type SignupSchemaData = z.infer<typeof signupSchema>;

export const resetPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),
});

export type ResetPasswordSchemaData = z.infer<typeof resetPasswordSchema>;
