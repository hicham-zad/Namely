/**
 * lib/supabase-server.ts
 * Server-side Supabase client for Next.js API routes and Server Components.
 * Uses the SERVICE ROLE key — never expose this to the browser.
 *
 * Lazily initialised so Next.js build doesn't throw when env vars are absent.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Returns the server-side Supabase client (service role).
 * Call this inside functions — not at module level — to avoid build-time errors.
 */
export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. Add them to .env.local"
    );
  }

  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export default getSupabase;

