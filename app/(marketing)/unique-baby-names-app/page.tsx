import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Unique Baby Names App for Couples — Rare Names You'll Both Love | Namely" },
  description: "Tired of Olivia and Liam? Namely's AI surfaces unique and uncommon baby names for couples to discover together — rare finds, beautiful meanings, zero playground overlap.",
  alternates: { canonical: "/unique-baby-names-app" },
  openGraph: {
    title: "Unique Baby Names App for Couples — Rare Names You'll Both Love | Namely",
    description: "Discover rare and unique baby names with your partner. Namely's AI goes beyond the top-100 lists to find names as one-of-a-kind as your child.",
    url: "https://matchbabynames.com/unique-baby-names-app",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — Unique Baby Names App for Couples" }],
  },
};

const config: LandingPageConfig = {
  slug: "/unique-baby-names-app",
  h1: "Discover Unique Baby Names Together",
  heroParagraph:
    "If you've looked at the top-100 baby name lists and felt nothing, Namely is for you. Our AI digs past the Olivias and Liaams into names that are genuinely rare — rooted in history, mythology, literature, and culture — but still wearable for a modern child. Both partners swipe through uncommon suggestions independently, and a match is revealed only when you've both said yes to the same rare find.",
  badgeText: "✓ Beyond the top-100 · Rare names, real matches",
  ctaHeading: "Find a unique name neither of you has heard a thousand times.",
  ctaSubtext: "Download free and let AI surface the rare names that deserve to be found.",
  screenshotAlts: [
    "Namely app swipe screen showing a rare and unique baby name suggestion",
    "Namely app Likes screen listing uncommon baby names the user has saved",
    "Namely app Matches screen showing the unique name both partners agreed on",
    "Namely app Preferences screen with filters for rare name styles and origins",
    "Namely app Partner linking screen — connect to discover unique names together",
  ],
  faqItems: [
    {
      q: "Can Namely suggest rare or uncommon baby names?",
      a: "Yes. Namely's database goes well beyond popular lists and includes names from historical, literary, mythological, and lesser-known cultural origins. You can also tell the AI to avoid common or top-100 names in your Preferences.",
    },
    {
      q: "How unique are the AI-generated suggestions?",
      a: "That depends on your settings. Set your style preference to 'Rare' or 'Uncommon' and Namely will prioritise names outside the mainstream — names with character, meaning, and a story behind them.",
    },
    {
      q: "Is Namely free to use for finding unique names?",
      a: "Namely is free to download. The $5.99/month subscription (with a 3-day free trial) unlocks unlimited AI-generated suggestions including the full rare name library and real-time partner sync.",
    },
  ],
};

export default function UniqueBabyNamesPage() {
  return <LandingPage config={config} />;
}
