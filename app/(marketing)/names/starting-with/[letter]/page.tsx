import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NameListView from "@/components/lists/NameListView";
import { getLetterPage, LETTER_SLUGS } from "@/lib/name-lists";
import { getAllNameSlugs } from "@/lib/names";
import { SITE_URL } from "@/lib/app-links";

export const revalidate = 86400;
// Only curated pages exist; anything else is a 404, never a thin page.
export const dynamicParams = false;

export function generateStaticParams() {
  return LETTER_SLUGS.map((letter) => ({ letter }));
}

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }): Promise<Metadata> {
  const { letter } = await params;
  const page = getLetterPage(letter);
  if (!page) return {};
  const url = `${SITE_URL}/names/starting-with/${page.slug}`;
  return {
    title: { absolute: `${page.metaTitle} | Namely` },
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url, type: "article" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function Page({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  const page = getLetterPage(letter);
  if (!page) notFound();
  const published = new Set(await getAllNameSlugs());
  return <NameListView page={page} path={`/names/starting-with/${page.slug}`} publishedSlugs={published} />;
}
