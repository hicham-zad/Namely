import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "var(--surface)", color: "var(--text3)", padding: "1.5rem 1.5rem", borderTop: "1px solid var(--border-lt)" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <p style={{ fontSize: "0.75rem", margin: 0 }}>
          © {year} Namely LLC · Wyoming, USA
        </p>
        <nav aria-label="Footer navigation" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {[
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/support", label: "Support" },
            { href: "/faq", label: "FAQ" },
            { href: "/delete-account", label: "Delete Account" },
            { href: "mailto:support@matchbabynames.com", label: "Contact", ext: true },
          ].map((l) =>
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
