/**
 * lib/name-lists/index.ts
 * Lookup helpers for the curated list pages. `{n}` in any text field is replaced
 * with the real number of names, so titles can never drift from the list.
 */

import { BIBLICAL_PAGES } from "./biblical";
import { HUB_PAGES as GENERAL_HUB_PAGES } from "./hubs";
import { LETTER_PAGES } from "./letters";
import { LETTER_PAGES_2 } from "./letters-2";
import { LETTER_PAGES_3 } from "./letters-3";
import { LETTER_PAGES_4 } from "./letters-4";
import { THEME_PAGES } from "./themes";
import type { NameListPage } from "./types";

export type { ListName, ListGender, NameListPage } from "./types";

const HUB_PAGES = [...GENERAL_HUB_PAGES, ...BIBLICAL_PAGES];

function resolve(page: NameListPage): NameListPage {
  const n = String(page.names.length);
  const fill = (s: string) => s.replaceAll("{n}", n);
  return {
    ...page,
    title: fill(page.title),
    metaTitle: fill(page.metaTitle),
    metaDescription: fill(page.metaDescription),
    intro: page.intro.map(fill),
  };
}

const ALL_LETTERS = [...LETTER_PAGES, ...LETTER_PAGES_2, ...LETTER_PAGES_3, ...LETTER_PAGES_4];

export function getLetterPage(letter: string): NameListPage | null {
  const p = ALL_LETTERS.find((x) => x.slug === letter.toLowerCase());
  return p ? resolve(p) : null;
}

export function getThemePage(theme: string): NameListPage | null {
  const p = THEME_PAGES.find((x) => x.slug === theme.toLowerCase());
  return p ? resolve(p) : null;
}

export const LETTER_SLUGS = ALL_LETTERS.map((p) => p.slug);
export const THEME_SLUGS = THEME_PAGES.map((p) => p.slug);

export function getHubPage(slug: string): NameListPage | null {
  const p = HUB_PAGES.find((x) => x.slug === slug.toLowerCase());
  return p ? resolve(p) : null;
}

/** Display label for related-page links. */
export function listPath(page: NameListPage): string {
  if (page.kind === "hub") return `/names/${page.slug}`;
  return page.kind === "letter"
    ? `/names/starting-with/${page.slug}`
    : `/names/that-mean/${page.slug}`;
}

export function listLabel(page: NameListPage): string {
  if (page.kind === "hub") return page.kicker;
  return page.kind === "letter"
    ? `Names starting with ${page.slug.toUpperCase()}`
    : `Names that mean ${page.slug}`;
}

export function allListPages(): NameListPage[] {
  return [...HUB_PAGES, ...ALL_LETTERS, ...THEME_PAGES].map(resolve);
}

/** Look up any list page by the kind used in URLs and pin routes. */
export function getListPage(kind: string, slug: string): NameListPage | null {
  if (kind === "letter") return getLetterPage(slug);
  if (kind === "theme") return getThemePage(slug);
  if (kind === "hub") return getHubPage(slug);
  return null;
}

/** Path of the Pinterest-sized (2:3) image for a page. */
export function pinPath(page: NameListPage): string {
  return `/pins/${page.kind}/${page.slug}.png`;
}
