import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Heart } from "lucide-react";
import type { BreadcrumbList, ItemList, WithContext } from "schema-dts";
import JsonLd from "@/components/layout/JsonLd";
import StoreButtons from "@/components/layout/StoreButtons";
import { FeatureCta, FeatureIcon } from "@/components/features/FeatureBlocks";
import { FEATURES } from "@/lib/features";
import { SCREENSHOTS, SCREENSHOT_SIZE, SITE_URL } from "@/lib/app-links";

const TITLE = "Namely Features — Swipe, Match & Name Your Baby Together";
const DESCRIPTION =
  "Explore every Namely feature: swipe baby names, match with your partner, AI name generator, meanings and origins, smart filters, partner sync and shortlists.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/features" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/features`,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely app features" }],
  },
};

export default function FeaturesHubPage() {
  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Features", item: `${SITE_URL}/features` },
    ],
  };
  const listSchema: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Namely app features",
    itemListElement: FEATURES.map((f, i) => ({ "@type": "ListItem", position: i + 1, name: f.name, url: `${SITE_URL}/features/${f.slug}` })),
  };

  return (
    <div className="ft" data-theme="light">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={listSchema} />

      {/* ── HERO ── */}
      <section className="ft-hero" aria-labelledby="features-title">
        <div className="ft-wrap">
          <div className="ft-hero__grid">
            <div className="ft-hero__copy">
              <span className="ft-eyebrow">
                <span className="ft-eyebrow__icon"><Heart size={13} fill="currentColor" aria-hidden="true" /></span>
                Everything inside Namely
              </span>
              <h1 id="features-title" className="ft-h1">
                Every feature you need to name your baby <em>together</em>
              </h1>
              <p className="ft-lead">
                Namely is the baby name matcher for couples. Swipe through personalised baby names, learn what every name
                means, and see only the names you and your partner both love. Here&apos;s a closer look at each feature
                inside the app.
              </p>
              <StoreButtons idPrefix="features-hero" />
            </div>
            <div className="ft-hero__visual">
              <div className="ft-hero__phone">
                <Image
                  src={SCREENSHOTS.home.src}
                  alt={SCREENSHOTS.home.alt}
                  width={SCREENSHOT_SIZE.width}
                  height={SCREENSHOT_SIZE.height}
                  sizes="(max-width: 640px) 78vw, 300px"
                  priority
                />
                <span className="ft-chip ft-chip--1"><span className="ft-chip__dot" aria-hidden="true" />7 core features</span>
                <span className="ft-chip ft-chip--2"><span className="ft-chip__dot" aria-hidden="true" />iOS + Android</span>
                <span className="ft-chip ft-chip--3"><span className="ft-chip__dot" aria-hidden="true" />Built for two</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK GRID ── */}
      <section className="ft-section ft-section--white" aria-labelledby="overview-title">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">Overview</p>
            <h2 id="overview-title" className="ft-h2">Jump to a feature</h2>
            <p className="ft-sub">Each feature has its own guide with tips, screenshots and answers to common questions.</p>
          </div>
          <ul className="ft-feature-grid">
            {FEATURES.map((f) => (
              <li key={f.slug}>
                <Link href={`/features/${f.slug}`} className="ft-fcard" id={`feature-card-${f.slug}`}>
                  <span className="ft-fcard__icon"><FeatureIcon name={f.icon} /></span>
                  <h3>{f.name}</h3>
                  <p>{f.summary}</p>
                  <span className="ft-fcard__more">Explore <ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── DETAILED ROWS ── */}
      <section className="ft-section" aria-labelledby="deep-dive-title">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">Deep dive</p>
            <h2 id="deep-dive-title" className="ft-h2">How each feature helps you choose</h2>
          </div>
          <div className="ft-rows">
            {FEATURES.map((f) => {
              const shot = SCREENSHOTS[f.screenshot];
              return (
                <article key={f.slug} className="ft-row" aria-labelledby={`row-${f.slug}`}>
                  <div>
                    <span className="ft-eyebrow">
                      <span className="ft-eyebrow__icon"><FeatureIcon name={f.icon} size={14} /></span>
                      {f.eyebrow}
                    </span>
                    <h2 id={`row-${f.slug}`}>{f.name}</h2>
                    <p>{f.intro}</p>
                    <ul>
                      {f.highlights.slice(0, 3).map((h) => (
                        <li key={h.title}><Check size={16} strokeWidth={3} aria-hidden="true" /> <span><strong>{h.title}.</strong> {h.text}</span></li>
                      ))}
                    </ul>
                    <Link href={`/features/${f.slug}`} className="ft-btn" id={`row-link-${f.slug}`}>
                      Learn about {f.name.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="ft-row__media">
                    <Image src={shot.src} alt={shot.alt} width={SCREENSHOT_SIZE.width} height={SCREENSHOT_SIZE.height} sizes="220px" loading="lazy" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <FeatureCta
        idPrefix="features"
        heading="Ready to start matching?"
        text="Download Namely, invite your partner, and find the baby name you'll both love — on iPhone or Android."
      />
    </div>
  );
}
