import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Baby Name App for Expecting Parents — Find Your Name Before the Due Date | Namely" },
  description: "Expecting a baby and need to pick a name? Namely helps expecting parents swipe through AI-generated names together and match before the due date — no pressure, just joy.",
  alternates: { canonical: "/pregnancy-baby-name-app" },
  openGraph: {
    title: "Baby Name App for Expecting Parents — Find Your Name Before the Due Date | Namely",
    description: "Whether you're in the first trimester or the final week, Namely helps expecting couples find a baby name they both love.",
    url: "https://matchbabynames.com/pregnancy-baby-name-app",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — Baby Name App for Expecting Parents" }],
  },
};

const config: LandingPageConfig = {
  slug: "/pregnancy-baby-name-app",
  h1: "Find Your Baby's Name Before the Due Date",
  heroParagraph:
    "Whether you're 8 weeks in and starting early, or 38 weeks in and running out of time, Namely works at every stage of pregnancy. Start with a wide-open queue and narrow down as you go — or jump straight to your shortlist in the final trimester. The AI generates names based on both partners' tastes, you each swipe in private, and a match is revealed the moment you both love the same one. No scrambling at the hospital required.",
  badgeText: "✓ Start any trimester · Match before the due date",
  ctaHeading: "Pick a name before the big day.",
  ctaSubtext: "Download free. Whether you're weeks away or days away — Namely gets you there.",
  screenshotAlts: [
    "Namely app swipe screen — helping expecting parents choose a baby name during pregnancy",
    "Namely app Likes screen — an expecting parent's shortlist of baby names",
    "Namely app Matches screen showing the name both expecting parents agreed on",
    "Namely app Preferences screen — configure name filters during pregnancy",
    "Namely app Partner linking screen — both expecting parents connect to swipe on names",
  ],
  faqItems: [
    {
      q: "When during pregnancy should we start using Namely?",
      a: "Any time works. Some couples start in the first trimester to build a longlist without pressure. Others wait until they know the gender. A few start in the third trimester — Namely's fast enough to get you to a shortlist even if you only have weeks left.",
    },
    {
      q: "Can we change our minds after matching on a name?",
      a: "Yes. A match isn't a commitment. All your matches are saved in the Matches tab and you can keep swiping to find more. Many couples accumulate a shortlist of 3–5 matched names and decide once the baby arrives.",
    },
    {
      q: "Do both expecting parents need to install the app?",
      a: "Yes. Both partners download Namely and link their accounts with a 6-letter code — it takes under a minute. Once linked, you each swipe in your own time and matches sync in real time across iOS and Android.",
    },
  ],
};

export default function PregnancyBabyNamePage() {
  return <LandingPage config={config} />;
}
