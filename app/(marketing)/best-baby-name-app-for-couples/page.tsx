import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Best Baby Name App for Couples — Why Namely Works | Namely" },
  description: "What makes the best baby name app for couples? One that lets both partners vote fairly, syncs in real time, and only reveals a name when you both genuinely agree. That's Namely.",
  alternates: { canonical: "/best-baby-name-app-for-couples" },
  openGraph: {
    title: "Best Baby Name App for Couples — Why Namely Works | Namely",
    description: "The best baby name app for two people isn't the one with the biggest list — it's the one that gets you to an answer you both love. That's Namely.",
    url: "https://matchbabynames.com/best-baby-name-app-for-couples",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — Best Baby Name App for Couples" }],
  },
};

const config: LandingPageConfig = {
  slug: "/best-baby-name-app-for-couples",
  h1: "The Best Baby Name App for Couples",
  heroParagraph:
    "Most baby name apps are built for one person browsing alone. Namely is built for two people who need to reach the same answer. Each partner swipes through AI-generated suggestions in private — no vetoes, no lobbying, no guilt. A match is only revealed when you've both independently liked the same name. That's the only version of \"agreement\" that actually sticks.",
  badgeText: "✓ Fair for both partners · No veto politics",
  ctaHeading: "Find out why couples choose Namely.",
  ctaSubtext: "Download free. Start your 3-day trial and see why it works.",
  screenshotAlts: [
    "Namely app swipe screen — the fairest way for couples to pick a baby name",
    "Namely app Likes screen showing names one partner has saved",
    "Namely app Matches screen — where the best baby name decisions happen",
    "Namely app Preferences screen with deep filtering options for couples",
    "Namely app Partner linking — connect and start picking the best baby name together",
  ],
  faqItems: [
    {
      q: "How is Namely different from other baby name apps?",
      a: "Most baby name apps are solo tools — a list you browse alone, then pitch to your partner. Namely is built for two people from the start. Both partners vote privately in real time, and a match only appears when you've genuinely both agreed on a name — not when one of you gave in.",
    },
    {
      q: "Why is it better than a shared list or spreadsheet?",
      a: "A shared list means you can see each other's preferences before you vote, which creates pressure and second-guessing. Namely keeps votes private until you match, so results are honest. You also get AI-generated suggestions instead of being limited to names you've already thought of.",
    },
    {
      q: "How much does Namely cost?",
      a: "Namely is free to download and includes a 3-day free trial. After that, a $5.99/month subscription unlocks unlimited AI name generation and live partner sync. Cancel anytime from the App Store or Google Play.",
    },
  ],
};

export default function BestBabyNameAppPage() {
  return <LandingPage config={config} />;
}
