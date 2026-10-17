import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NameListView from "@/components/lists/NameListView";
import { getHubPage } from "@/lib/name-lists";
import { getAllNameSlugs } from "@/lib/names";
import { SITE_URL } from "@/lib/app-links";

export const revalidate = 86400;

const SLUG = "gender-neutral";

export async function generateMetadata(): Promise<Metadata> {
  const page = getHubPage(SLUG);
  if (!page) return {};
  const url = `${SITE_URL}/names/${SLUG}`;
  return {
    title: { absolute: `${page.metaTitle} | Namely` },
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url, type: "article" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function Page() {
  const page = getHubPage(SLUG);
  if (!page) notFound();
  const published = new Set(await getAllNameSlugs());
  return <NameListView page={page} path={`/names/${SLUG}`} publishedSlugs={published} />;
}
