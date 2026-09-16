import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";
import { getAllNameSlugs } from "@/lib/names";

const SITE_URL = "https://matchbabynames.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Fetch all published blog slugs dynamically
  let blogSlugs: string[] = [];
  try {
    blogSlugs = await getAllSlugs();
  } catch {
    // If Supabase is unavailable at build time, gracefully skip blog entries
    blogSlugs = [];
  }

  // Fetch all published name page slugs dynamically
  let nameSlugs: string[] = [];
  try {
    nameSlugs = await getAllNameSlugs();
  } catch {
    // If Supabase is unavailable at build time, gracefully skip name entries
    nameSlugs = [];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/names`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/delete-account`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    // SEO landing pages
    { url: `${SITE_URL}/baby-name-generator-for-couples`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tinder-for-baby-names`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/boy-names-app-for-couples`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/girl-names-app-for-couples`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/unique-baby-names-app`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gender-neutral-baby-names-app`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/best-baby-name-app-for-couples`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/baby-name-app-no-fighting`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pregnancy-baby-name-app`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/muslim-baby-names-app-couples`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Name pages have higher priority than blog — core SEO content
  const nameRoutes: MetadataRoute.Sitemap = nameSlugs.map((slug) => ({
    url: `${SITE_URL}/names/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...blogRoutes, ...nameRoutes];
}

