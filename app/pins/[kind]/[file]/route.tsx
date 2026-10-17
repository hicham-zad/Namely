import { allListPages, getListPage } from "@/lib/name-lists";
import { renderPin } from "@/lib/name-lists/pin-card";

export const dynamicParams = false;

/** One static PNG per list page: /pins/<kind>/<slug>.png */
export function generateStaticParams() {
  return allListPages().map((p) => ({ kind: p.kind, file: `${p.slug}.png` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ kind: string; file: string }> }) {
  const { kind, file } = await params;
  const page = getListPage(kind, file.replace(/\.png$/, ""));
  if (!page) return new Response("Not found", { status: 404 });
  return renderPin(page);
}
