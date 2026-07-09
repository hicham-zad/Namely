/**
 * lib/supabase-browser.ts
 * Browser-side Supabase client using @supabase/ssr.
 * Uses the ANON key — safe to expose to the browser.
 * Cookie-based session management for SSR compatibility.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
