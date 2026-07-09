/**
 * lib/supabase-server-ssr.ts
 * Server-side Supabase client for Server Components and Route Handlers.
 * Uses @supabase/ssr with cookie-based sessions (ANON key).
 *
 * Usage: `const supabase = await createServerSupabaseClient();`
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` is called from Server Components where cookies can't be set.
            // This is fine — the middleware handles the session refresh.
          }
        },
      },
    }
  );
}
