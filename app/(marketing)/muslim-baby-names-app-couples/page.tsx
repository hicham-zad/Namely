import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Muslim Baby Names App for Couples — Find an Islamic Name Together | Namely" },
  description: "Looking for Muslim or Arabic baby names as a couple? Namely helps you discover beautiful Islamic names with strong meanings and match with your partner on the one you both love.",
  alternates: { canonical: "/muslim-baby-names-app-couples" },
  openGraph: {
    title: "Muslim Baby Names App for Couples — Find an Islamic Name Together | Namely",
    description: "Swipe through Arabic and Muslim baby names with your partner. Namely matches you on a meaningful Islamic name you both love.",
    url: "https://matchbabynames.com/muslim-baby-names-app-couples",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — Muslim Baby Names App for Couples" }],
  },
};

const config: LandingPageConfig = {
  slug: "/muslim-baby-names-app-couples",
  h1: "Find Muslim Baby Names You Both Love",
  heroParagraph:
    "Choosing a Muslim or Arabic name carries weight — it's a gift of meaning and heritage that your child will carry for life. Namely makes the search a shared one. Filter by Arabic or Islamic origin and the AI surfaces names rooted in the Quran, classical Arabic, and Islamic tradition: from beloved classics like Yusuf, Maryam, and Ibrahim, to beautiful and less-common choices like Zaynab, Idris, and Noor. Each partner swipes in private, and a match appears when you both choose the same name.",
  badgeText: "✓ Arabic & Islamic origin names · Filter by origin",
  ctaHeading: "Find a name with meaning you'll both be proud to give.",
  ctaSubtext: "Download free. Filter for Arabic and Islamic names and start matching today.",
  screenshotAlts: [
    "Namely app swipe screen showing an Arabic and Muslim baby name suggestion",
    "Namely app Likes screen with saved Muslim and Islamic name options",
    "Namely app Matches screen — the Muslim name both partners chose together",
    "Namely app Preferences screen filtered to Arabic origin names",
    "Namely app Partner linking screen — connect to swipe on Muslim baby names together",
  ],
  faqItems: [
    {
      q: "Does Namely include Muslim and Arabic baby names?",
      a: "Yes. Namely's library includes names from Arabic, Quranic, and Islamic tradition — both classic names widely used across Muslim communities and rarer names with beautiful meanings. You can filter by Arabic origin in the Preferences screen.",
    },
    {
      q: "Can we filter specifically for Islamic or Arabic name origins?",
      a: "Yes. In the Preferences screen, select 'Arabic' under the origin filter and every name in your queue will come from Arabic or Islamic heritage. You can combine this with gender and style filters for more specific results.",
    },
    {
      q: "Do we both need the app to search for Muslim names together?",
      a: "Yes. Both partners install Namely and connect with a shared 6-letter code. Once linked, each partner swipes through Arabic and Muslim name suggestions independently, and Namely reveals a match when you both like the same name.",
    },
  ],
};

export default function MuslimBabyNamesPage() {
  return <LandingPage config={config} />;
}
