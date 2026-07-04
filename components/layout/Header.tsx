import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" aria-label="Namely home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, position: "relative", flexShrink: 0 }}>
            <Image src="/logo.png" alt="Namely" fill style={{ objectFit: "contain", borderRadius: 10 }} priority />
          </div>
          <span style={{ fontFamily: "var(--font-outfit)", fontWeight: 800, fontSize: "1.2rem", color: "#1e293b", letterSpacing: "-0.02em" }}>
            Namely
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ flex: 1, display: "flex", justifyContent: "flex-end", paddingRight: "1.5rem" }}>
          <Link 
            href="/blog" 
            style={{ 
              color: "#4b5563", 
              fontWeight: 600, 
              fontSize: "0.95rem", 
              textDecoration: "none",
              transition: "color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#111827"}
            onMouseOut={(e) => e.currentTarget.style.color = "#4b5563"}
          >
            Blog
          </Link>
        </nav>

        {/* CTA */}
        <a href="https://apps.apple.com/app/namely" target="_blank" rel="noopener noreferrer" id="header-cta-btn"
          style={{ background: "#9bccf5", color: "#1f2937", fontWeight: 700, fontSize: "0.875rem", padding: "0.5rem 1.25rem", borderRadius: 999, textDecoration: "none", display: "inline-block" }}>
          Start Matching Free
        </a>
      </div>
    </header>
  );
}
