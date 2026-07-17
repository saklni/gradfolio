// =============================================================================
// Gradfolio — Portfolio Collection (Bagikan Portofolio) Validation Schema
// =============================================================================

import { z } from "zod";
import { VALIDATION_LIMITS } from "@/constants";

/**
 * Schema for creating a new shareable collection ("bundle") of portfolio
 * items — e.g. "Portfolio untuk Lamaran Magang PT XYZ".
 */
export const collectionSchema = z.object({
  title: z
    .string()
    .min(VALIDATION_LIMITS.COLLECTION_TITLE_MIN, `Judul minimal ${VALIDATION_LIMITS.COLLECTION_TITLE_MIN} karakter`)
    .max(VALIDATION_LIMITS.COLLECTION_TITLE_MAX, `Judul maksimal ${VALIDATION_LIMITS.COLLECTION_TITLE_MAX} karakter`)
    .trim(),
  portfolio_item_ids: z
    .array(z.string().uuid("ID karya tidak valid"))
    .min(VALIDATION_LIMITS.COLLECTION_ITEMS_MIN, "Pilih minimal 1 karya untuk dibagikan")
    .max(VALIDATION_LIMITS.COLLECTION_ITEMS_MAX, `Maksimal ${VALIDATION_LIMITS.COLLECTION_ITEMS_MAX} karya per bundle`)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Terdapat karya duplikat dalam pilihan",
    }),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;
