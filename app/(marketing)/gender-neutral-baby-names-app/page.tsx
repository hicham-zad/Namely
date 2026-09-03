import type { Metadata } from "next";
import LandingPage, { type LandingPageConfig } from "@/components/layout/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Gender-Neutral Baby Names App for Couples | Namely" },
  description: "Looking for gender-neutral or unisex baby names? Namely helps couples discover and match on non-binary names together — whether you're keeping the surprise or prefer flexible naming.",
  alternates: { canonical: "/gender-neutral-baby-names-app" },
  openGraph: {
    title: "Gender-Neutral Baby Names App for Couples | Namely",
    description: "Swipe through unisex and gender-neutral baby name suggestions with your partner. Match on the one you both love.",
    url: "https://matchbabynames.com/gender-neutral-baby-names-app",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — Gender-Neutral Baby Names App for Couples" }],
  },
};

const config: LandingPageConfig = {
  slug: "/gender-neutral-baby-names-app",
  h1: "Find Gender-Neutral Baby Names as a Couple",
  heroParagraph:
    "Set the gender filter to Neutral and Namely's AI queues up unisex names only — short modern picks like River, Remi, and Sage alongside longer classics like Morgan, Avery, and Quinn. Useful whether you're keeping the gender a surprise, want a name that isn't tied to expectations, or just prefer something that works either way. Both partners swipe in private and a match is revealed when you both land on the same one.",
  badgeText: "✓ Unisex names · No gender required",
  ctaHeading: "Find a gender-neutral name you're both excited to use.",
  ctaSubtext: "Download free. Filter for unisex names and start matching with your partner.",
  screenshotAlts: [
    "Namely app swipe screen showing a gender-neutral baby name suggestion",
    "Namely app Likes screen with saved unisex baby names",
    "Namely app Matches screen — the gender-neutral name both partners agreed on",
    "Namely app Preferences screen filtered to gender-neutral names",
    "Namely app Partner linking screen — link accounts and swipe on unisex names together",
  ],
  faqItems: [
    {
      q: "Does Namely support gender-neutral baby names?",
      a: "Yes. Namely includes a dedicated library of unisex and gender-neutral names. In the Preferences screen, set the gender filter to 'Neutral' or 'Any' to see only names that work regardless of gender.",
    },
    {
      q: "Can we filter for unisex names only?",
      a: "Yes. Select 'Neutral' in the gender filter and every suggestion in your swipe queue will be a gender-neutral name. You can combine that with origin, style, and length filters to narrow further.",
    },
    {
      q: "What if we find out the gender later — can we switch the filter?",
      a: "Yes. Preferences can be updated at any time. Your Likes list carries over — names you saved under a neutral filter stay saved even if you later switch to girl or boy names.",
    },
  ],
};

export default function GenderNeutralNamesPage() {
  return <LandingPage config={config} />;
}
