// =============================================================================
// Gradfolio — Profile Validation Schemas
// =============================================================================

import { z } from "zod";
import { VALIDATION_LIMITS } from "@/constants";

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(VALIDATION_LIMITS.FULL_NAME_MIN, `Nama minimal ${VALIDATION_LIMITS.FULL_NAME_MIN} karakter`)
    .max(VALIDATION_LIMITS.FULL_NAME_MAX, `Nama maksimal ${VALIDATION_LIMITS.FULL_NAME_MAX} karakter`)
    .trim(),
  institution: z
    .string()
    .max(VALIDATION_LIMITS.INSTITUTION_MAX, `Institusi maksimal ${VALIDATION_LIMITS.INSTITUTION_MAX} karakter`)
    .trim()
    .nullable()
    .optional(),
  program_studi: z
    .string()
    .max(VALIDATION_LIMITS.PROGRAM_STUDI_MAX, `Program studi maksimal ${VALIDATION_LIMITS.PROGRAM_STUDI_MAX} karakter`)
    .trim()
    .nullable()
    .optional(),
  angkatan: z
    .number()
    .int("Angkatan harus berupa tahun")
    .min(1900, "Tahun angkatan tidak valid")
    .max(new Date().getFullYear() + 1, "Tahun angkatan tidak valid")
    .nullable()
    .optional(),
  bio: z
    .string()
    .max(VALIDATION_LIMITS.BIO_MAX, `Bio maksimal ${VALIDATION_LIMITS.BIO_MAX} karakter`)
    .trim()
    .nullable()
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Schema for the onboarding form — same as profile but with required institution.
 */
export const onboardingSchema = profileSchema.extend({
  institution: z
    .string()
    .min(1, "Institusi wajib diisi")
    .max(VALIDATION_LIMITS.INSTITUTION_MAX, `Institusi maksimal ${VALIDATION_LIMITS.INSTITUTION_MAX} karakter`)
    .trim(),
  program_studi: z
    .string()
    .min(1, "Program studi wajib diisi")
    .max(VALIDATION_LIMITS.PROGRAM_STUDI_MAX, `Program studi maksimal ${VALIDATION_LIMITS.PROGRAM_STUDI_MAX} karakter`)
    .trim(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
