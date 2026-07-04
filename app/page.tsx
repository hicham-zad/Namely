import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, HeartHandshake, Zap, SlidersHorizontal, Heart, BadgeDollarSign, Link as LinkIcon, Hand, PartyPopper, Lock, Smartphone, Star, Baby } from "lucide-react";
import JsonLd from "@/components/layout/JsonLd";
import type { Organization, SoftwareApplication, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Namely — AI Baby Name Matcher for Couples",
  description: "Namely helps couples find the perfect baby name together. Swipe through AI-generated names, sync with your partner in real time, and celebrate when you match.",
  alternates: { canonical: "https://matchbabynames.com" },
  openGraph: { title: "Namely — AI Baby Name Matcher for Couples", description: "Find the perfect baby name together.", url: "https://matchbabynames.com", type: "website" },
};

const orgSchema: WithContext<Organization> = {
  "@context": "https://schema.org", "@type": "Organization",
  name: "Namely", url: "https://matchbabynames.com", logo: "https://matchbabynames.com/logo.png",
  contactPoint: { "@type": "ContactPoint", email: "support@matchbabynames.com", contactType: "customer support" },
};
const appSchema: WithContext<SoftwareApplication> = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "Namely — Baby Name Matcher", operatingSystem: "iOS, Android", applicationCategory: "LifestyleApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free to download. $6.99/week with 3-day free trial." },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "120" },
  description: "Namely helps couples choose a baby name together using AI-powered suggestions and a swipe-to-match mechanic.",
  url: "https://matchbabynames.com", downloadUrl: "https://apps.apple.com/app/namely",
};

const LOGO_PINK = "#fb9cb0";
const LOGO_BLUE = "#9bccf5";
const TEXT_DARK = "#1f2937";

function AppStoreBadge({ id }: { id: string }) {
  return (
    <a href="https://apps.apple.com/app/namely" target="_blank" rel="noopener noreferrer" id={id}
      aria-label="Download Namely on the App Store"
      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: TEXT_DARK, color: "#fff", fontWeight: 700, fontSize: "0.875rem", padding: "0.65rem 1.25rem", borderRadius: 14, textDecoration: "none" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      App Store
    </a>
  );
}

function PlayStoreBadge({ id }: { id: string }) {
  return (
    <a href="https://play.google.com/store/apps/namely" target="_blank" rel="noopener noreferrer" id={id}
      aria-label="Get Namely on Google Play"
      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: TEXT_DARK, fontWeight: 700, fontSize: "0.875rem", padding: "0.65rem 1.25rem", borderRadius: 14, textDecoration: "none", border: "1.5px solid #e5e7eb" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3.18 23.76c.37.2.8.2 1.18 0l10.91-6.3-2.35-2.35L3.18 23.76z" fill="#EA4335" />
        <path d="M22.01 10.13L19.1 8.44l-2.63 2.63 2.63 2.63 2.94-1.7c.84-.49.84-1.38-.03-1.87z" fill="#FBBC04" />
        <path d="M2.01.24C1.64.44 1.4.84 1.4 1.37v21.26c0 .53.24.93.61 1.13l.1.06L13.44 12 2.01.24z" fill="#4285F4" />
        <path d="M3.18.24L13.44 12 16.47 8.97 4.36.24C4.0.04 3.56.04 3.18.24z" fill="#34A853" />
      </svg>
      Google Play
    </a>
  );
}

const features = [
  { icon: <Sparkles size={28} color={LOGO_PINK} />, title: "AI Name Generator", desc: "Get personalised suggestions based on your style, gender preference, origins, and meaning themes." },
  { icon: <HeartHandshake size={28} color={LOGO_BLUE} />, title: "Swipe to Match", desc: "Both partners vote independently. A match is revealed only when you both like the same name." },
  { icon: <Zap size={28} color={LOGO_PINK} />, title: "Real-Time Sync", desc: "Swipes sync instantly. Names your partner rejects won't appear in your queue." },
  { icon: <SlidersHorizontal size={28} color={LOGO_BLUE} />, title: "Deep Customisation", desc: "Filter by gender, style, origin, country, name length, starting letter, and names to avoid." },
  { icon: <Heart size={28} color={LOGO_PINK} />, title: "Likes & Matches", desc: "All your liked names and shared matches are saved in one searchable, sortable list." },
  { icon: <BadgeDollarSign size={28} color={LOGO_BLUE} />, title: "Transparent Pricing", desc: "$6.99/week, 3-day free trial. Cancel anytime via App Store or Google Play — no hassle." },
];

