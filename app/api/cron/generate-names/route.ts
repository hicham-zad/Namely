/**
 * app/api/cron/generate-names/route.ts
 *
 * POST /api/cron/generate-names
 *
 * Called daily by cron-job.org. Pulls 3 pending names from names_queue,
 * generates full pSEO content via OpenAI, runs QA checks, upserts to
 * name_pages, and logs the run summary to generation_runs.
 *
 * Security: requires Authorization: Bearer <CRON_SECRET>
 *
 * Idempotent: status lock + upsert-on-conflict means a double-fire is safe.
 * Fault-isolated: one failed name never kills the other two.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import {
  generateNameContent,
  runQAChecks,
  type NameQueueRow,
} from "@/lib/name-generator";

// ── Config ────────────────────────────────────────────────────────────────────

const BATCH_SIZE = 3;
const OPENAI_RATE_LIMIT_MS = 1000; // 1 s between calls

// ── Auth helper ───────────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.warn("[cron] CRON_SECRET is not set — rejecting all requests");
    return false;
  }
  const authHeader = req.headers.get("authorization") ?? "";
  const altHeader = req.headers.get("x-cron-secret") ?? "";
  return (
    authHeader === `Bearer ${secret}` || altHeader === secret
  );
}

// ── Supabase + OpenAI clients (lazy, inside handler) ─────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supabase = SupabaseClient<any, any, any>;

function getClients(): { supabase: Supabase; openai: OpenAI } {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  }
  if (!openaiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const supabase: Supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
  const openai = new OpenAI({ apiKey: openaiKey });

  return { supabase, openai };
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Auth check
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const runStart = Date.now();
  let supabase: Supabase;
  let openai: OpenAI;

  try {
    ({ supabase, openai } = getClients());
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[cron] Client init failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  // 2. Two-step lock: select pending rows, then mark 'processing'.
  //    status='processing' is the idempotency guard — a double-fire finds
  //    the same rows already locked and skips them.
  let namesToProcess: NameQueueRow[] = [];

  {
    const { data: pending, error: selectErr } = await supabase
      .from("names_queue")
      .select("*")
      .eq("status", "pending")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (selectErr) {
      console.error("[cron] Failed to fetch pending names:", selectErr.message);
      return NextResponse.json(
        { error: "DB select failed", detail: selectErr.message },
        { status: 500 }
      );
    }

    namesToProcess = (pending ?? []) as NameQueueRow[];

    if (namesToProcess.length > 0) {
      const slugsToLock = namesToProcess.map((n) => n.slug);
      const { error: lockUpdateErr } = await supabase
        .from("names_queue")
        .update({ status: "processing", updated_at: new Date().toISOString() })
        .in("slug", slugsToLock)
        .eq("status", "pending"); // only lock still-pending rows (idempotency)

      if (lockUpdateErr) {
        console.error("[cron] Failed to lock rows:", lockUpdateErr.message);
        return NextResponse.json(
          { error: "DB lock failed", detail: lockUpdateErr.message },
          { status: 500 }
        );
      }
    }
  }

  // 3. Nothing to do — cron fired but queue is empty (or all processing)
  if (namesToProcess.length === 0) {
    const runMs = Date.now() - runStart;
    await logRun(supabase, {
      total: 0,
      published_count: 0,
      failed_count: 0,
      skipped_count: 0,
      names_published: [],
      names_failed: [],
      duration_ms: runMs,
    });
    return NextResponse.json({
      ok: true,
      message: "Queue empty — nothing to process",
      published: 0,
      failed: 0,
      duration_ms: runMs,
    });
  }

  // 4. Fetch last 100 published personality_notes for uniqueness check
  const { data: recent100 } = await supabase
    .from("name_pages")
    .select("personality_note")
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(100);

  const last100Notes = (recent100 ?? [])
    .map((r: { personality_note: string }) => r.personality_note)
    .filter(Boolean) as string[];

  // 5. Process each name — isolated try/catch so failures don't block others
  const namesPublished: string[] = [];
  const namesFailed: { slug: string; reason: string }[] = [];

  for (let i = 0; i < namesToProcess.length; i++) {
    const nameData = namesToProcess[i];
    console.log(
      `[cron] Processing ${i + 1}/${namesToProcess.length}: ${nameData.name} (${nameData.slug})`
    );

    try {
      // ── Generate AI content ──────────────────────────────────────────────
      const ai = await generateNameContent(nameData, openai);

      // ── QA checks ────────────────────────────────────────────────────────
      const qa = runQAChecks(nameData, ai, last100Notes);

      if (!qa.pass) {
        const reason = qa.reasons.join(" | ");
        console.warn(`[cron] QA FAILED for ${nameData.name}:`, reason);

        await supabase
          .from("names_queue")
          .update({
            status: "failed",
            fail_reason: reason,
            updated_at: new Date().toISOString(),
          })
          .eq("slug", nameData.slug);

        namesFailed.push({ slug: nameData.slug, reason });
        continue;
      }

      // ── Upsert into name_pages ───────────────────────────────────────────
      const row = {
        slug: nameData.slug,
        name: nameData.name,
        gender: nameData.gender,
        origin: nameData.origin,
        meaning_short: ai.meaning_short,
        meaning_long: ai.meaning_long,
        pronunciation_ipa: ai.pronunciation_ipa,
        pronunciation_text: ai.pronunciation_text,
        syllables: nameData.syllables,
        nicknames: nameData.nicknames,
        ssa_rank: nameData.ssa_rank,
        ssa_year: nameData.ssa_year,
        trend_direction: nameData.trend_direction,
        trend_context: nameData.trend_context,
        middle_names: ai.middle_names,
        similar_names: nameData.similar_names,
        sibling_names: nameData.sibling_names,
        famous_namesakes:
          ai.famous_namesakes && ai.famous_namesakes.length > 0
            ? ai.famous_namesakes
            : null,
        personality_note: ai.personality_note,
        faqs: ai.faqs,
        meta_title: ai.meta_title,
        meta_description: ai.meta_description,
        status: "published",
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from("name_pages")
        .upsert(row, { onConflict: "slug" });

      if (upsertErr) {
        throw new Error(`Supabase upsert failed: ${upsertErr.message}`);
      }

      // ── Mark queue row published ─────────────────────────────────────────
      await supabase
        .from("names_queue")
        .update({
          status: "published",
          updated_at: new Date().toISOString(),
        })
        .eq("slug", nameData.slug);

      // ── Add new personality_note to in-memory list for cross-run checks ──
      last100Notes.unshift(ai.personality_note);
      if (last100Notes.length > 100) last100Notes.pop();

      namesPublished.push(nameData.slug);
      console.log(`[cron] ✅ Published: ${nameData.name}`);

      // ── Queue any missing similar/sibling slugs ──────────────────────────
      await queueMissingSlugs(supabase, nameData);
    } catch (err: unknown) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`[cron] ❌ Error processing ${nameData.name}:`, reason);

      // Mark failed in queue — don't rethrow
      // best-effort update — don't await errors
      void supabase
        .from("names_queue")
        .update({
          status: "failed",
          fail_reason: reason.substring(0, 1000),
          updated_at: new Date().toISOString(),
        })
        .eq("slug", nameData.slug);

      namesFailed.push({ slug: nameData.slug, reason: reason.substring(0, 500) });
    }

    // Rate-limit between OpenAI calls (skip delay after last item)
    if (i < namesToProcess.length - 1) {
      await new Promise((r) => setTimeout(r, OPENAI_RATE_LIMIT_MS));
    }
  }

  // 6. Log run summary
  const runMs = Date.now() - runStart;
  await logRun(supabase, {
    total: namesToProcess.length,
    published_count: namesPublished.length,
    failed_count: namesFailed.length,
    skipped_count: namesToProcess.length - namesPublished.length - namesFailed.length,
    names_published: namesPublished,
    names_failed: namesFailed,
    duration_ms: runMs,
  });

  // 7. Return summary (cron-job.org checks for HTTP 200 + body)
  const summary = {
    ok: true,
    published: namesPublished.length,
    failed: namesFailed.length,
    names_published: namesPublished,
    names_failed: namesFailed,
    duration_ms: runMs,
  };

  console.log("[cron] Run complete:", summary);
  return NextResponse.json(summary, { status: 200 });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Log a generation_runs row. Best-effort — never throws.
 */
