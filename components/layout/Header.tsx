import Link from "next/link";
import Image from "next/image";
import StoreButtons from "@/components/layout/StoreButtons";

export default function Header() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--header-bg)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--header-border)" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" aria-label="Namely home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, position: "relative", flexShrink: 0 }}>
            <Image src="/logo.png" alt="Namely" fill sizes="36px" style={{ objectFit: "contain", borderRadius: 10 }} priority />
          </div>
          <span style={{ fontFamily: "var(--font-outfit)", fontWeight: 800, fontSize: "1.2rem", color: "var(--text)", letterSpacing: "-0.02em" }}>
            Namely
          </span>
        </Link>

        {/* Navigation & Actions */}
        <nav aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Link href="/features" className="header-nav-link" id="header-features-link">
            Features
          </Link>
          <Link href="/blog" className="header-nav-link" id="header-blog-link">
            Blog
          </Link>
          <StoreButtons idPrefix="header" variant="compact" />
        </nav>
      </div>
      <style>{`
        .header-nav-link {
          color: var(--text2);
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .header-nav-link:hover {
          color: var(--text) !important;
        }
        @media (max-width: 560px) {
          .header-nav-link { display: none; }
        }
      `}</style>
    </header>
  );
}

