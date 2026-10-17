/**
 * lib/name-lists/types.ts
 * Hand-curated list pages ("names starting with A", "names that mean love").
 * Content lives in code, not the DB, so every meaning is reviewed before it ships.
 */

export type ListGender = "girl" | "boy" | "unisex";

export interface ListName {
  name: string;
  gender: ListGender;
  origin: string;
  /** What the name means. Hedge honestly where the etymology is disputed. */
  meaning: string;
  /** One short line on the name's vibe or a fact worth knowing. */
  note: string;
}

export interface ListFaq {
  q: string;
  a: string;
}

export interface NameListPage {
  /** URL segment: a letter ("a"), a theme ("love") or a hub ("gender-neutral"). */
  slug: string;
  kind: "letter" | "theme" | "hub";
  /** H1 */
  title: string;
  /** <title>, without the site suffix */
  metaTitle: string;
  metaDescription: string;
  /** Short label above the H1 */
  kicker: string;
  /** Paragraphs under the H1; the first one is the lead. */
  intro: string[];
  /** Names (from `names`) to feature as top picks, in order. */
  featured: string[];
  tips: { heading: string; body: string }[];
  names: ListName[];
  faqs: ListFaq[];
  /** ISO date of the last editorial review */
  updated: string;
}
