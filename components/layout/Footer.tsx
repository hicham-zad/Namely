import Link from "next/link";
import StoreButtons from "@/components/layout/StoreButtons";
import { FEATURES } from "@/lib/features";

const EXPLORE_LINKS = [
  { href: "/names", label: "Baby Name Directory" },
  { href: "/baby-name-generator-for-couples", label: "Baby Name Generator for Couples" },
  { href: "/tinder-for-baby-names", label: "Tinder for Baby Names" },
  { href: "/boy-names-app-for-couples", label: "Boy Names App for Couples" },
  { href: "/girl-names-app-for-couples", label: "Girl Names App for Couples" },
  { href: "/unique-baby-names-app", label: "Unique Baby Names App" },
  { href: "/gender-neutral-baby-names-app", label: "Gender-Neutral Baby Names" },
  { href: "/best-baby-name-app-for-couples", label: "Best Baby Name App for Couples" },
  { href: "/baby-name-app-no-fighting", label: "Baby Name App — No Arguments" },
  { href: "/pregnancy-baby-name-app", label: "Baby Name App for Expecting Parents" },
  { href: "/muslim-baby-names-app-couples", label: "Muslim Baby Names App for Couples" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Support" },
  { href: "/faq", label: "FAQ" },
  { href: "/delete-account", label: "Delete Account" },
  { href: "mailto:support@matchbabynames.com", label: "Contact", ext: true },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "var(--surface)", color: "var(--text3)", borderTop: "1px solid var(--border-lt)" }}>
      {/* Features + download */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem 0", display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem" }}>
        <div style={{ flex: "1 1 420px" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: "0.75rem" }}>
            <Link href="/features" style={{ color: "inherit", textDecoration: "none" }}>App features</Link>
          </p>
          <nav aria-label="App features" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem" }}>
            {FEATURES.map((f) => (
              <Link key={f.slug} href={`/features/${f.slug}`} style={{ fontSize: "0.75rem", color: "var(--text2)", textDecoration: "none" }}>
                {f.name}
              </Link>
            ))}
          </nav>
        </div>
        <StoreButtons idPrefix="footer" />
      </div>

      {/* Explore section */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "1.5rem 1.5rem 1rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: "0.75rem" }}>
          Explore Namely
        </p>
        <nav aria-label="Explore landing pages" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem" }}>
          {EXPLORE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{ fontSize: "0.75rem", color: "var(--text2)", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Legal / copyright bar */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0.75rem 1.5rem 1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", borderTop: "1px solid var(--border-lt)" }}>
        <p style={{ fontSize: "0.75rem", margin: 0 }}>
          © {year} Namely LLC · Wyoming, USA
        </p>
        <nav aria-label="Footer legal navigation" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {LEGAL_LINKS.map((l) =>
            l.ext ? (
              <a key={l.href} href={l.href} style={{ fontSize: "0.75rem", color: "var(--text2)", textDecoration: "none" }}>
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} style={{ fontSize: "0.75rem", color: "var(--text2)", textDecoration: "none" }}>
                {l.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </footer>
  );
}
