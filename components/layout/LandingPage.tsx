import Link from "next/link";
import { ArrowRight, Plus, BadgeCheck, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import JsonLd from "@/components/layout/JsonLd";
import StoreButtons from "@/components/layout/StoreButtons";
import { HeroFan, ShotGallery } from "@/components/layout/AppScreens";
import { FeatureCta, FeatureIcon } from "@/components/features/FeatureBlocks";
import type { FAQPage, SoftwareApplication, WithContext } from "schema-dts";
import { FEATURES } from "@/lib/features";
import { ANDROID_APP_URL, IOS_APP_URL, SCREENSHOTS, SCREENSHOT_ORDER, SITE_URL } from "@/lib/app-links";

export interface LandingPageFaq {
  q: string;
  a: string;
}

export interface LandingPageConfig {
  /** Canonical slug, e.g. "/tinder-for-baby-names" */
  slug: string;
  /** Hero H1 */
  h1: string;
  /** Hero intro paragraph (~80 words) */
  heroParagraph: string;
  /** Trust badge text above the H1 (optional) */
  badgeText?: string;
  /** CTA section heading */
  ctaHeading: string;
  /** CTA section subtext */
  ctaSubtext: string;
  /** Keyword-scoped alt texts; the first three are used on the hero screenshots (swipe, home, matches) */
  screenshotAlts: [string, string, string, string, string];
  /** 3 FAQ items */
  faqItems: [LandingPageFaq, LandingPageFaq, LandingPageFaq];
}

const steps = [
  { title: "Download Namely", text: "Get the free app on iPhone or Android and set your style, gender and origin preferences." },
  { title: "Link with your partner", text: "Share a 6-letter code or invite link. Your swipe sessions connect instantly." },
  { title: "Swipe independently", text: "Each of you votes solo. Your partner can't see your choices until you both agree." },
  { title: "Celebrate your match", text: "The moment you both like the same name, Namely reveals a match." },
];

export default function LandingPage({ config }: { config: LandingPageConfig }) {
  const canonicalUrl = `${SITE_URL}${config.slug}`;
  const idPrefix = config.slug.replace(/^\//, "") || "landing";

  const appSchema: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org", "@type": "SoftwareApplication",
    name: "Namely — Baby Name Matcher", operatingSystem: "iOS, Android", applicationCategory: "LifestyleApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free to download. Namely Premium is $6.99/week, cancel anytime." },
    description: "Namely helps couples choose a baby name together using AI-powered suggestions and a swipe-to-match mechanic.",
    url: canonicalUrl,
    downloadUrl: [IOS_APP_URL, ANDROID_APP_URL],
    screenshot: SCREENSHOT_ORDER.map((k) => `${SITE_URL}${SCREENSHOTS[k].src}`),
  };
  const faqSchema: WithContext<FAQPage> = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: config.faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="ft" data-theme="light">
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      {/* ── HERO ── */}
      <section className="ft-hero" aria-labelledby="landing-title">
        <div className="ft-wrap">
          <div className="ft-hero__grid">
            <div className="ft-hero__copy">
              <span className="ft-eyebrow">
                <span className="ft-eyebrow__icon"><Sparkles size={14} aria-hidden="true" /></span>
                {(config.badgeText ?? "Free to download · Cancel anytime").replace(/^✓\s*/, "")}
              </span>
              <h1 id="landing-title" className="ft-h1">{config.h1}</h1>
              <p className="ft-lead">{config.heroParagraph}</p>
              <StoreButtons idPrefix={`${idPrefix}-hero`} />
              <div className="ft-trust">
                <span><Smartphone size={15} aria-hidden="true" /> iPhone, iPad &amp; Android</span>
                <span><ShieldCheck size={15} aria-hidden="true" /> Private votes</span>
                <span><BadgeCheck size={15} aria-hidden="true" /> Free to download</span>
              </div>
            </div>
            <div className="ft-hero__visual">
              <HeroFan alts={[config.screenshotAlts[0], config.screenshotAlts[1], config.screenshotAlts[2]]} />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="ft-section ft-section--white" aria-labelledby="landing-how">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">How it works</p>
            <h2 id="landing-how" className="ft-h2">Four steps to a name you both love</h2>
          </div>
          <ol className="ft-steps">
            {steps.map((s) => (
              <li key={s.title} className="ft-step">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── SCREENSHOTS ── */}
      <section className="ft-section ft-section--tint" aria-labelledby="landing-shots">
        <div className="ft-wrap">
          <div className="ft-center" style={{ marginBottom: "2rem" }}>
            <p className="ft-kicker">Inside the app</p>
            <h2 id="landing-shots" className="ft-h2">See Namely in action</h2>
          </div>
          <ShotGallery />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="ft-section ft-section--white" aria-labelledby="landing-features">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">Features</p>
            <h2 id="landing-features" className="ft-h2">Everything you need to choose together</h2>
          </div>
          <ul className="ft-feature-grid">
            {FEATURES.slice(0, 6).map((f) => (
              <li key={f.slug}>
                <Link href={`/features/${f.slug}`} className="ft-fcard">
                  <span className="ft-fcard__icon"><FeatureIcon name={f.icon} /></span>
                  <h3>{f.name}</h3>
                  <p>{f.summary}</p>
                  <span className="ft-fcard__more">Learn more <ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="ft-section ft-section--tint" aria-labelledby="landing-faq">
        <div className="ft-wrap" style={{ maxWidth: 760 }}>
          <div className="ft-center">
            <p className="ft-kicker">FAQ</p>
            <h2 id="landing-faq" className="ft-h2">Common questions</h2>
          </div>
          <div className="ft-faq">
            {config.faqItems.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <span className="ft-faq__plus" aria-hidden="true"><Plus size={16} /></span>
                </summary>
                <div className="ft-faq__a">{item.a}</div>
              </details>
            ))}
          </div>
          <p className="ft-center" style={{ marginTop: "1.5rem" }}>
            <Link href="/faq" className="ft-inline-link">View all FAQs <ArrowRight size={15} aria-hidden="true" /></Link>
          </p>
        </div>
      </section>

      <FeatureCta idPrefix={idPrefix} heading={config.ctaHeading} text={config.ctaSubtext} />
    </div>
  );
}