async function logRun(
  supabase: Supabase,
  data: {
    total: number;
    published_count: number;
    failed_count: number;
    skipped_count: number;
    names_published: string[];
    names_failed: { slug: string; reason: string }[];
    duration_ms: number;
  }
) {
  try {
    await supabase.from("generation_runs").insert({
      run_at: new Date().toISOString(),
      total: data.total,
      published_count: data.published_count,
      failed_count: data.failed_count,
      skipped_count: data.skipped_count,
      names_published: data.names_published,
      names_failed: data.names_failed,
      duration_ms: data.duration_ms,
      triggered_by: "cron",
    });
  } catch (err) {
    console.error("[cron] Failed to log generation run:", err);
  }
}

/**
 * For similar_names and sibling_names slugs that don't exist in name_pages,
 * insert a minimal placeholder into names_queue (status=pending, priority=-1)
 * so they get picked up in a future run. Non-blocking.
 */
async function queueMissingSlugs(
  supabase: Supabase,
  nameData: NameQueueRow
) {
  try {
    // Collect all referenced slugs
    const referenced = new Set<string>();
    (nameData.similar_names ?? []).forEach((s) => referenced.add(s));
    const sib = nameData.sibling_names;
    if (sib) {
      (sib.boys ?? []).forEach((s) => referenced.add(s.toLowerCase()));
      (sib.girls ?? []).forEach((s) => referenced.add(s.toLowerCase()));
    }

    if (referenced.size === 0) return;

    // Check which already exist in name_pages or names_queue
    const slugList = [...referenced];

    const [pagesRes, queueRes] = await Promise.all([
      supabase.from("name_pages").select("slug").in("slug", slugList),
      supabase.from("names_queue").select("slug").in("slug", slugList),
    ]);

    const existingSlugs = new Set([
      ...(pagesRes.data ?? []).map((r: { slug: string }) => r.slug),
      ...(queueRes.data ?? []).map((r: { slug: string }) => r.slug),
    ]);

    const missing = slugList.filter((s) => !existingSlugs.has(s));
    if (missing.length === 0) return;

    // Insert minimal stubs — priority -1 so they're processed after real entries
    const stubs = missing.map((slug) => ({
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1), // title-case guess
      gender: "unisex" as const,
      origin: "Unknown",
      pronunciation_ipa: "",
      pronunciation_text: "",
      syllables: 1,
      status: "pending",
      priority: -1,
    }));

    // Use ignoreDuplicates to stay idempotent
    await supabase
      .from("names_queue")
      .upsert(stubs, { onConflict: "slug", ignoreDuplicates: true });

    if (missing.length > 0) {
      console.log(
        `[cron] Queued ${missing.length} missing slug(s) for future runs:`,
        missing
      );
    }
  } catch (err) {
    // Non-fatal — log and continue
    console.warn("[cron] queueMissingSlugs error (non-fatal):", err);
  }
}

// ── GET — health check (no auth required, safe to expose) ────────────────────

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/cron/generate-names",
    method: "POST",
    auth: "Authorization: Bearer <CRON_SECRET>",
    description: "Daily pSEO name page generator. Processes up to 3 pending names per run.",
  });
}
