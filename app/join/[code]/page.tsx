import type { Metadata } from "next";
import Image from "next/image";
import { Apple, Heart } from "lucide-react";
import "@/app/pages.css";
import "@/app/dashboard.css";

const APP_STORE_URL = "https://apps.apple.com/us/app/namely-baby-name-matcher/id6786483368";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: "Join Namely — You've been invited!",
    description: `You've been invited to discover baby names together. Download Namely and join with code ${code.toUpperCase()}.`,
    robots: { index: false, follow: true },
  };
}

// The web join flow (JoinClient) is parked while the web dashboard is off — see TODO.md.
// For now the invite link just points partners at the app with their code.
export default async function JoinPage({ params }: Props) {
  const { code } = await params;
  return (
    <div className="join-page">
      <div className="join-orb join-orb-1" />
      <div className="join-orb join-orb-2" />

      <div className="join-card">
        <div className="join-logo-wrap">
          <Image src="/logo.png" alt="Namely" width={56} height={56} className="join-logo" priority />
        </div>

        <div className="join-hero">
          <div className="join-icon join-icon--heart"><Heart size={28} fill="white" /></div>
        </div>
        <h1 className="join-title">You&apos;ve been invited!</h1>
        <p className="join-subtitle">
          Your partner wants to discover baby names together on Namely. Download the app and enter this code to link up.
        </p>

        <div className="join-code-badge">
          <span className="join-code-label">Invite code</span>
          <span className="join-code-value">{code.toUpperCase()}</span>
        </div>

        <div className="join-actions">
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn--primary join-cta">
            <Apple size={18} fill="currentColor" /> Get the App
          </a>
        </div>
      </div>
    </div>
  );
}
