/**
 * POST /api/generate-names
 *
 * 1. Authenticates the caller
 * 2. Calls OpenAI GPT-4o-mini
 * 3. Upserts AI names into `ai_names` table (service role — bypasses RLS)
 * 4. Appends the new pool items into `couple_name_pools`
 * 5. Returns the updated full pool + count of new names added
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabase } from "@/lib/supabase-server";

const COUNT = 40;

export async function POST(req: NextRequest) {
  // ── 1. Auth ────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const supabaseUser = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user }, error: authErr } = await supabaseUser.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Parse body ──────────────────────────────────────────────────
  const body = await req.json();
  const {
    coupleId = null,
    gender = null,
    user1StyleTags = [],
    user1Origins = [],
    user2StyleTags = [],
    user2Origins = [],
    avoidNames = [],
  } = body as {
    coupleId?: string | null;
    gender?: string | null;
    user1StyleTags?: string[];
    user1Origins?: string[];
    user2StyleTags?: string[];
    user2Origins?: string[];
    avoidNames?: string[];
  };

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  // ── 3. Build prompt ────────────────────────────────────────────────
  const genderText = gender && gender !== "both"
    ? `${gender} names only`
    : "names of any gender";

  const hasBothPartners = user2StyleTags.length > 0 || user2Origins.length > 0;

  const styleSection = hasBothPartners
    ? `Partner 1 style preferences: ${user1StyleTags.join(", ") || "none specified"}\nPartner 2 style preferences: ${user2StyleTags.join(", ") || "none specified"}`
    : `Style preferences: ${user1StyleTags.join(", ") || "none specified"}`;

  const allOrigins = [...new Set([...user1Origins, ...user2Origins])];
  const originText = allOrigins.length
    ? `Preferred name origins: ${allOrigins.join(", ")}`
    : "No origin filter — include names from any cultural origin";

  const avoidText = avoidNames.length > 0
    ? `\nDo not suggest any of these (already seen): ${avoidNames.slice(0, 60).join(", ")}.`
    : "";

  const partnerContext = hasBothPartners
    ? "This list is for a couple. Find names that bridge both partners' preferences — names they are both likely to love."
    : "This list is for a single person. Tailor suggestions closely to their style.";

  const prompt = `You are an expert baby naming consultant.
${partnerContext}

Generate exactly ${COUNT} baby name suggestions.

Gender: ${genderText}
${styleSection}
${originText}${avoidText}

Requirements:
- Be diverse: vary origins, syllable counts (1–4), and style within the prefs
- Each name must be real (not invented)
- No repeated names
- Prioritise names that are beautiful, meaningful, and timeless

Return ONLY a valid JSON array of exactly ${COUNT} objects. No markdown, no explanation:
[{"name":"...","origin":"...","meaning":"...","gender":"boy|girl|unisex"}]`;

  // ── 4. Call OpenAI ─────────────────────────────────────────────────
  let aiNames: Array<{ name: string; origin: string; meaning: string; gender: string }> = [];
  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
        max_tokens: 4000,
      }),
    });
    if (!aiRes.ok) throw new Error(`OpenAI ${aiRes.status}: ${await aiRes.text()}`);
    const aiData = await aiRes.json();
    const raw: string = aiData.choices?.[0]?.message?.content?.trim() ?? "";
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    aiNames = JSON.parse(cleaned);
  } catch (err: any) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ error: "AI generation failed: " + err.message }, { status: 502 });
  }

  if (!Array.isArray(aiNames) || aiNames.length === 0) {
    return NextResponse.json({ error: "Empty AI response" }, { status: 502 });
  }

  // ── 5. Upsert into ai_names (service role) ─────────────────────────
  const admin = getSupabase();

  // Deduplicate by (name, gender) — OpenAI sometimes returns duplicates in the same batch
  // which causes Postgres error 21000 ("cannot affect row a second time")
  const seenKeys = new Set<string>();
  const uniqueAiNames = aiNames.filter((n) => {
    const key = `${n.name.toLowerCase()}:${n.gender ?? gender ?? "unisex"}`;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  const toInsert = uniqueAiNames.map((n) => ({
    name: n.name,
    gender: n.gender ?? gender ?? "unisex",
    origin: n.origin ?? "Unknown",
    meaning: n.meaning ?? "",
    style_tags: [],
    syllable_count: 2,
    popularity_bucket: "rare",
  }));

  const { data: upserted, error: upsertErr } = await admin
    .from("ai_names")
    .upsert(toInsert, { onConflict: "name,gender", ignoreDuplicates: false })
    .select("id, name, gender, origin, meaning");

  if (upsertErr) {
    console.error("ai_names upsert error:", upsertErr);
    return NextResponse.json({ error: "Failed to save names: " + upsertErr.message }, { status: 500 });
  }

  // ── 6. Map AI names → PoolItems with real UUIDs ────────────────────
  type PoolItem = {
    nameId: string;
    source: "ai" | "db";
    aiData: { name: string; origin: string; meaning: string; gender: string };
  };

  const newItems: PoolItem[] = uniqueAiNames
    .map((n) => {
      const row = (upserted as any[])?.find(
        (r) => r.name === n.name && r.gender === (n.gender ?? gender ?? "unisex")
      );
      if (!row?.id) return null;
      return {
        nameId: row.id,
        source: "ai" as const,
        aiData: { name: n.name, origin: n.origin ?? "", meaning: n.meaning ?? "", gender: n.gender ?? "unisex" },
      };
    })
    .filter(Boolean) as PoolItem[];

  // ── 7. Merge into couple_name_pools ───────────────────────────────
  let existingPool: PoolItem[] = [];
  if (coupleId) {
    const { data: existing } = await admin
      .from("couple_name_pools")
      .select("pool")
      .eq("couple_id", coupleId)
      .single();
    if (existing?.pool) {
      existingPool = typeof existing.pool === "string"
        ? JSON.parse(existing.pool)
        : existing.pool;
    }

    const existingIds = new Set(existingPool.map((p) => p.nameId));
    const merged = [...existingPool, ...newItems.filter((p) => !existingIds.has(p.nameId))];

    await admin
      .from("couple_name_pools")
      .upsert(
        { couple_id: coupleId, pool: JSON.stringify(merged), generated_at: new Date().toISOString() },
        { onConflict: "couple_id" }
      );

    return NextResponse.json({ pool: merged, namesAdded: newItems.length });
  }

  // Solo user: just return the new items (no pool persistence)
  return NextResponse.json({ pool: newItems, namesAdded: newItems.length });
}
