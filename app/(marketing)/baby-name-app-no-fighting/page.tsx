import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Baby Name App That Stops the Arguments — Namely" },
  description: "You love Aria, they love George, and nobody's backing down. Namely is the baby name app built to end baby name arguments — both partners vote privately, and a match is a real agreement.",
  alternates: { canonical: "/baby-name-app-no-fighting" },
  openGraph: {
    title: "Baby Name App That Stops the Arguments — Namely",
    description: "Stop the baby name debate. Namely's private voting system means matches are real agreements — not one partner giving in.",
    url: "https://matchbabynames.com/baby-name-app-no-fighting",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — Stop Baby Name Arguments" }],
  },
};

const config: LandingPageConfig = {
  slug: "/baby-name-app-no-fighting",
  h1: "Stop the Baby Name Arguments — Match Together",
  heroParagraph:
    "You love Aria, they love George, and every conversation ends in a standoff. Baby name debates are one of the most surprisingly stressful parts of pregnancy — and they don't have to be. Namely removes the back-and-forth entirely. Both partners swipe through names in private, with zero influence on each other's choices. A match only appears when you've genuinely both said yes — which means when it happens, neither of you is giving in. You've actually agreed.",
  badgeText: "✓ No vetoes · No guilt-trips · Just matches",
  ctaHeading: "End the debate. Start matching.",
  ctaSubtext: "Download free. Both partners vote in private — a match means you genuinely agree.",
  screenshotAlts: [
    "Namely app swipe screen — vote privately to avoid baby name arguments",
    "Namely app Likes screen — your private list, hidden from your partner until you match",
    "Namely app Matches screen — where both partners genuinely agreed on a name",
    "Namely app Preferences screen — set up filters to avoid names either partner dislikes",
    "Namely app Partner linking screen — connect and vote independently, no arguments needed",
  ],
  faqItems: [
    {
      q: "How does Namely prevent baby name arguments?",
      a: "Because both partners vote privately, there's no negotiating, no vetoing, and no pressure. You swipe through names in your own time and your partner does the same. A match only appears when you've independently both liked the same name — so there's nothing to argue about.",
    },
    {
      q: "What if we just can't agree on any name?",
      a: "Keep swiping. The AI generates a personalised queue based on both partners' stated preferences, so over time the suggestions get closer to your shared taste. You can also use the 'Names to Avoid' feature to pre-exclude anything you know won't work.",
    },
    {
      q: "Can we see each other's votes to compromise?",
      a: "No — and that's intentional. Seeing each other's lists leads to influence and pressure, which is exactly what creates arguments. Namely keeps votes private so that every match is a genuine mutual yes.",
    },
  ],
};

export default function BabyNameNoFightingPage() {
  return <LandingPage config={config} />;
}
