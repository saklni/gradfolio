// =============================================================================
// Gradfolio — Supabase Browser Client
// =============================================================================
// Creates a Supabase client for use in Client Components (browser).
// Uses the anon key which is safe to expose to the browser.
// =============================================================================

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
