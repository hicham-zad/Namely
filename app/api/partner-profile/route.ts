/**
 * GET /api/partner-profile?partnerId=<uuid>
 *
 * Fetches the partner's relevant profile fields (gender_preference,
 * origin_filters, style_tags) using the service-role key, which bypasses
 * RLS. Security is enforced manually: we verify the caller and the
 * requested partnerId are in the same couple before returning any data.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabase } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const partnerId = req.nextUrl.searchParams.get("partnerId");
  if (!partnerId) {
    return NextResponse.json({ error: "Missing partnerId" }, { status: 400 });
  }

  // 1. Identify the calling user via their session cookie
  const cookieStore = await cookies();
  const supabaseUser = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user }, error: authErr } = await supabaseUser.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Use service-role client to verify they share a couple
  const admin = getSupabase();

  const { data: myMembership } = await admin
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", user.id)
    .single();

  if (!myMembership?.couple_id) {
    return NextResponse.json({ error: "Not in a couple" }, { status: 403 });
  }

  const { data: partnerMembership } = await admin
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", partnerId)
    .eq("couple_id", myMembership.couple_id)
    .single();

  if (!partnerMembership) {
    return NextResponse.json({ error: "Not your partner" }, { status: 403 });
  }

  // 3. Safe to fetch — return only relevant preference fields
  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("id, gender_preference, origin_filters, style_tags, display_name")
    .eq("id", partnerId)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
