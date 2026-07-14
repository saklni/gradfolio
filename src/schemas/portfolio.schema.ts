// =============================================================================
// Gradfolio — Portfolio Validation Schemas
// =============================================================================

import { z } from "zod";
import { CATEGORIES, JENIS_PORTFOLIO, RESOURCE_TYPES, VALIDATION_LIMITS } from "@/constants";

/**
 * Schema for a single portfolio resource link.
 */
export const resourceSchema = z.object({
  id: z.string().optional(),
  resource_type: z.enum(RESOURCE_TYPES, {
    message: "Jenis resource tidak valid",
  }),
  label: z
    .string()
    .min(1, "Label resource wajib diisi")
    .max(VALIDATION_LIMITS.RESOURCE_LABEL_MAX, `Label maksimal ${VALIDATION_LIMITS.RESOURCE_LABEL_MAX} karakter`)
    .trim(),
  url: z
    .string()
    .min(1, "URL resource wajib diisi")
    .url("Format URL tidak valid")
    .refine((url) => url.startsWith("https://"), {
      message: "URL harus menggunakan HTTPS",
    }),
});

export type ResourceFormData = z.infer<typeof resourceSchema>;

/**
 * Schema for creating/updating a portfolio item.
 */
export const portfolioSchema = z.object({
  title: z
    .string()
    .min(VALIDATION_LIMITS.TITLE_MIN, `Judul minimal ${VALIDATION_LIMITS.TITLE_MIN} karakter`)
    .max(VALIDATION_LIMITS.TITLE_MAX, `Judul maksimal ${VALIDATION_LIMITS.TITLE_MAX} karakter`)
    .trim(),
  category: z.enum(CATEGORIES, {
    message: "Kategori wajib dipilih",
  }),
  jenis_portfolio: z.enum(JENIS_PORTFOLIO, {
    message: "Jenis portfolio wajib dipilih",
  }),
  semester: z
    .number()
    .int()
    .min(1, "Semester minimal 1")
    .max(14, "Semester maksimal 14")
    .nullable()
    .optional(),
  tahun_pengerjaan: z
    .number()
    .int("Tahun harus berupa angka bulat")
    .min(2000, "Tahun pengerjaan tidak valid")
    .max(new Date().getFullYear(), "Tahun pengerjaan tidak boleh di masa depan"),
  deskripsi_singkat: z
    .string()
    .min(1, "Deskripsi singkat wajib diisi")
    .max(
      VALIDATION_LIMITS.SHORT_DESCRIPTION_MAX,
      `Deskripsi singkat maksimal ${VALIDATION_LIMITS.SHORT_DESCRIPTION_MAX} karakter`
    )
    .trim(),
  deskripsi_lengkap: z
    .string()
    .min(
      VALIDATION_LIMITS.LONG_DESCRIPTION_MIN,
      `Deskripsi lengkap minimal ${VALIDATION_LIMITS.LONG_DESCRIPTION_MIN} karakter`
    )
    .max(
      VALIDATION_LIMITS.LONG_DESCRIPTION_MAX,
      `Deskripsi lengkap maksimal ${VALIDATION_LIMITS.LONG_DESCRIPTION_MAX} karakter`
    )
    .trim(),
  peran: z
    .string()
    .max(VALIDATION_LIMITS.ROLE_MAX, `Peran maksimal ${VALIDATION_LIMITS.ROLE_MAX} karakter`)
    .trim()
    .nullable()
    .optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  tech_stack: z
    .array(
      z
        .string()
        .min(1)
        .max(VALIDATION_LIMITS.TECH_STACK_ITEM_MAX, `Nama teknologi maksimal ${VALIDATION_LIMITS.TECH_STACK_ITEM_MAX} karakter`)
    )
    .max(VALIDATION_LIMITS.TECH_STACK_MAX_ITEMS, `Maksimal ${VALIDATION_LIMITS.TECH_STACK_MAX_ITEMS} teknologi`)
    .default([]),
  resources: z.array(resourceSchema).default([]),
});

export type PortfolioFormData = z.infer<typeof portfolioSchema>;
