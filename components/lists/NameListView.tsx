import Link from "next/link";
import JsonLd from "@/components/layout/JsonLd";
import StoreButtons from "@/components/layout/StoreButtons";
import { SITE_URL } from "@/lib/app-links";
import {
  allListPages,
  listLabel,
  listPath,
  pinPath,
  type ListGender,
  type ListName,
  type NameListPage,
} from "@/lib/name-lists";

const GROUPS: { gender: ListGender; heading: string; blurb: string }[] = [
  { gender: "girl", heading: "Girl names", blurb: "Names used mostly for girls." },
  { gender: "boy", heading: "Boy names", blurb: "Names used mostly for boys." },
  { gender: "unisex", heading: "Unisex names", blurb: "Names used for any child." },
];

function slugOf(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function NameRow({ n, hasPage }: { n: ListName; hasPage: boolean }) {
  const inner = (
    <>
      <span className="nl-row-name">{n.name}</span>
      <span className="nl-row-origin">{n.origin}</span>
      <span className="nl-row-meaning">{n.meaning}</span>
      <span className="nl-row-note">{n.note}</span>
    </>
  );
  return (
    <li id={slugOf(n.name)} className="nl-row">
      {hasPage ? (
        <Link href={`/names/${slugOf(n.name)}`} className="nl-row-link">
          {inner}
        </Link>
      ) : (
        <div className="nl-row-link">{inner}</div>
      )}
    </li>
  );
}

export default function NameListView({
  page,
  path,
  publishedSlugs,
}: {
  page: NameListPage;
  path: string;
  publishedSlugs: Set<string>;
}) {
  const url = `${SITE_URL}${path}`;
  const featured = page.featured
    .map((f) => page.names.find((n) => n.name === f))
    .filter((n): n is ListName => Boolean(n));
  const related = allListPages().filter((p) => p.slug !== page.slug || p.kind !== page.kind);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.title,
    numberOfItems: page.names.length,
    itemListElement: page.names.map((n, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: n.name,
      description: `${n.name} (${n.origin}): ${n.meaning}`,
    })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Names", item: `${SITE_URL}/names` },
      { "@type": "ListItem", position: 3, name: page.kicker, item: url },
    ],
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    dateModified: page.updated,
    author: { "@type": "Organization", name: "Namely" },
    publisher: { "@type": "Organization", name: "Namely", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: url,
  };

  type Schema = Parameters<typeof JsonLd>[0]["data"];

  return (
    <div className="name-page">
      <JsonLd data={articleSchema as Schema} />
      <JsonLd data={itemListSchema as Schema} />
      <JsonLd data={faqSchema as Schema} />
      <JsonLd data={breadcrumbSchema as Schema} />

      <header className="name-hero">
        <div className="name-hero-inner">
          <nav aria-label="Breadcrumb" className="name-breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/names">Names</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">{page.kicker}</li>
            </ol>
          </nav>
          <div className="name-hero-badge">
            <span>{page.kicker}</span>
            <span className="name-hero-origin">{page.names.length} names</span>
          </div>
          <h1 className="name-hero-title">{page.title}</h1>
          <p className="name-hero-lead">{page.intro[0]}</p>
          <p className="nl-updated">
            Reviewed <time dateTime={page.updated}>{new Date(page.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
          </p>
        </div>
      </header>

      <div className="nl-wrap">
        {page.intro.slice(1).map((p, i) => (
          <p key={i} className="nl-prose">{p}</p>
        ))}

        <nav aria-label="Jump to section" className="nl-jump">
          {GROUPS.filter((g) => page.names.some((n) => n.gender === g.gender)).map((g) => (
            <a key={g.gender} href={`#${g.gender}`}>{g.heading}</a>
          ))}
          <a href="#how-to-choose">How to choose</a>
          <a href="#faq">FAQ</a>
        </nav>

        {featured.length > 0 && (
          <section className="nl-section" aria-labelledby="picks">
            <h2 id="picks" className="name-section-title">Our top picks</h2>
            <div className="name-similar-grid">
              {featured.map((n) => (
                <a key={n.name} href={`#${slugOf(n.name)}`} className="name-similar-card">
                  <span className="name-similar-name">{n.name}</span>
                  <span className="name-similar-origin">{n.origin}</span>
                  <span className="name-similar-meaning">{n.meaning}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {GROUPS.map((g) => {
          const rows = page.names.filter((n) => n.gender === g.gender);
          if (rows.length === 0) return null;
          return (
            <section key={g.gender} id={g.gender} className="nl-section" aria-labelledby={`${g.gender}-h`}>
              <h2 id={`${g.gender}-h`} className="name-section-title">
                {g.heading} <span className="nl-count">({rows.length})</span>
              </h2>
              <ul className="nl-list">
                {rows.map((n) => (
                  <NameRow key={`${g.gender}-${n.name}`} n={n} hasPage={publishedSlugs.has(slugOf(n.name))} />
                ))}
              </ul>
            </section>
          );
        })}

        <section className="nl-cta" aria-labelledby="nl-cta-h">
          <h2 id="nl-cta-h">Found a name you like?</h2>
          <p>Swipe through names with your partner in Namely, and see which ones you both say yes to.</p>
          <StoreButtons idPrefix="nl-mid" align="center" />
        </section>

        <section id="how-to-choose" className="nl-section" aria-labelledby="tips-h">
          <h2 id="tips-h" className="name-section-title">How to choose</h2>
          {page.tips.map((t) => (
            <div key={t.heading} className="nl-tip">
              <h3>{t.heading}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </section>

        <section id="faq" className="nl-section" aria-labelledby="faq-h">
          <h2 id="faq-h" className="name-section-title">Frequently asked questions</h2>
          <div className="name-faq-list">
            {page.faqs.map((f) => (
              <details key={f.q} className="name-faq-item">
                <summary className="name-faq-question">{f.q}</summary>
                <div className="name-faq-answer"><p>{f.a}</p></div>
              </details>
            ))}
          </div>
        </section>

        <section className="nl-section nl-pin" aria-labelledby="pin-h">
          <h2 id="pin-h" className="name-section-title">Save this list</h2>
          <p className="nl-prose">Pin it for later, or share it with your partner.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pinPath(page)}
            width={300}
            height={450}
            loading="lazy"
            alt={`${page.title}: a Pinterest-sized image of top picks with meanings`}
            data-pin-description={page.metaDescription}
          />
        </section>

        <section className="nl-section" aria-labelledby="more-h">
          <h2 id="more-h" className="name-section-title">More name lists</h2>
          <div className="nl-related">
            {related.map((p) => (
              <Link key={`${p.kind}-${p.slug}`} href={listPath(p)} className="nl-related-link">
                {listLabel(p)}
              </Link>
            ))}
            <Link href="/names" className="nl-related-link">Full name directory</Link>
          </div>
        </section>
      </div>

      <section className="name-bottom-cta" aria-labelledby="nl-bottom-h">
        <div className="name-bottom-cta-inner">
          <div className="name-bottom-cta-text">
            <h2 id="nl-bottom-h">Choose a baby name together</h2>
            <p>Namely is the baby name app for couples: swipe on names, and celebrate when you both match.</p>
          </div>
          <div className="name-bottom-cta-actions">
            <StoreButtons idPrefix="nl-bottom" variant="light" />
          </div>
        </div>
      </section>
    </div>
  );
}
