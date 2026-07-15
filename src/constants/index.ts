// =============================================================================
// Gradfolio — Application Constants
// =============================================================================
// Centralized constants used across the application.
// Avoid hardcoding these values anywhere else.
// =============================================================================

/**
 * Portfolio categories — broad classification of work.
 */
export const CATEGORIES = [
  "Software",
  "Hardware",
  "Design",
  "Riset",
  "Media",
  "Lainnya",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Jenis Portfolio — specific type of work within a category.
 */
export const JENIS_PORTFOLIO = [
  "Website",
  "Mobile App",
  "Desktop App",
  "UI/UX Design",
  "Graphic Design",
  "Poster",
  "Logo",
  "Penelitian",
  "Prototype Mesin",
  "Alat Elektronik",
  "Robot",
  "IoT",
  "Video",
  "Fotografi",
  "Animasi",
  "Game",
  "Data Science",
  "Machine Learning",
  "Praktikum",
  "Tugas Mata Kuliah",
  "MBKM",
  "Magang",
  "Personal Project",
  "Organisasi",
  "Lomba",
  "Lainnya",
] as const;

export type JenisPortfolio = (typeof JENIS_PORTFOLIO)[number];

/**
 * Resource types — kinds of external links attached to a portfolio item.
 */
export const RESOURCE_TYPES = [
  "github",
  "live_demo",
  "google_drive",
  "figma",
  "youtube",
  "documentation",
  "pdf",
  "other",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

/**
 * Human-readable labels for resource types.
 */
export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  github: "GitHub Repository",
  live_demo: "Live Demo",
  google_drive: "Google Drive",
  figma: "Figma",
  youtube: "YouTube",
  documentation: "Dokumentasi",
  pdf: "PDF Laporan",
  other: "Lainnya",
};

/**
 * Default resource type used when a new (empty) resource row is added
 * to a portfolio item form. Must always be a valid member of RESOURCE_TYPES.
 */
export const DEFAULT_RESOURCE_TYPE: ResourceType = "github";

/**
 * Semester options for portfolio items.
 */
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type Semester = (typeof SEMESTERS)[number];

/**
 * Portfolio status options.
 */
export const PORTFOLIO_STATUS = ["draft", "published"] as const;

export type PortfolioStatus = (typeof PORTFOLIO_STATUS)[number];

/**
 * Validation limits.
 */
export const VALIDATION_LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 150,
  SHORT_DESCRIPTION_MAX: 200,
  LONG_DESCRIPTION_MIN: 50,
  LONG_DESCRIPTION_MAX: 5000,
  BIO_MAX: 500,
  FULL_NAME_MIN: 2,
  FULL_NAME_MAX: 100,
  PROGRAM_STUDI_MAX: 100,
  INSTITUTION_MAX: 150,
  ROLE_MAX: 100,
  TECH_STACK_MAX_ITEMS: 20,
  TECH_STACK_ITEM_MAX: 50,
  RESOURCE_LABEL_MAX: 100,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 72,
} as const;

/**
 * Cloudinary upload configuration.
 */
export const CLOUDINARY_CONFIG = {
  COVER_FOLDER: "gradfolio/covers",
  AVATAR_FOLDER: "gradfolio/avatars",
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
} as const;

/**
 * Routes configuration.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  DASHBOARD_PROFILE: "/dashboard/profile",
  DASHBOARD_PORTFOLIO_NEW: "/dashboard/portfolio/new",
  PORTFOLIO_SHARE: "/portfolio",
} as const;

/**
 * Protected routes that require authentication.
 */
export const PROTECTED_ROUTES = ["/dashboard", "/onboarding"] as const;

/**
 * Auth routes — redirect to dashboard if already logged in.
 */
export const AUTH_ROUTES = ["/login", "/register"] as const;
