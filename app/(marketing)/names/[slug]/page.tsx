import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameBySlug, getNameSummariesBySlugs, getAllNameSlugs } from "@/lib/names";
import JsonLd from "@/components/layout/JsonLd";

export const revalidate = 86400; // Re-generate every 24 hours
export const dynamicParams = true; // Serve new slugs on-demand

const SITE_URL = "https://matchbabynames.com";
const APP_STORE_URL = "https://apps.apple.com/us/app/namely-baby-name-matcher/id6786483368";
const LOGO_PINK = "#FF6B8A";
const LOGO_PINK_LIGHT = "#fb9cb0";

// ── Static params (for ISR pre-generation) ────────────────────────────────────

export async function generateStaticParams() {
  try {
    const slugs = await getAllNameSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const name = await getNameBySlug(slug);
    if (!name) return {};

    const title = `${name.name} - Meaning, Origin, Pronunciation & Popularity | Namely`;
    // personality_note makes every meta description unique — not a template sentence
    const description = `${name.name} is a ${name.gender === "unisex" ? "unisex" : `${name.gender}'s`} name meaning "${name.meaning_short.replace(/^[^"]*?"/, "").replace(/"[^"]*$/, "")}" — ${name.personality_note.split(".")[0]}.`;

    return {
      title,
      description: description.length > 160 ? description.slice(0, 157) + "…" : description,
      alternates: { canonical: `${SITE_URL}/names/${slug}` },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/names/${slug}`,
        type: "article",
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: `${name.name} baby name meaning` }],
      },
      twitter: { card: "summary_large_image" },
    };
  } catch {
    return {};
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function genderLabel(g: string) {
  if (g === "boy") return "Boy's name";
  if (g === "girl") return "Girl's name";
  return "Unisex name";
}

function genderEmoji(g: string) {
  if (g === "boy") return "💙";
  if (g === "girl") return "💗";
  return "💜";
}

function trendLabel(dir: string | null) {
  if (dir === "rising") return "📈 Rising";
  if (dir === "falling") return "📉 Falling";
  return "➡️ Stable";
}

function rankSuffix(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function NameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = await getNameBySlug(slug);

  if (!name) notFound();

  // Fetch similar name cards for internal linking
  const similarNames = name.similar_names
    ? await getNameSummariesBySlugs(name.similar_names.slice(0, 8))
    : [];

  // Split meaning_long into paragraphs
  const meaningParagraphs = name.meaning_long
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // ── Schema markup ─────────────────────────────────────────────────────────

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: name.name,
    description: name.meaning_short,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Baby Name Database",
      url: `${SITE_URL}/names`,
    },
    url: `${SITE_URL}/names/${slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${name.name} a boy or girl name?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${name.name} is primarily a ${name.gender === "unisex" ? "unisex name used for both boys and girls" : `${name.gender}'s name`}. ${name.gender === "unisex" ? "It is used for children of any gender." : `It is rarely used for ${name.gender === "girl" ? "boys" : "girls"}.`}`,
        },
      },
      {
        "@type": "Question",
        name: `How do you pronounce ${name.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${name.name} is pronounced "${name.pronunciation_text}" (IPA: ${name.pronunciation_ipa}). It has ${name.syllables} syllable${name.syllables !== 1 ? "s" : ""}.`,
        },
      },
      {
        "@type": "Question",
        name: `What does ${name.name} mean?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: name.meaning_short,
        },
      },
      {
        "@type": "Question",
        name: `Is ${name.name} a popular name in 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: name.ssa_rank
            ? `Yes, ${name.name} is a highly popular name. It ranked #${name.ssa_rank} in the United States in ${name.ssa_year}, according to the Social Security Administration. The name is ${name.trend_direction === "rising" ? "currently trending upward" : name.trend_direction === "falling" ? "gradually declining in popularity" : "holding steady"}.`
            : `${name.name} is used in the United States but does not appear in the SSA top 1,000 names as of ${name.ssa_year || "recent data"}.`,
        },
      },
      {
        "@type": "Question",
        name: `What are good middle names for ${name.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: name.middle_names
            ? `Good middle names for ${name.name} include ${[
                ...(name.middle_names.classic || []).slice(0, 2),
                ...(name.middle_names.modern || []).slice(0, 2),
              ].join(", ")}.`
            : `There are many middle names that pair well with ${name.name} depending on your style preferences.`,
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Names", item: `${SITE_URL}/names` },
      { "@type": "ListItem", position: 3, name: name.name, item: `${SITE_URL}/names/${slug}` },
    ],
  };

  return (
    <div className="name-page">
      {/* JSON-LD schema */}
      <JsonLd data={definedTermSchema as Parameters<typeof JsonLd>[0]["data"]} />
      <JsonLd data={faqSchema as Parameters<typeof JsonLd>[0]["data"]} />
      <JsonLd data={breadcrumbSchema as Parameters<typeof JsonLd>[0]["data"]} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <header className="name-hero">
        <div className="name-hero-inner">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="name-breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/names">Names</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">{name.name}</li>
            </ol>
          </nav>

          <div className="name-hero-badge">
            <span>{genderEmoji(name.gender)}</span>
            <span>{genderLabel(name.gender)}</span>
            <span className="name-hero-origin">{name.origin}</span>
          </div>

          {/* H1 */}
          <h1 className="name-hero-title">
            {name.name}: Meaning, Origin &amp; Everything You Need to Know
          </h1>

          <p className="name-hero-lead">{name.meaning_short}</p>

          {name.ssa_rank && (
            <div className="name-hero-rank">
              <span className="name-rank-number">#{name.ssa_rank}</span>
              <span className="name-rank-label">
                Most popular {name.gender} name in the US ({name.ssa_year})
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="name-content-wrap">
        <main className="name-main">

          {/* ── SECTION 2: Quick-facts ──────────────────────────────────────── */}
          <section className="name-section" id="quick-facts" aria-labelledby="qf-heading">
            <h2 id="qf-heading" className="name-section-title">At a Glance</h2>
            <dl className="name-quick-facts">
              <div className="name-fact-card">
                <dt>Pronunciation</dt>
                <dd>
                  <span className="name-pronunciation-text">{name.pronunciation_text}</span>
                  <span className="name-pronunciation-ipa">{name.pronunciation_ipa}</span>
                </dd>
              </div>
              <div className="name-fact-card">
                <dt>Origin</dt>
                <dd>{name.origin}</dd>
              </div>
              <div className="name-fact-card">
                <dt>Meaning</dt>
                <dd>{name.meaning_short}</dd>
              </div>
              <div className="name-fact-card">
                <dt>Gender</dt>
                <dd>{genderLabel(name.gender)}</dd>
              </div>
              <div className="name-fact-card">
                <dt>Syllables</dt>
                <dd>{name.syllables}</dd>
              </div>
              {name.nicknames && name.nicknames.length > 0 && (
                <div className="name-fact-card">
                  <dt>Nicknames</dt>
                  <dd>{name.nicknames.join(", ")}</dd>
                </div>
              )}
              {name.ssa_rank && (
                <div className="name-fact-card name-fact-card--highlight">
                  <dt>US Popularity ({name.ssa_year})</dt>
                  <dd>
                    #{name.ssa_rank} — {trendLabel(name.trend_direction)}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* ── SECTION 3: Expanded meaning / origin ────────────────────────── */}
          <section className="name-section" id="meaning-origin" aria-labelledby="mo-heading">
            <h2 id="mo-heading" className="name-section-title">
              What Does {name.name} Mean?
            </h2>
            <div className="name-prose">
              {meaningParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* ── SECTION 4: Popularity ────────────────────────────────────────── */}
          <section className="name-section" id="popularity" aria-labelledby="pop-heading">
            <h2 id="pop-heading" className="name-section-title">
              How Popular Is {name.name}?
            </h2>
            <div className="name-popularity-block">
              {name.ssa_rank ? (
                <>
                  <div className="name-pop-stat">
                    <span className="name-pop-rank">#{name.ssa_rank}</span>
                    <span className="name-pop-rank-label">
                      {rankSuffix(name.ssa_rank)} most popular {name.gender} name in the US
                    </span>
                  </div>
                  <div className="name-pop-trend">
                    <span className={`name-trend-badge name-trend-badge--${name.trend_direction}`}>
                      {trendLabel(name.trend_direction)}
                    </span>
                    {name.trend_context && (
                      <p className="name-trend-context">{name.trend_context}</p>
                    )}
                  </div>
                  <p className="name-pop-source">
                    <small>
                      Source: US Social Security Administration (SSA) baby name data,{" "}
                      <a
                        href="https://www.ssa.gov/oact/babynames/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ssa.gov/oact/babynames
                      </a>
                      , {name.ssa_year}.
                    </small>
                  </p>
                </>
              ) : (
                <p>
                  {name.name} does not appear in the SSA top 1,000 most popular names, making it
                  a genuinely rare choice. Data source: SSA baby name records.
                </p>
              )}
            </div>
          </section>

          {/* ── SECTION 5: Middle name pairings ─────────────────────────────── */}
          {name.middle_names && (
            <section className="name-section" id="middle-names" aria-labelledby="mn-heading">
              <h2 id="mn-heading" className="name-section-title">
                Middle Names That Go with {name.name}
              </h2>
              <div className="name-middle-groups">
                {name.middle_names.classic && name.middle_names.classic.length > 0 && (
                  <div className="name-middle-group">
                    <h3>Classic pairings</h3>
                    <ul className="name-middle-list">
                      {name.middle_names.classic.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {name.middle_names.modern && name.middle_names.modern.length > 0 && (
                  <div className="name-middle-group">
                    <h3>Modern pairings</h3>
                    <ul className="name-middle-list">
                      {name.middle_names.modern.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {name.middle_names.one_syllable && name.middle_names.one_syllable.length > 0 && (
                  <div className="name-middle-group">
                    <h3>One-syllable options</h3>
                    <ul className="name-middle-list">
                      {name.middle_names.one_syllable.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {name.middle_names.family_friendly && name.middle_names.family_friendly.length > 0 && (
                  <div className="name-middle-group">
                    <h3>Family-name bridges</h3>
                    <ul className="name-middle-list">
                      {name.middle_names.family_friendly.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── SECTION 6: Similar names (internal links) ───────────────────── */}
          {similarNames.length > 0 && (
            <section className="name-section" id="similar-names" aria-labelledby="sim-heading">
              <h2 id="sim-heading" className="name-section-title">
                Names Similar to {name.name}
              </h2>
              <p className="name-section-lead">
                If you love {name.name}, you might also like these names with a similar feel,
                origin, or sound.
              </p>
              <div className="name-similar-grid">
                {similarNames.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/names/${s.slug}`}
                    className="name-similar-card"
                    aria-label={`${s.name} — ${s.meaning_short}`}
                  >
                    <span className="name-similar-name">{s.name}</span>
                    <span className="name-similar-origin">{s.origin}</span>
                    <span className="name-similar-meaning">{s.meaning_short}</span>
                    {s.ssa_rank && (
                      <span className="name-similar-rank">#{s.ssa_rank}</span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── SECTION 7: Sibling name pairings ────────────────────────────── */}
          {name.sibling_names && (
            <section className="name-section" id="sibling-names" aria-labelledby="sib-heading">
              <h2 id="sib-heading" className="name-section-title">
                Sibling Names That Go with {name.name}
              </h2>
              <div className="name-sibling-groups">
                {name.sibling_names.boys && name.sibling_names.boys.length > 0 && (
                  <div className="name-sibling-group">
                    <h3>💙 Brother names</h3>
                    <div className="name-sibling-pills">
                      {name.sibling_names.boys.map((n) => (
                        <span key={n} className="name-sibling-pill">{n}</span>
                      ))}
                    </div>
                  </div>
                )}
                {name.sibling_names.girls && name.sibling_names.girls.length > 0 && (
                  <div className="name-sibling-group">
                    <h3>💗 Sister names</h3>
                    <div className="name-sibling-pills">
                      {name.sibling_names.girls.map((n) => (
                        <span key={n} className="name-sibling-pill">{n}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Famous namesakes (conditional) ──────────────────────────────── */}
          {name.famous_namesakes && name.famous_namesakes.length > 0 && (
            <section className="name-section" id="famous-namesakes" aria-labelledby="fn-heading">
              <h2 id="fn-heading" className="name-section-title">
                Famous People Named {name.name}
              </h2>
              <ul className="name-namesakes-list">
                {name.famous_namesakes.map((person) => (
                  <li key={person.name} className="name-namesake-item">
                    <span className="name-namesake-name">{person.name}</span>
                    <span className="name-namesake-desc">{person.known_for}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── SECTION 8: FAQ ───────────────────────────────────────────────── */}
          <section className="name-section" id="faq" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="name-section-title">
              Frequently Asked Questions About {name.name}
            </h2>
            <div className="name-faq-list">

              <details className="name-faq-item" id="faq-gender">
                <summary className="name-faq-question">
                  Is {name.name} a boy or girl name?
                </summary>
                <div className="name-faq-answer">
                  <p>
                    {name.name} is primarily a {name.gender === "unisex"
                      ? "unisex name used for both boys and girls"
                      : `${name.gender}'s name`}.{" "}
                    {name.gender === "unisex"
                      ? "It is used for children of any gender."
                      : `It is very rarely used for ${name.gender === "girl" ? "boys" : "girls"}.`}
                  </p>
                </div>
              </details>

              <details className="name-faq-item" id="faq-pronunciation">
                <summary className="name-faq-question">
                  How do you pronounce {name.name}?
                </summary>
                <div className="name-faq-answer">
                  <p>
                    {name.name} is pronounced <strong>{name.pronunciation_text}</strong> (IPA:{" "}
                    <em>{name.pronunciation_ipa}</em>). It has {name.syllables} syllable
                    {name.syllables !== 1 ? "s" : ""}.
                    {name.nicknames && name.nicknames.length > 0 &&
                      ` Common nicknames include ${name.nicknames.join(", ")}.`}
                  </p>
                </div>
              </details>

              <details className="name-faq-item" id="faq-meaning">
                <summary className="name-faq-question">
                  What does {name.name} mean?
                </summary>
                <div className="name-faq-answer">
                  <p>{name.meaning_short}</p>
                  {meaningParagraphs[0] && <p>{meaningParagraphs[0]}</p>}
                </div>
              </details>

              <details className="name-faq-item" id="faq-popularity">
                <summary className="name-faq-question">
                  Is {name.name} a popular name in 2026?
                </summary>
                <div className="name-faq-answer">
                  <p>
                    {name.ssa_rank
                      ? `Yes, ${name.name} is a highly popular name. It ranked #${name.ssa_rank} in the United States in ${name.ssa_year} according to the Social Security Administration. The name is ${name.trend_direction === "rising" ? "currently trending upward" : name.trend_direction === "falling" ? "gradually declining in popularity but still firmly mainstream" : "holding steady in the rankings"}.`
                      : `${name.name} is a genuine rarity — it does not appear in the SSA top 1,000 most popular names, making it an excellent choice for parents who want something distinctive.`}
                    {name.trend_context && ` ${name.trend_context}`}
                  </p>
                </div>
              </details>

              {name.middle_names && (
                <details className="name-faq-item" id="faq-middle-names">
                  <summary className="name-faq-question">
                    What are good middle names for {name.name}?
                  </summary>
                  <div className="name-faq-answer">
                    <p>
                      Good middle names for {name.name} include classic choices like{" "}
                      {(name.middle_names.classic || []).slice(0, 2).join(" and ")}, modern
                      options like {(name.middle_names.modern || []).slice(0, 2).join(" and ")},
                      and crisp one-syllable pairings like{" "}
                      {(name.middle_names.one_syllable || []).slice(0, 2).join(" and ")}. The
                      best middle name depends on your surname and personal style.
                    </p>
                  </div>
                </details>
              )}
            </div>
          </section>

        </main>

        {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
        <aside className="name-sidebar">
          {/* Personality note card */}
          <div className="name-personality-card">
            <span className="name-personality-label">Who chooses {name.name}?</span>
            <p className="name-personality-text">{name.personality_note}</p>
          </div>

          {/* Sticky app CTA */}
          <div className="name-sidebar-cta">
            <div className="name-sidebar-cta-emoji">💕</div>
            <h3 className="name-sidebar-cta-title">Love {name.name}?</h3>
            <p className="name-sidebar-cta-body">
              See if your partner agrees. Swipe on names together in Namely — the free baby name
              matching app for couples.
            </p>
            <a
              href={`${APP_STORE_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              id="name-sidebar-app-cta"
              className="name-cta-btn"
            >
              Try Namely Free →
            </a>
          </div>
        </aside>
      </div>

      {/* ── SECTION 9: Full-width CTA block ──────────────────────────────────── */}
      <section className="name-bottom-cta" id="name-app-cta" aria-labelledby="cta-heading">
        <div className="name-bottom-cta-inner">
          <div className="name-bottom-cta-text">
            <h2 id="cta-heading">
              Discussing {name.name} with your partner?
            </h2>
            <p>
              Match on it in Namely — swipe through baby names together, and celebrate when you
              both say yes to the same one.
            </p>
          </div>
          <div className="name-bottom-cta-actions">
            <a
              href={`${APP_STORE_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              id="name-bottom-app-cta"
              className="name-cta-btn name-cta-btn--large"
            >
              Start Matching Free
            </a>
            <span className="name-cta-sub">Free · No credit card needed</span>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 1024px) {
          .name-content-wrap { grid-template-columns: 1fr 320px !important; }
        }
      `}</style>
    </div>
  );
}
