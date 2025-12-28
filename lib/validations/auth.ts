import { z } from "zod";

// Login Form Schema
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

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup/Register Form Schema
export const signupSchema = z
    .object({
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
        role: z.enum(["organizer", "guest"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password tidak sama",
        path: ["confirmPassword"],
    });

export type SignupFormData = z.infer<typeof signupSchema>;

// Reset Password Schema
export const resetPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
