/**
 * lib/blog.ts
 * All Supabase queries and markdown rendering for the blog.
 * Used by API routes and Server Components — server-side only.
 */

import { marked } from "marked";
import { getSupabase } from "./supabase-server";

// ── Markdown ──────────────────────────────────────────────────────────────────

marked.setOptions({ gfm: true, breaks: false } as object);

export function renderMarkdown(md: string): string {
  return marked.parse(md || "") as string;
}

// Lazy helper — call inside each function so Supabase is never initialised at build time
function db() {
  return getSupabase();
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_md: string;
  content_html: string;
  featured_image_url: string | null;
  topic: string;
  keywords: string[];
  reading_time: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostSummary
  extends Omit<BlogPost, "content_md" | "content_html"> {}

export interface PaginatedPosts {
  posts: BlogPostSummary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Frontmatter parser (used by import script) ────────────────────────────────

export function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const [, yamlBlock, body] = match;
  const meta: Record<string, string> = {};

  for (const line of yamlBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const rawVal = line.slice(colonIdx + 1).trim();
    meta[key] = rawVal.replace(/^["']|["']$/g, "");
  }

  return { meta, body: body.trim() };
}

// ── List posts ────────────────────────────────────────────────────────────────

export async function listPosts({
  page = 1,
  limit = 12,
  topic,
  adminMode = false,
}: {
  page?: number;
  limit?: number;
  topic?: string;
  adminMode?: boolean;
} = {}): Promise<PaginatedPosts> {
  const offset = (page - 1) * limit;

  let query = db()
    .from("blog_posts")
    .select(
      "slug, title, description, topic, keywords, reading_time, featured_image_url, status, published_at",
      { count: "exact" }
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (!adminMode) {
    query = query.eq("status", "published");
  }

  if (topic) {
    query = query.eq("topic", topic);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    posts: (data as BlogPostSummary[]) || [],
    pagination: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}

// ── Get single post ───────────────────────────────────────────────────────────

export async function getPostBySlug(
  slug: string,
  adminMode = false
): Promise<BlogPost | null> {
  const { data, error } = await db()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw error;

  if (!adminMode && data?.status !== "published") return null;

  return data as BlogPost;
}

// ── Related posts ─────────────────────────────────────────────────────────────

export async function getRelatedPosts(
  slug: string,
  topic: string
): Promise<BlogPostSummary[]> {
  const { data, error } = await db()
    .from("blog_posts")
    .select(
      "slug, title, description, featured_image_url, reading_time, published_at, topic, keywords, status"
    )
    .eq("status", "published")
    .eq("topic", topic)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) throw error;
  return (data as BlogPostSummary[]) || [];
}

// ── Topics ────────────────────────────────────────────────────────────────────

export async function getTopics(): Promise<{ topic: string; count: number }[]> {
  const { data, error } = await db()
    .from("blog_posts")
    .select("topic")
    .eq("status", "published");

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data || []) {
    if (!row.topic) continue;
    counts[row.topic] = (counts[row.topic] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

// ── All published slugs (for sitemap + generateStaticParams) ──────────────────

export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await db()
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data || []).map((r: { slug: string }) => r.slug);
}

// ── Auto-publish next draft ───────────────────────────────────────────────────

export async function publishNextDraft(): Promise<{
  published: boolean;
  slug?: string;
  title?: string;
  message: string;
}> {
  // Find oldest draft (FIFO queue by created_at)
  const { data: draft, error: fetchErr } = await db()
    .from("blog_posts")
    .select("slug, title")
    .eq("status", "draft")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (fetchErr?.code === "PGRST116" || !draft) {
    return { published: false, message: "No draft posts remaining in queue." };
  }
  if (fetchErr) throw fetchErr;

  const now = new Date().toISOString();
  const { error: updateErr } = await db()
    .from("blog_posts")
    .update({ status: "published", published_at: now, updated_at: now })
    .eq("slug", draft.slug);

  if (updateErr) throw updateErr;

  console.log(`[AutoPublish] ✅ Published: "${draft.title}" (${draft.slug})`);
  return {
    published: true,
    slug: draft.slug,
    title: draft.title,
    message: "Published successfully.",
  };
}
