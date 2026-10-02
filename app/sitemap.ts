import type { MetadataRoute } from "next";
import { getSitemapPosts } from "@/lib/blog";
import { getSitemapNames } from "@/lib/names";

const SITE_URL = "https://matchbabynames.com";

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
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: latest(posts), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/names`, lastModified: latest(names), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/support`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/terms`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/delete-account`, changeFrequency: "yearly", priority: 0.4 },
    // SEO landing pages
    { url: `${SITE_URL}/baby-name-generator-for-couples`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tinder-for-baby-names`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/boy-names-app-for-couples`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/girl-names-app-for-couples`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/unique-baby-names-app`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gender-neutral-baby-names-app`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/best-baby-name-app-for-couples`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/baby-name-app-no-fighting`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pregnancy-baby-name-app`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/muslim-baby-names-app-couples`, changeFrequency: "monthly", priority: 0.8 },
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

