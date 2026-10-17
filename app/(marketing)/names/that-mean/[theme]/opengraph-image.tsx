import { getThemePage } from "@/lib/name-lists";
import { OG_SIZE, renderListCard } from "@/lib/name-lists/og-card";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Baby names list on Namely";

export default async function Image({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const page = getThemePage(theme);
  if (!page) return new Response("Not found", { status: 404 });
  return renderListCard(page);
}
