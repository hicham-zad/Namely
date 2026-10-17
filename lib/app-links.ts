/**
 * Single source of truth for store URLs and app screenshots used across the marketing site.
 */

export const SITE_URL = "https://matchbabynames.com";

export const IOS_APP_URL = "https://apps.apple.com/us/app/namely-baby-name-matcher/id6786483368";
export const ANDROID_PACKAGE = "com.nametogether.namely";
export const ANDROID_APP_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

/** Intrinsic size of every file in /public/screenshots */
export const SCREENSHOT_SIZE = { width: 780, height: 1536 } as const;

export type ScreenshotKey = "home" | "swipe" | "matches" | "meanings" | "filters" | "generator";

export interface Screenshot {
  src: string;
  alt: string;
  caption: string;
}

export const SCREENSHOTS: Record<ScreenshotKey, Screenshot> = {
  home: {
    src: "/screenshots/find-baby-names-you-both-love.webp",
    alt: "Namely baby name matcher home screen showing names left to swipe, liked names and partner matches",
    caption: "Baby names you both love",
  },
  swipe: {
    src: "/screenshots/swipe-baby-names-together.webp",
    alt: "Swipe baby names together — Namely name card for Amara with meaning, origin and pronunciation",
    caption: "Swipe baby names together",
  },
  matches: {
    src: "/screenshots/match-baby-names-with-partner.webp",
    alt: "Namely Matches screen listing baby names both partners liked, with meanings and origins",
    caption: "Match instantly, no arguments",
  },
  meanings: {
    src: "/screenshots/baby-name-meanings-origins.webp",
    alt: "Baby name meaning, origin, pronunciation, popularity and syllables for Olivia in the Namely app",
    caption: "Know what every name means",
  },
  filters: {
    src: "/screenshots/filter-baby-names-style-origin-gender.webp",
    alt: "Filter baby names by boy, girl or unisex, style and origin in the Namely Likes screen",
    caption: "Classic, unique, gender neutral",
  },
  generator: {
    src: "/screenshots/ai-baby-name-generator.webp",
    alt: "Namely AI baby name generator picking 30 names based on gender, style and origin preferences",
    caption: "Your AI baby name generator",
  },
};

export const SCREENSHOT_ORDER: ScreenshotKey[] = ["home", "swipe", "matches", "meanings", "filters", "generator"];
