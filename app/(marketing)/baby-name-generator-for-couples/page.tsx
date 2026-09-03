import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Baby Name Generator for Couples — Namely" },
  description: "Let AI generate baby name ideas tailored to both of your tastes. Namely's baby name generator helps couples discover names they'll both love — no endless scrolling, no spreadsheets.",
  alternates: { canonical: "/baby-name-generator-for-couples" },
  openGraph: {
    title: "Baby Name Generator for Couples — Namely",
    description: "AI-powered baby name suggestions tailored to both of your styles. Generate, swipe, and match with your partner.",
    url: "https://matchbabynames.com/baby-name-generator-for-couples",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — AI Baby Name Generator for Couples" }],
  },
};

const config: LandingPageConfig = {
  slug: "/baby-name-generator-for-couples",
  h1: "Generate Baby Names With Your Partner",
  heroParagraph:
    "A baby name generator built specifically for two. Instead of browsing generic alphabetical lists, Namely uses AI to generate baby name suggestions based on both partners' exact tastes in style, origin, and name length. Because you each review the generated names privately, there is no pressure or vetoing. You simply get a curated queue of baby names for couples, and an instant match when you both genuinely agree.",
  ctaHeading: "Ready to generate names you'll both love?",
  ctaSubtext: "Download free. Let AI do the hard work while you enjoy the moment.",
  screenshotAlts: [
    "Namely app showing AI-generated baby name suggestions on the swipe screen",
    "Namely app Likes screen listing saved baby name suggestions",
    "Namely app Matches screen showing names both partners generated and liked",
    "Namely app Preferences screen for customising AI name generation filters",
    "Namely app Partner linking screen — connect with your partner to share generated names",
  ],
  faqItems: [
    {
      q: "How does the AI baby name generator work?",
      a: "Namely's AI analyses your style preferences, preferred origins, name length, and any names to avoid, then generates personalised suggestions for each partner to swipe through. The more you rate, the better the suggestions get.",
    },
    {
      q: "Can we filter the generated names by gender or origin?",
      a: "Yes. You can filter by gender (boy, girl, or neutral), origin (English, French, Arabic, and more), style, starting letter, and name length before generating. Both partners set their own preferences.",
    },
    {
      q: "Do we both need the app to use the generator?",
      a: "Yes. Both partners install Namely and link accounts with a shared 6-letter code. Once linked, you each swipe through AI-generated names independently and get notified when you match.",
    },
  ],
};

export default function BabyNameGeneratorPage() {
  return <LandingPage config={config} />;
}
