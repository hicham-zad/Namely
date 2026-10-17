import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NameListView from "@/components/lists/NameListView";
import { getThemePage, THEME_SLUGS } from "@/lib/name-lists";
import { getAllNameSlugs } from "@/lib/names";
import { SITE_URL } from "@/lib/app-links";

export const revalidate = 86400;
// Only curated pages exist; anything else is a 404, never a thin page.
export const dynamicParams = false;

export function generateStaticParams() {
  return THEME_SLUGS.map((theme) => ({ theme }));
}

export async function generateMetadata({ params }: { params: Promise<{ theme: string }> }): Promise<Metadata> {
  const { theme } = await params;
  const page = getThemePage(theme);
  if (!page) return {};
  const url = `${SITE_URL}/names/that-mean/${page.slug}`;
  return {
    title: { absolute: `${page.metaTitle} | Namely` },
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url, type: "article" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function Page({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const page = getThemePage(theme);
  if (!page) notFound();
  const published = new Set(await getAllNameSlugs());
  return <NameListView page={page} path={`/names/that-mean/${page.slug}`} publishedSlugs={published} />;
}
