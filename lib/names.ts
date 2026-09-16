/**
 * lib/names.ts
 * All Supabase queries for the programmatic /names/[slug] pages.
 * Server-side only — mirrors lib/blog.ts patterns.
 */

import { getSupabase } from "./supabase-server";

// Lazy helper — call inside each function so Supabase is never initialised at build time
function db() {
  return getSupabase();
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MiddleNames {
  classic: string[];
  modern: string[];
  one_syllable: string[];
  family_friendly: string[];
}

export interface SiblingNames {
  boys: string[];
  girls: string[];
}

export interface FamousNamesakesEntry {
  name: string;
  known_for: string;
}

export interface NamePage {
  id: string;
  slug: string;
  name: string;
  gender: "girl" | "boy" | "unisex";
  origin: string;
  meaning_short: string;
  meaning_long: string;        // plain text, double-newline between paragraphs
  pronunciation_ipa: string;
  pronunciation_text: string;
  syllables: number;
  nicknames: string[] | null;
  ssa_rank: number | null;
  ssa_year: number | null;
  trend_direction: "rising" | "falling" | "stable" | null;
  trend_context: string | null;
  middle_names: MiddleNames | null;
  similar_names: string[] | null;  // array of slugs
  sibling_names: SiblingNames | null;
  famous_namesakes: FamousNamesakesEntry[] | null;
  personality_note: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface NamePageSummary {
  slug: string;
  name: string;
  gender: "girl" | "boy" | "unisex";
  origin: string;
  meaning_short: string;
  pronunciation_text: string;
  ssa_rank: number | null;
  trend_direction: "rising" | "falling" | "stable" | null;
}

// ── Get single name ────────────────────────────────────────────────────────────

export async function getNameBySlug(slug: string): Promise<NamePage | null> {
  try {
    const { data, error } = await db()
      .from("name_pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error?.code === "PGRST116") return null;
    if (error) throw error;

    return data as NamePage;
  } catch {
    return null;
  }
}

// ── Get minimal data for a set of slugs (for similar-name cards) ──────────────

export async function getNameSummariesBySlugs(
  slugs: string[]
): Promise<NamePageSummary[]> {
  if (!slugs || slugs.length === 0) return [];

  try {
    const { data, error } = await db()
      .from("name_pages")
      .select(
        "slug, name, gender, origin, meaning_short, pronunciation_text, ssa_rank, trend_direction"
      )
      .in("slug", slugs)
      .eq("status", "published");

    if (error) throw error;
    return (data as NamePageSummary[]) || [];
  } catch {
    return [];
  }
}

// ── All published slugs (for sitemap + generateStaticParams) ──────────────────

export async function getAllNameSlugs(): Promise<string[]> {
  try {
    const { data, error } = await db()
      .from("name_pages")
      .select("slug")
      .eq("status", "published")
      .order("ssa_rank", { ascending: true, nullsFirst: false });

    if (error) throw error;
    return (data || []).map((r: { slug: string }) => r.slug);
  } catch {
    return [];
  }
}

// ── Browse by gender ───────────────────────────────────────────────────────────

export async function getNamesByGender(
  gender: "girl" | "boy" | "unisex",
  limit = 24
): Promise<NamePageSummary[]> {
  try {
    const { data, error } = await db()
      .from("name_pages")
      .select(
        "slug, name, gender, origin, meaning_short, pronunciation_text, ssa_rank, trend_direction"
      )
      .eq("status", "published")
      .eq("gender", gender)
      .order("ssa_rank", { ascending: true, nullsFirst: false })
      .limit(limit);

    if (error) throw error;
    return (data as NamePageSummary[]) || [];
  } catch {
    return [];
  }
}

// ── All names for /names index page ───────────────────────────────────────────

export async function listNamePages(
  page = 1,
  limit = 48,
  gender?: "girl" | "boy" | "unisex"
): Promise<{ names: NamePageSummary[]; total: number }> {
  const offset = (page - 1) * limit;

  try {
    let query = db()
      .from("name_pages")
      .select(
        "slug, name, gender, origin, meaning_short, pronunciation_text, ssa_rank, trend_direction",
        { count: "exact" }
      )
      .eq("status", "published")
      .order("ssa_rank", { ascending: true, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (gender) {
      query = query.eq("gender", gender);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { names: (data as NamePageSummary[]) || [], total: count || 0 };
  } catch {
    return { names: [], total: 0 };
  }
}
