import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NameListView from "@/components/lists/NameListView";
import { getHubPage } from "@/lib/name-lists";
import { getAllNameSlugs } from "@/lib/names";
import { SITE_URL } from "@/lib/app-links";

/** Shared metadata and page body for the hub list routes (/names/<slug>). */
export function hubMetadata(slug: string): Metadata {
  const page = getHubPage(slug);
  if (!page) return {};
  const url = `${SITE_URL}/names/${slug}`;
  return {
    title: { absolute: `${page.metaTitle} | Namely` },
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url, type: "article" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function HubRoute({ slug }: { slug: string }) {
  const page = getHubPage(slug);
  if (!page) notFound();
  const published = new Set(await getAllNameSlugs());
  return <NameListView page={page} path={`/names/${slug}`} publishedSlugs={published} />;
}
