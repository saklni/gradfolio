// =============================================================================
// Gradfolio — Auth Validation Schemas
// =============================================================================

import { z } from "zod";
import { VALIDATION_LIMITS } from "@/constants";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(VALIDATION_LIMITS.PASSWORD_MIN, `Password minimal ${VALIDATION_LIMITS.PASSWORD_MIN} karakter`),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(VALIDATION_LIMITS.FULL_NAME_MIN, `Nama minimal ${VALIDATION_LIMITS.FULL_NAME_MIN} karakter`)
      .max(VALIDATION_LIMITS.FULL_NAME_MAX, `Nama maksimal ${VALIDATION_LIMITS.FULL_NAME_MAX} karakter`)
      .trim(),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(VALIDATION_LIMITS.PASSWORD_MIN, `Password minimal ${VALIDATION_LIMITS.PASSWORD_MIN} karakter`)
      .max(VALIDATION_LIMITS.PASSWORD_MAX, `Password maksimal ${VALIDATION_LIMITS.PASSWORD_MAX} karakter`),
    confirmPassword: z
      .string()
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
