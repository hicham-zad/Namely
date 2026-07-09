import { createServerSupabaseClient } from "@/lib/supabase-server-ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * OAuth callback handler.
 * Supabase redirects here after Google/Apple auth with a `code` query param.
 * We exchange it for a session, then redirect to the dashboard.
 * If the user has no profile row yet, redirect to onboarding.
 * If they were invited via /join/[code], pass that code to onboarding.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/discover";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has a profile (i.e., has completed onboarding)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (profile) {
          // Existing user — go to dashboard (or intended redirect)
          return NextResponse.redirect(`${origin}${redirect}`);
        } else {
          // New user — go to onboarding
          // Extract joinCode if they were invited via /join/[code]
          const joinCodeMatch = redirect.match(/^\/join\/([A-Z0-9]{6})$/i);
          const joinCode = joinCodeMatch ? joinCodeMatch[1].toUpperCase() : null;
          const onboardingUrl = joinCode
            ? `${origin}/onboarding?joinCode=${joinCode}`
            : `${origin}/onboarding`;
          return NextResponse.redirect(onboardingUrl);
        }
      }
    }
  }

  // If anything goes wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
