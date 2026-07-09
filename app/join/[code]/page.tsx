import type { Metadata } from "next";
import JoinClient from "./JoinClient";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: "Join Namely — You've been invited!",
    description: `You've been invited to discover baby names together. Join with code ${code.toUpperCase()}.`,
  };
}

export default async function JoinPage({ params }: Props) {
  const { code } = await params;
  return <JoinClient code={code} />;
}
