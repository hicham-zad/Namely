import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Plus, ShieldCheck, Smartphone, Star } from "lucide-react";
import type { BreadcrumbList, FAQPage, SoftwareApplication, WebPage, WithContext } from "schema-dts";
import JsonLd from "@/components/layout/JsonLd";
import StoreButtons from "@/components/layout/StoreButtons";
import { FeatureCta, FeatureIcon } from "@/components/features/FeatureBlocks";
import { FEATURES, getFeature } from "@/lib/features";
import { ANDROID_APP_URL, IOS_APP_URL, SCREENSHOTS, SCREENSHOT_ORDER, SCREENSHOT_SIZE, SITE_URL } from "@/lib/app-links";

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return {};
  const url = `${SITE_URL}/features/${feature.slug}`;
  const shot = SCREENSHOTS[feature.screenshot];
  return {
    title: { absolute: feature.metaTitle },
    description: feature.metaDescription,
    keywords: [feature.primaryKeyword, "baby name app", "baby names for couples", "Namely"],
    alternates: { canonical: `/features/${feature.slug}` },
    openGraph: {
      title: feature.metaTitle,
      description: feature.metaDescription,
      url,
      type: "website",
      images: [
        { url: "/og-image.png", width: 1200, height: 630, alt: `Namely — ${feature.name}` },
        { url: shot.src, width: SCREENSHOT_SIZE.width, height: SCREENSHOT_SIZE.height, alt: shot.alt },
      ],
    },
    twitter: { card: "summary_large_image", title: feature.metaTitle, description: feature.metaDescription },
  };
}

