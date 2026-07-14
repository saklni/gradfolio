// =============================================================================
// Gradfolio — Portfolio Types
// =============================================================================
// Application-level types for portfolio-related data.
// =============================================================================

import type { Database } from "./database.types";

/**
 * Database row types (shorthand aliases).
 */
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type PortfolioItem = Database["public"]["Tables"]["portfolio_items"]["Row"];
export type PortfolioItemInsert = Database["public"]["Tables"]["portfolio_items"]["Insert"];
export type PortfolioItemUpdate = Database["public"]["Tables"]["portfolio_items"]["Update"];

export type PortfolioResource = Database["public"]["Tables"]["portfolio_resources"]["Row"];
export type PortfolioResourceInsert = Database["public"]["Tables"]["portfolio_resources"]["Insert"];
export type PortfolioResourceUpdate = Database["public"]["Tables"]["portfolio_resources"]["Update"];

export type Institution = Database["public"]["Tables"]["institutions"]["Row"];

/**
 * Portfolio item with its resources and owner profile (for detail views).
 */
export type PortfolioItemWithResources = PortfolioItem & {
  resources: PortfolioResource[];
};

export type PortfolioItemWithOwner = PortfolioItem & {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url" | "institution" | "program_studi" | "angkatan">;
};

export type PortfolioItemFull = PortfolioItem & {
  resources: PortfolioResource[];
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url" | "institution" | "program_studi" | "angkatan" | "bio">;
};

/**
 * Server Action response type for consistent error handling.
 */
export type ActionResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

/**
 * Upload response from Cloudinary route handlers.
 */
export type UploadResponse = {
  success: boolean;
  message: string;
  url?: string;
  publicId?: string;
};
