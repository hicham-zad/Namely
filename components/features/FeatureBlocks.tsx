import Image from "next/image";
import { Hand, HeartHandshake, BookOpen, SlidersHorizontal, Sparkles, Users, ListChecks } from "lucide-react";
import StoreButtons from "@/components/layout/StoreButtons";
import type { FeatureIcon as FeatureIconName } from "@/lib/features";

const ICONS = {
  swipe: Hand,
  match: HeartHandshake,
  meaning: BookOpen,
  filter: SlidersHorizontal,
  sparkles: Sparkles,
  partner: Users,
  list: ListChecks,
} as const;

export function FeatureIcon({ name, size = 22 }: { name: FeatureIconName; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={2.2} aria-hidden="true" />;
}

/** Gradient download band used at the bottom of feature pages. */
export function FeatureCta({ idPrefix, heading, text }: { idPrefix: string; heading: string; text: string }) {
  return (
    <section className="ft-section" aria-labelledby={`${idPrefix}-cta-title`}>
      <div className="ft-wrap">
        <div className="ft-cta">
          <div className="ft-cta__logo">
            <Image src="/logo.png" alt="Namely app icon" width={64} height={64} />
          </div>
          <h2 id={`${idPrefix}-cta-title`}>{heading}</h2>
          <p>{text}</p>
          <StoreButtons idPrefix={`${idPrefix}-cta`} align="center" />
          <p className="ft-cta__note">Free to download · iPhone, iPad &amp; Android · Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}
