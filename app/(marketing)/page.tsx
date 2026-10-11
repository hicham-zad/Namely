import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, Plus, ShieldCheck, Smartphone, Sparkles, Star } from "lucide-react";
import JsonLd from "@/components/layout/JsonLd";
import StoreButtons from "@/components/layout/StoreButtons";
import { HeroFan, ShotGallery } from "@/components/layout/AppScreens";
import { FeatureCta, FeatureIcon } from "@/components/features/FeatureBlocks";
import type { FAQPage, Organization, SoftwareApplication, WithContext } from "schema-dts";
import { FEATURES } from "@/lib/features";
import { ANDROID_APP_URL, IOS_APP_URL, SCREENSHOTS, SCREENSHOT_ORDER, SITE_URL } from "@/lib/app-links";

export const metadata: Metadata = {
  title: { absolute: "Namely — AI Baby Name Matcher for Couples" },
  description: "Namely helps couples find the perfect baby name together. Swipe through AI-generated names, sync with your partner, and celebrate when you match. iPhone & Android.",
  alternates: { canonical: "/" },
  openGraph: { title: "Namely — AI Baby Name Matcher for Couples", description: "Find the perfect baby name together.", url: SITE_URL, type: "website", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — The AI Baby Name Matcher for Couples" }] },
};

const faqPreview = [
  { q: "Is Namely free?", a: "Namely is free to download on iPhone and Android. A $6.99/week subscription unlocks unlimited AI name generation and real-time partner sync. Cancel anytime." },
  { q: "How does the matching work?", a: "Each partner swipes through names independently. A match appears only when you've both liked the same name — no peeking at each other's votes." },
  { q: "Do we both need the app?", a: "Yes. Both partners install Namely and link accounts with a shared 6-letter code or invite link. It works across iPhone and Android, so you don't need the same phone." },
  { q: "Does Namely show name meanings?", a: "Yes. Every name includes its meaning, origin and pronunciation, plus popularity, syllables and style tags in the full profile." },
];

const orgSchema: WithContext<Organization> = {
  "@context": "https://schema.org", "@type": "Organization",
  name: "Namely", url: SITE_URL, logo: `${SITE_URL}/logo.png`,
  sameAs: [IOS_APP_URL, ANDROID_APP_URL],
  contactPoint: { "@type": "ContactPoint", email: "support@matchbabynames.com", contactType: "customer support" },
};
const appSchema: WithContext<SoftwareApplication> = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "Namely — Baby Name Matcher", operatingSystem: "iOS, Android", applicationCategory: "LifestyleApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free to download. Namely Premium is $6.99/week, cancel anytime." },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "120" },
  description: "Namely helps couples choose a baby name together using AI-powered suggestions and a swipe-to-match mechanic.",
  featureList: FEATURES.map((f) => f.name).join(", "),
  url: SITE_URL, downloadUrl: [IOS_APP_URL, ANDROID_APP_URL],
  screenshot: SCREENSHOT_ORDER.map((k) => `${SITE_URL}${SCREENSHOTS[k].src}`),
};
const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faqPreview.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const steps = [
  { title: "Download Namely", text: "Get the free app on iPhone or Android and set your style, gender and origin preferences." },
  { title: "Link with your partner", text: "Share a 6-letter code or invite link. Your partner joins and your swipe sessions connect instantly." },
  { title: "Swipe independently", text: "Each of you browses and votes solo. Your partner can't see your choices until you both agree." },
  { title: "Celebrate your match", text: "The moment you both like the same name, Namely reveals a match. No debate, just joy." },
];

export default function HomePage() {
  return (
    <div className="ft" data-theme="light">
      <JsonLd data={orgSchema} />
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      {/* ── HERO ── */}
      <section className="ft-hero" aria-labelledby="home-title">
        <div className="ft-wrap">
          <div className="ft-hero__grid">
            <div className="ft-hero__copy">
              <span className="ft-eyebrow">
                <span className="ft-eyebrow__icon"><Sparkles size={14} aria-hidden="true" /></span>
                Free on iPhone &amp; Android
              </span>
              <h1 id="home-title" className="ft-h1">Match Baby Names With <em>Your Partner</em></h1>
              <p className="ft-lead">
                Namely is the AI baby name matcher for couples — swipe privately, get instant matches, and skip the argument. Every name comes with its meaning, origin and pronunciation, so you choose with confidence.
              </p>
              <StoreButtons idPrefix="hero" />
              <div className="ft-trust">
                <span><Smartphone size={15} aria-hidden="true" /> iPhone, iPad &amp; Android</span>
                <span><ShieldCheck size={15} aria-hidden="true" /> Private votes</span>
                <span><Star size={15} fill="#fbbf24" color="#fbbf24" aria-hidden="true" /> 4.8 rating</span>
              </div>
            </div>
            <div className="ft-hero__visual">
              <HeroFan />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="ft-section ft-section--white" aria-labelledby="how-title">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">How it works</p>
            <h2 id="how-title" className="ft-h2">Four steps to a name you both love</h2>
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
      <section id="screenshots" className="ft-section ft-section--tint" aria-labelledby="shots-title">
        <div className="ft-wrap">
          <div className="ft-center" style={{ marginBottom: "2rem" }}>
            <p className="ft-kicker">Inside the app</p>
            <h2 id="shots-title" className="ft-h2">See Namely in action</h2>
            <p className="ft-sub">Swipe, match, learn what every name means, and generate fresh lists made for the two of you.</p>
          </div>
          <ShotGallery />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="ft-section ft-section--white" aria-labelledby="features-title">
        <div className="ft-wrap">
          <div className="ft-center">
            <p className="ft-kicker">Features</p>
            <h2 id="features-title" className="ft-h2">Everything you need to choose together</h2>
            <p className="ft-sub">Each feature has its own guide — tap one to see how it works.</p>
          </div>
          <ul className="ft-feature-grid">
            {FEATURES.map((f) => (
              <li key={f.slug}>
                <Link href={`/features/${f.slug}`} className="ft-fcard" id={`home-feature-${f.slug}`}>
                  <span className="ft-fcard__icon"><FeatureIcon name={f.icon} /></span>
                  <h3>{f.name}</h3>
                  <p>{f.summary}</p>
                  <span className="ft-fcard__more">Learn more <ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/features" className="ft-fcard" id="home-feature-all">
                <span className="ft-fcard__icon"><Lock size={22} aria-hidden="true" /></span>
                <h3>Private by design</h3>
                <p>Your passes stay yours. Only names you both like are ever shared. See every feature in one place.</p>
                <span className="ft-fcard__more">All features <ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ── FAQ PREVIEW ── */}
      <section id="faq-preview" className="ft-section ft-section--tint" aria-labelledby="faq-title">
        <div className="ft-wrap" style={{ maxWidth: 760 }}>
          <div className="ft-center" style={{ marginBottom: "2rem" }}>
            <p className="ft-kicker">FAQ</p>
            <h2 id="faq-title" className="ft-h2">Common questions</h2>
          </div>
          <div className="ft-faq">
            {faqPreview.map((item) => (
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

      <FeatureCta idPrefix="home" heading="Ready to find your favourite name?" text="Download Namely free and invite your partner today." />

      <div style={{ display: "flex", justifyContent: "center", padding: "0 0 3rem" }}>
        <a href="https://daniellaunches.com" target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://daniellaunches.com/badge-light.svg" alt="Featured on DanielLaunches" width="220" height="48" />
        </a>
      </div>
    </div>
  );
}
