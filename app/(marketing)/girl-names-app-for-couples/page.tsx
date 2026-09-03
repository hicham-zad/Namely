import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Girl Names App for Couples — Discover a Name You'll Both Love | Namely" },
  description: "Looking for the perfect girl name as a couple? Namely's AI surfaces beautiful girl name suggestions for both partners to swipe through — classic, modern, or rare.",
  alternates: { canonical: "/girl-names-app-for-couples" },
  openGraph: {
    title: "Girl Names App for Couples — Discover a Name You'll Both Love | Namely",
    description: "Swipe through girl name suggestions with your partner and match on the one you both adore. Beautiful names, zero arguments.",
    url: "https://matchbabynames.com/girl-names-app-for-couples",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — Girl Names App for Couples" }],
  },
};

const config: LandingPageConfig = {
  slug: "/girl-names-app-for-couples",
  h1: "Discover Girl Names You'll Both Love",
  heroParagraph:
    "Finding a girl name you both adore is harder than it sounds — but Namely makes it actually fun. Filter your queue to girl names only, and let the AI surface suggestions based on your shared style: timeless classics like Eleanor and Clara, soft and modern names like Aria or Isla, or rare picks like Seraphina and Cordelia. Each partner swipes in private, and a match appears the moment you both fall for the same name.",
  ctaHeading: "Find a girl name you're both excited about.",
  ctaSubtext: "Download free. Filter for girl names and start your first swipe session today.",
  screenshotAlts: [
    "Namely app swipe screen showing a girl name suggestion card",
    "Namely app Likes screen listing beautiful girl names you've saved",
    "Namely app Matches screen showing the girl name both partners chose",
    "Namely app Preferences screen set to girl names with style and origin filters",
    "Namely app Partner linking screen — connect and swipe on girl names together",
  ],
  faqItems: [
    {
      q: "Does Namely have a large selection of girl names?",
      a: "Yes — Namely's library covers thousands of girl names across dozens of origins: English, French, Italian, Arabic, Celtic, Hebrew, and more. From beloved classics to rare and literary finds you won't see in every baby book.",
    },
    {
      q: "Can we filter to show only girl names?",
      a: "Yes. Open Preferences and set the gender filter to 'Girl'. Every name in your queue will be a girl name. You can further narrow by style, origin, or starting letter.",
    },
    {
      q: "What if we disagree on girl names?",
      a: "That's exactly what Namely is for. Because both partners vote privately and independently, there's no back-and-forth. A match only appears when you genuinely both like the same name — which means when it does, you've actually agreed.",
    },
  ],
};

export default function GirlNamesAppPage() {
  return <LandingPage config={config} />;
}
