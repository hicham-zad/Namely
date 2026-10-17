import type { Metadata } from "next";
import HubRoute, { hubMetadata } from "@/components/lists/HubRoute";

export const revalidate = 86400;

const SLUG = "biblical-girl-names";

export function generateMetadata(): Metadata {
  return hubMetadata(SLUG);
}

export default function Page() {
  return <HubRoute slug={SLUG} />;
}
