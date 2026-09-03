import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Tinder for Baby Names — Swipe & Match With Your Partner | Namely" },
  description: "Like Tinder, but for baby names. Both partners swipe yes or no independently. Namely reveals a match the moment you both like the same name — no arguments, just results.",
  alternates: { canonical: "/tinder-for-baby-names" },
  openGraph: {
    title: "Tinder for Baby Names — Swipe & Match With Your Partner | Namely",
    description: "Swipe right on baby names together. Namely is the Tinder-style app that helps couples match on baby names without the debate.",
    url: "https://matchbabynames.com/tinder-for-baby-names",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — Tinder for Baby Names" }],
  },
};

const config: LandingPageConfig = {
  slug: "/tinder-for-baby-names",
  h1: "Swipe Right on Baby Names Together",
  heroParagraph:
    "Searching for a Tinder for baby names app to end the naming arguments? Namely uses the familiar swipe-to-match mechanic to make choosing a baby name fair and fun. Each partner links their account and swipes right to 'like' or left to 'pass' on AI-curated names. Because votes are completely hidden until you both swipe right on the same name, this baby name swipe app removes the pressure and negotiation from finding the perfect match.",
  badgeText: "✓ Swipe together · Match on names you both love",
  ctaHeading: "Ready to find your perfect match?",
  ctaSubtext: "Download free and start swiping. Your baby name match is waiting.",
  screenshotAlts: [
    "Namely app swipe screen — like or skip baby names Tinder-style",
    "Namely app Likes screen showing names you've swiped right on",
    "Namely app Matches screen — names both partners swiped right on together",
    "Namely app Preferences screen — customise which names appear in your swipe queue",
    "Namely app Partner linking screen — connect with your partner to start swiping",
  ],
  faqItems: [
    {
      q: "Is Namely like Tinder for baby names?",
      a: "Exactly. Both partners install the app, link accounts with a code, and swipe through baby names independently — just like Tinder. When you both like the same name, Namely reveals it as a match. No debates, no compromises forced.",
    },
    {
      q: "Can my partner see which names I've swiped on?",
      a: "No. Your votes are completely private until you both agree. Your partner won't know you liked a name until they've also liked it — which keeps the matching honest and pressure-free.",
    },
    {
      q: "What happens when we match on a name?",
      a: "The app shows a match notification to both partners at the same time. All your shared matches are saved in the Matches tab, so you can revisit and compare them as a shortlist.",
    },
  ],
};

export default function TinderForBabyNamesPage() {
  return <LandingPage config={config} />;
}
