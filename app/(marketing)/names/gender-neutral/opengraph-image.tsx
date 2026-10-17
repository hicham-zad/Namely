import { notFound } from "next/navigation";
import { getHubPage } from "@/lib/name-lists";
import { OG_SIZE, renderListCard } from "@/lib/name-lists/og-card";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Gender-neutral baby names on Namely";

export default async function Image() {
  const page = getHubPage("gender-neutral");
  if (!page) notFound();
  return renderListCard(page);
}
