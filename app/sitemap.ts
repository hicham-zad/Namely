import type { MetadataRoute } from "next";
import { getSitemapPosts } from "@/lib/blog";
import { getSitemapNames } from "@/lib/names";
import { FEATURES } from "@/lib/features";

const SITE_URL = "https://matchbabynames.com";

/** Bump when the marketing, landing or feature pages get a content update. */
const CONTENT_UPDATED = new Date("2026-10-11");

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Fetch all published blog slugs dynamically
  let posts: { slug: string; updated_at: string }[] = [];
  try {
    posts = await getSitemapPosts();
  } catch {
    // If Supabase is unavailable at build time, gracefully skip blog entries
    posts = [];
  }

  // Fetch all published name page slugs dynamically
  const names = await getSitemapNames();

  // Listing pages change whenever their newest entry does
  const latest = (rows: { updated_at: string }[]) =>
    rows.reduce<Date | undefined>((max, r) => {
      const d = new Date(r.updated_at);
      return !max || d > max ? d : max;
    }, undefined);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: latest(posts), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/names`, lastModified: latest(names), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/faq`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/support`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/terms`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/delete-account`, changeFrequency: "yearly", priority: 0.4 },
    // SEO landing pages
    { url: `${SITE_URL}/baby-name-generator-for-couples`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tinder-for-baby-names`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/boy-names-app-for-couples`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/girl-names-app-for-couples`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/unique-baby-names-app`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gender-neutral-baby-names-app`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/best-baby-name-app-for-couples`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/baby-name-app-no-fighting`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pregnancy-baby-name-app`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/muslim-baby-names-app-couples`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    // App feature pages
    { url: `${SITE_URL}/features`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    ...FEATURES.map((f) => ({ url: `${SITE_URL}/features/${f.slug}`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly" as const, priority: 0.85 })),
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map(({ slug, updated_at }) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Name pages have higher priority than blog — core SEO content
  const nameRoutes: MetadataRoute.Sitemap = names.map(({ slug, updated_at }) => ({
    url: `${SITE_URL}/names/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...blogRoutes, ...nameRoutes];
}

