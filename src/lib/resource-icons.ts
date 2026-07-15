// =============================================================================
// Gradfolio — Resource Type Icons
// =============================================================================
// IMPORTANT: This file intentionally has NO "use client" directive.
// It only exports plain icon component references (Lucide icons are safe to
// render on the server). Previously this map lived inside a "use client"
// component (ResourceLinkFields.tsx); importing it from a Server Component
// (the Portfolio Share page) caused a runtime crash ("Element type is
// invalid... got undefined") because Next.js turns every export of a
// "use client" module into an opaque client reference when consumed from
// server code, and indexing into that reference at runtime doesn't resolve
// to a real component. Keeping this mapping in a plain module fixes that
// for both server and client usage.
// =============================================================================

import {
  GitBranch,
  Globe,
  HardDrive,
  PenTool,
  Video,
  FileText,
  FileType,
  Link2,
  type LucideIcon,
} from "lucide-react";
import type { ResourceType } from "@/constants";

export const RESOURCE_TYPE_ICONS: Record<ResourceType, LucideIcon> = {
  github: GitBranch,
  live_demo: Globe,
  google_drive: HardDrive,
  figma: PenTool,
  youtube: Video,
  documentation: FileText,
  pdf: FileType,
  other: Link2,
};
