import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Boy Names App for Couples — Find the Perfect Boy Name Together | Namely" },
  description: "Searching for the perfect boy name? Namely helps couples swipe through boy name suggestions together and match on the one they both love — classic, modern, or unique.",
  alternates: { canonical: "/boy-names-app-for-couples" },
  openGraph: {
    title: "Boy Names App for Couples — Find the Perfect Boy Name Together | Namely",
    description: "Swipe through hundreds of boy name suggestions with your partner. Namely matches you on the boy name you both love.",
    url: "https://matchbabynames.com/boy-names-app-for-couples",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — Boy Names App for Couples" }],
  },
};

const config: LandingPageConfig = {
  slug: "/boy-names-app-for-couples",
  h1: "Find the Perfect Boy Name Together",
  heroParagraph:
    "You're having a boy — now you just need to agree on a name. Namely is built for exactly this moment. Filter the AI-powered queue to boy names only, then each partner swipes through strong, classic, and modern suggestions independently. Whether you love timeless names like James and Oliver, or something rarer like Cassius or Rafferty, Namely surfaces boy names you'd actually consider — and matches you when you both agree.",
  ctaHeading: "Find the boy name you'll both be proud of.",
  ctaSubtext: "Download free. Filter for boy names and start matching with your partner today.",
  screenshotAlts: [
    "Namely app swipe screen showing a boy name suggestion card",
    "Namely app Likes screen listing saved boy names",
    "Namely app Matches screen showing boy names both partners liked",
    "Namely app Preferences screen filtered to boy names only",
    "Namely app Partner linking screen — share a code and swipe on boy names together",
  ],
  faqItems: [
    {
      q: "Does Namely have a good selection of boy names?",
      a: "Yes. Namely's database includes thousands of boy names spanning classic English, Irish, French, Arabic, Hebrew, Latin origins and more — from timeless choices like William and Henry to rare finds like Caspian or Leander.",
    },
    {
      q: "Can we filter to show only boy names?",
      a: "Absolutely. In the Preferences screen, set the gender filter to 'Boy' and every name in your swipe queue will be a boy name. Both partners can set this independently or together.",
    },
    {
      q: "Do we both need the app to find boy names together?",
      a: "Yes. Both partners install Namely and link with a 6-letter code. Once connected, you each swipe through boy names independently. When you both like the same one, Namely reveals it as a match.",
    },
  ],
};

export default function BoyNamesAppPage() {
  return <LandingPage config={config} />;
}
