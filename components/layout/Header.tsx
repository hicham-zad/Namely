import Link from "next/link";
import Image from "next/image";
import { Apple, Globe } from "lucide-react";

export default function Header() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--header-bg)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--header-border)" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" aria-label="Namely home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, position: "relative", flexShrink: 0 }}>
            <Image src="/logo.png" alt="Namely" fill style={{ objectFit: "contain", borderRadius: 10 }} priority />
          </div>
          <span style={{ fontFamily: "var(--font-outfit)", fontWeight: 800, fontSize: "1.2rem", color: "var(--text)", letterSpacing: "-0.02em" }}>
            Namely
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ flex: 1, display: "flex", justifyContent: "flex-end", paddingRight: "1.5rem" }}>
          <Link 
            href="/blog" 
            className="nav-link"
            style={{ 
              color: "var(--text2)", 
              fontWeight: 600, 
              fontSize: "0.95rem", 
              textDecoration: "none",
              transition: "color 0.2s"
            }}
          >
            Blog
          </Link>
        </nav>

        {/* CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text2)", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}>
            <Globe size={16} /> Start Matching
          </Link>
          <a href="https://apps.apple.com/app/namely" target="_blank" rel="noopener noreferrer" id="header-cta-btn"
            style={{ display: "none", alignItems: "center", gap: 6, background: "#1f2937", color: "#fff", fontWeight: 700, fontSize: "0.875rem", padding: "0.55rem 1.25rem", borderRadius: 999, textDecoration: "none" }}>
            <Apple size={16} fill="currentColor" /> Get the App
          </a>
        </div>
      </div>
      <style>{`
        @media (min-width: 640px) {
          #header-cta-btn { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