const screenshots = [
  { src: "/screenshot-1.png", alt: "Namely — Discover screen showing name card for Gideon with like and skip buttons" },
  { src: "/screenshot-2.png", alt: "Namely — My Likes screen listing names the user has saved" },
  { src: "/screenshot-3.png", alt: "Namely — Matches screen showing names both partners liked" },
  { src: "/screenshot-4.png", alt: "Namely — Preferences screen to customise name style, gender, and origins" },
  { src: "/screenshot-5.png", alt: "Namely — Partner linking screen with 6-letter invite code" },
];

const faqPreview = [
  { q: "Is Namely free?", a: "Namely is free to download. A $6.99/week subscription (with a 3-day free trial) unlocks unlimited AI name generation and real-time partner sync." },
  { q: "How does the matching work?", a: "Each partner swipes through names independently. A match appears only when you've both liked the same name — no peeking at each other's votes." },
  { q: "Do we both need the app?", a: "Yes. Both partners install Namely and link accounts with a shared 6-letter code. Works across iOS and Android." },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={appSchema} />

      {/* ── HERO ── */}
      <section id="hero" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)", padding: "4rem 1.5rem 2rem", overflow: "hidden", position: "relative" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "center" }}>
          
          {/* Text */}
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: `1.5px solid #f1f5f9`, borderRadius: 999, padding: "0.3rem 0.85rem", marginBottom: "1.5rem" }}>
              <span style={{ color: LOGO_PINK, fontSize: "0.75rem", fontWeight: 700 }}>✓ Free 3-day trial · No credit card needed</span>
            </div>

            <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(2.25rem, 5vw, 3.25rem)", fontWeight: 900, color: TEXT_DARK, lineHeight: 1.15, marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
              Match Baby Names With Your Partner
            </h1>

            <p style={{ fontSize: "1.1rem", color: "#4b5563", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 520 }}>
              Namely is the AI baby name matcher for couples — swipe together, get instant matches, and skip the argument. No repeated names, no confusing paywalls, just names you'll both actually love.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <a href="https://apps.apple.com/app/namely" target="_blank" rel="noopener noreferrer" id="hero-main-cta"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: LOGO_BLUE, color: TEXT_DARK, fontWeight: 800, fontSize: "1rem", padding: "0.85rem 1.75rem", borderRadius: 999, textDecoration: "none", boxShadow: "0 4px 12px rgba(155, 204, 245, 0.4)" }}>
                Start Matching Free →
              </a>
            </div>
          </div>

          {/* Screenshots (fanned out) */}
          <div className="hero-screenshots-container" style={{ position: "relative", display: "flex", justifyContent: "center", alignSelf: "center", paddingTop: "1rem", paddingBottom: "1rem" }}>
            {/* Background left */}
            <div className="hero-bg-shot" style={{ position: "absolute", top: "50%", left: "50%", width: 180, transform: "translate(-115%, -45%) rotate(-12deg)", zIndex: 1, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.05))" }}>
              <Image src="/screenshot-2.png" alt="Namely App Likes" width={1242} height={2688} style={{ width: "100%", height: "auto", borderRadius: 20, display: "block" }} priority />
            </div>
            {/* Background right */}
            <div className="hero-bg-shot" style={{ position: "absolute", top: "50%", left: "50%", width: 180, transform: "translate(15%, -45%) rotate(12deg)", zIndex: 1, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.05))" }}>
              <Image src="/screenshot-5.png" alt="Namely App Partner" width={1242} height={2688} style={{ width: "100%", height: "auto", borderRadius: 20, display: "block" }} priority />
            </div>
            {/* Main foreground screenshot */}
            <div style={{ position: "relative", width: 230, zIndex: 10, filter: "drop-shadow(0 15px 30px rgba(155, 204, 245, 0.2))" }}>
              <Image src="/screenshot-1.png" alt="Namely app showing the name swipe screen" width={1242} height={2688} style={{ width: "100%", height: "auto", borderRadius: 26, display: "block", border: "2px solid #fff" }} priority />
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            #hero > div { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 640px) {
            .hero-bg-shot { display: none !important; }
          }
        `}</style>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: "#fff", borderTop: "1px solid #f8fafc", borderBottom: "1px solid #f8fafc" }} aria-label="Trust signals">
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0.75rem 1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
          {[
            { icon: <Sparkles size={16} color={LOGO_PINK} />, text: "AI-powered names" },
            { icon: <HeartHandshake size={16} color={LOGO_BLUE} />, text: "Built for couples" },
            { icon: <Lock size={16} color={LOGO_PINK} />, text: "Private & secure" },
            { icon: <Smartphone size={16} color={LOGO_BLUE} />, text: "iOS & Android" },
            { icon: <Star size={16} color="#fbbf24" fill="#fbbf24" />, text: "4.8 rating" }
          ].map(t => (
            <span key={t.text} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>
              {t.icon} {t.text}
            </span>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: "#fff", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: TEXT_DARK, marginBottom: "0.5rem" }}>How it works</h2>
            <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 400, margin: "0 auto" }}>Three steps to find the name you both love.</p>
          </div>
          <ol style={{ display: "grid", gap: "1.25rem", listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { n: "1", icon: <LinkIcon size={32} color={LOGO_BLUE} />, title: "Link with your partner", desc: "Share a 6-letter code. Your partner enters it and your swipe sessions are connected instantly." },
              { n: "2", icon: <Hand size={32} color={LOGO_PINK} />, title: "Swipe independently", desc: "Each of you browses and votes solo. Your partner can't see your choices until you both agree." },
              { n: "3", icon: <PartyPopper size={32} color={LOGO_BLUE} />, title: "Celebrate your match", desc: "The moment you both like the same name, Namely reveals a match. Just joy." },
            ].map(s => (
              <li key={s.n} style={{ background: "#f8fafc", borderRadius: 16, padding: "1.5rem", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
                  <div style={{ background: "#fff", padding: "0.75rem", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    {s.icon}
                  </div>
                </div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: LOGO_PINK, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Step {s.n}</div>
                <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.05rem", fontWeight: 800, color: TEXT_DARK, marginBottom: "0.4rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
        <style>{`
          @media (min-width: 768px) {
            #how-it-works ol { grid-template-columns: repeat(3, 1fr) !important; }
          }
        `}</style>
      </section>

      {/* ── SCREENSHOTS ── */}
      <section id="screenshots" style={{ background: "#f8fafc", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: TEXT_DARK, marginBottom: "0.5rem" }}>See Namely in action</h2>
            <p style={{ color: "#6b7280", fontSize: "1rem" }}>Beautifully simple. Built for the moments that matter.</p>
          </div>
          <div className="screenshots-row" style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
            {screenshots.map((s, i) => (
              <div key={i} style={{ flexShrink: 0, width: 160, scrollSnapAlign: "center", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.06))" }}>
                <Image src={s.src} alt={s.alt} width={1242} height={2688} sizes="160px" style={{ width: "160px", height: "auto", borderRadius: 18, display: "block" }} loading={i === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (min-width: 1024px) {
            .screenshots-row { justify-content: center; }
          }
        `}</style>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background: "#fff", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: TEXT_DARK, marginBottom: "0.5rem" }}>Everything you need</h2>
            <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 400, margin: "0 auto" }}>Namely makes the name search fun, fair, and stress-free.</p>
          </div>
          <ul style={{ display: "grid", gap: "1rem", listStyle: "none", padding: 0, margin: 0 }}>
            {features.map(f => (
              <li key={f.title} style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <div style={{ marginBottom: "0.75rem", display: "inline-flex", background: "#f8fafc", padding: "0.6rem", borderRadius: "10px" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: "0.95rem", fontWeight: 800, color: TEXT_DARK, marginBottom: "0.3rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </li>
            ))}
          </ul>
        </div>
        <style>{`
          @media (min-width: 640px) { #features ul { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (min-width: 1024px) { #features ul { grid-template-columns: repeat(3, 1fr) !important; } }
        `}</style>
      </section>

      {/* ── FAQ PREVIEW ── */}
      <section id="faq-preview" style={{ background: "#f8fafc", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: TEXT_DARK, marginBottom: "0.5rem" }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {faqPreview.map(item => (
              <details key={item.q} style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, overflow: "hidden" }}>
                <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.1rem", fontWeight: 700, color: TEXT_DARK, fontSize: "0.9rem", cursor: "pointer" }}>
                  {item.q}
                  <span style={{ color: LOGO_BLUE, fontSize: "1.2rem", flexShrink: 0, marginLeft: 12 }} aria-hidden="true">+</span>
                </summary>
                <div style={{ padding: "0 1.1rem 1rem", fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.6 }}>{item.a}</div>
              </details>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <Link href="/faq" style={{ fontSize: "0.85rem", fontWeight: 700, color: LOGO_PINK, textDecoration: "none" }}>
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section id="cta" style={{ background: "#fff", padding: "3rem 1.5rem", textAlign: "center", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }} aria-hidden="true">
            <Baby size={48} color={LOGO_BLUE} />
          </div>
          <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(1.5rem, 3vw, 1.75rem)", fontWeight: 800, marginBottom: "0.5rem", color: TEXT_DARK }}>
            Ready to find your favourite name?
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            Download Namely free. Start your 3-day trial and invite your partner today.
          </p>
            <a href="https://apps.apple.com/app/namely" target="_blank" rel="noopener noreferrer" id="cta-main-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: LOGO_BLUE, color: TEXT_DARK, fontWeight: 800, fontSize: "1rem", padding: "0.85rem 1.75rem", borderRadius: 999, textDecoration: "none", boxShadow: "0 4px 12px rgba(155, 204, 245, 0.4)" }}>
              Start Matching Free →
            </a>
        </div>
      </section>
    </>
  );
}