/** Wrap the final word(s) of the H1 in <em> for the gradient accent. */
function accentH1(h1: string) {
  const words = h1.split(" ");
  const tail = words.length > 4 ? 2 : 1;
  return (
    <>
      {words.slice(0, -tail).join(" ")} <em>{words.slice(-tail).join(" ")}</em>
    </>
  );
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const url = `${SITE_URL}/features/${feature.slug}`;
  const shot = SCREENSHOTS[feature.screenshot];
  const related = feature.related.map(getFeature).filter((f): f is NonNullable<typeof f> => Boolean(f));

  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Features", item: `${SITE_URL}/features` },
      { "@type": "ListItem", position: 3, name: feature.name, item: url },
    ],
  };
  const faqSchema: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: feature.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const pageSchema: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: feature.metaTitle,
    description: feature.metaDescription,
    url,
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${shot.src}`, caption: shot.alt },
    isPartOf: { "@type": "WebSite", name: "Namely", url: SITE_URL },
  };
  const appSchema: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Namely: Baby Name Matcher",
    operatingSystem: "iOS, Android",
    applicationCategory: "LifestyleApplication",
    featureList: feature.highlights.map((h) => h.title).join(", "),
    screenshot: `${SITE_URL}${shot.src}`,
    downloadUrl: [IOS_APP_URL, ANDROID_APP_URL],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free to download. Namely Premium is $6.99/week, cancel anytime." },
    url,
  };

  return (
    <div className="ft" data-theme="light">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={pageSchema} />
      <JsonLd data={appSchema} />

      {/* ── HERO ── */}
      <section className="ft-hero" aria-labelledby="feature-title">
        <div className="ft-wrap">
          <nav className="ft-crumbs" aria-label="Breadcrumb" style={{ paddingTop: 0, marginBottom: "2rem", position: "relative", zIndex: 1 }}>
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/features">Features</Link></li>
              <li aria-current="page">{feature.name}</li>
            </ol>
          </nav>

          <div className="ft-hero__grid">
            <div className="ft-hero__copy">
              <span className="ft-eyebrow">
                <span className="ft-eyebrow__icon"><FeatureIcon name={feature.icon} size={14} /></span>
                {feature.eyebrow}
              </span>
              <h1 id="feature-title" className="ft-h1">{accentH1(feature.h1)}</h1>
              <p className="ft-lead">{feature.intro}</p>
              <StoreButtons idPrefix="feature-hero" />
              <div className="ft-trust">
                <span><Smartphone size={15} aria-hidden="true" /> iPhone, iPad &amp; Android</span>
                <span><ShieldCheck size={15} aria-hidden="true" /> Private by design</span>
                <span><Star size={15} fill="#fbbf24" color="#fbbf24" aria-hidden="true" /> Loved by couples</span>
              </div>
            </div>

            <div className="ft-hero__visual">
              <div className="ft-hero__phone">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={SCREENSHOT_SIZE.width}
                  height={SCREENSHOT_SIZE.height}
                  sizes="(max-width: 640px) 78vw, 300px"
                  priority
                />
                {feature.chips.map((chip, i) => (
                  <span key={chip} className={`ft-chip ft-chip--${i + 1}`}>
                    <span className="ft-chip__dot" aria-hidden="true" />
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section className="ft-section ft-section--white" aria-labelledby="highlights-title">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">Why it matters</p>
            <h2 id="highlights-title" className="ft-h2">{feature.name} at a glance</h2>
            <p className="ft-sub">{feature.summary}</p>
          </div>
          <ul className="ft-cards">
            {feature.highlights.map((h) => (
              <li key={h.title} className="ft-card">
                <span className="ft-card__icon"><FeatureIcon name={feature.icon} /></span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── LONG-FORM CONTENT ── */}
      <section className="ft-section">
        <div className="ft-wrap ft-article-grid">
          <aside className="ft-toc" aria-label="On this page">
            <p>On this page</p>
            <ol>
              {feature.sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.heading}</a></li>
              ))}
              <li><a href="#how-to">How to get started</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ol>
          </aside>

          <article className="ft-article">
            {feature.sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}>{s.heading}</h2>
                {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                {s.bullets && (
                  <ul className="ft-bullets">
                    {s.bullets.map((b) => (
                      <li key={b.title}>
                        <span className="ft-bullets__check" aria-hidden="true"><Check size={15} strokeWidth={3} /></span>
                        <span>
                          <strong>{b.title}</strong>
                          <span className="ft-bullets__text">{b.text}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {feature.landingLink && (
              <Link href={feature.landingLink.href} className="ft-inline-link">
                {feature.landingLink.label} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </article>
        </div>
      </section>

      {/* ── HOW TO ── */}
      <section id="how-to" className="ft-section ft-section--tint" aria-labelledby="how-to-title">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">Get started in minutes</p>
            <h2 id="how-to-title" className="ft-h2">How to use {feature.name.toLowerCase()} in Namely</h2>
          </div>
          <ol className="ft-steps">
            {feature.steps.map((s) => (
              <li key={s.title} className="ft-step">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="ft-strip" role="list" aria-label="Namely app screenshots">
            {SCREENSHOT_ORDER.map((key) => {
              const s = SCREENSHOTS[key];
              return (
                <figure key={key} role="listitem" className={key === feature.screenshot ? "is-active" : undefined}>
                  <Image src={s.src} alt={s.alt} width={SCREENSHOT_SIZE.width} height={SCREENSHOT_SIZE.height} sizes="160px" loading="lazy" />
                  <figcaption>{s.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="ft-section ft-section--white" aria-labelledby="faq-title">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">FAQ</p>
            <h2 id="faq-title" className="ft-h2">{feature.name}: common questions</h2>
          </div>
          <div className="ft-faq">
            {feature.faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>
                  {f.q}
                  <span className="ft-faq__plus" aria-hidden="true"><Plus size={16} strokeWidth={2.6} /></span>
                </summary>
                <div className="ft-faq__a">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      <section className="ft-section" aria-labelledby="related-title">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">Keep exploring</p>
            <h2 id="related-title" className="ft-h2">More Namely features</h2>
          </div>
          <ul className="ft-feature-grid">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/features/${r.slug}`} className="ft-fcard" id={`related-${r.slug}`}>
                  <span className="ft-fcard__icon"><FeatureIcon name={r.icon} /></span>
                  <h3>{r.name}</h3>
                  <p>{r.summary}</p>
                  <span className="ft-fcard__more">Learn more <ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="ft-center" style={{ marginTop: "1.75rem" }}>
            <Link href="/features" className="ft-btn" id="all-features-link">See all features <ArrowRight size={16} aria-hidden="true" /></Link>
          </p>
        </div>
      </section>

      <FeatureCta
        idPrefix="feature"
        heading="Find the name you'll both love"
        text={`Download Namely on iPhone or Android and try ${feature.name.toLowerCase()} today — it takes less than a minute to get started.`}
      />
    </div>
  );
}
