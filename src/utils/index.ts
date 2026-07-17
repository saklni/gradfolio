// =============================================================================
// Gradfolio — Utility Functions
// =============================================================================

// `cn` lives in `@/lib/utils` (it needs to be importable from shadcn/ui
// components without a circular dependency on this file). Re-exported here
// so `@/utils` remains a single, convenient import surface for the rest of
// the app instead of maintaining two separate implementations that could
// drift out of sync.
export { cn } from "@/lib/utils";

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Get initials from a full name (for avatar fallback).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Validate that a file is an allowed image type and within the size limit.
 * Used by every client-side image uploader (cover, avatar) so the size/type
 * rules always match the single source of truth in `CLOUDINARY_CONFIG`
 * instead of each component hardcoding its own (and drifting out of sync).
 */
export function validateImageFile(
  file: File,
  allowedTypes: readonly string[],
  maxSize: number
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Format file tidak didukung. Gunakan: ${allowedTypes
        .map((t) => t.replace("image/", "").toUpperCase())
        .join(", ")}`,
    };
  }
  if (file.size > maxSize) {
    const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${maxMB}MB.`,
    };
  }
  return { valid: true };
}
