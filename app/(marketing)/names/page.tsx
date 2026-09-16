import type { Metadata } from "next";
import Link from "next/link";
import { listNamePages } from "@/lib/names";
import JsonLd from "@/components/layout/JsonLd";

export const revalidate = 3600;

const SITE_URL = "https://matchbabynames.com";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const gender = sp.gender as "girl" | "boy" | "unisex" | undefined;

  const titleSuffix = gender ? ` — ${gender.charAt(0).toUpperCase() + gender.slice(1)} Names` : "";
  return {
    title: `Baby Name Directory${titleSuffix} — Meaning, Origin & Popularity | Namely`,
    description:
      "Browse our complete baby name directory. Every name includes meaning, origin, pronunciation, popularity rank, middle name pairings, and more.",
    alternates: { canonical: gender ? `${SITE_URL}/names?gender=${gender}` : `${SITE_URL}/names` },
    openGraph: {
      title: `Baby Name Directory | Namely`,
      url: `${SITE_URL}/names`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
  };
}

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Baby Name Directory",
  description:
    "A comprehensive directory of baby names with meanings, origins, pronunciations, and popularity data.",
  url: `${SITE_URL}/names`,
  publisher: {
    "@type": "Organization",
    name: "Namely",
    logo: `${SITE_URL}/logo.png`,
  },
};

function GenderBadge({ gender }: { gender: string }) {
  const map: Record<string, { label: string; color: string }> = {
    girl: { label: "Girl", color: "#fb9cb0" },
    boy: { label: "Boy", color: "#9bccf5" },
    unisex: { label: "Unisex", color: "#c4b5fd" },
  };
  const { label, color } = map[gender] || { label: gender, color: "#ccc" };
  return (
    <span
      style={{
        fontSize: "0.68rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        background: `${color}22`,
        color,
        padding: "0.15rem 0.55rem",
        borderRadius: 999,
      }}
    >
      {label}
    </span>
  );
}

export default async function NamesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const gender = (sp.gender as "girl" | "boy" | "unisex") || undefined;
  const page = Math.max(1, parseInt(sp.page || "1"));

  const { names, total } = await listNamePages(page, 48, gender);
  const totalPages = Math.ceil(total / 48);

  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh" }}>
      <JsonLd data={collectionSchema as Parameters<typeof JsonLd>[0]["data"]} />

      {/* Hero */}
      <section className="names-index-hero">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#FF6B8A",
              marginBottom: "0.75rem",
            }}
          >
            Baby Name Directory
          </p>
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 900,
              color: "var(--text)",
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Find the Perfect Baby Name
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Every name includes meaning, origin, pronunciation, popularity rank, middle name
            pairings, and more — plus a direct link to match on it with your partner.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Gender filter */}
        <nav aria-label="Filter by gender" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {[
              { label: "All Names", value: undefined },
              { label: "💗 Girl Names", value: "girl" },
              { label: "💙 Boy Names", value: "boy" },
              { label: "💜 Unisex Names", value: "unisex" },
            ].map(({ label, value }) => (
              <Link
                key={label}
                href={value ? `/names?gender=${value}` : "/names"}
                style={{
                  padding: "0.45rem 1.1rem",
                  borderRadius: 999,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  background: gender === value ? "#FF6B8A" : "var(--surface-el)",
                  color: gender === value ? "#fff" : "var(--text2)",
                  border: "1.5px solid",
                  borderColor: gender === value ? "#FF6B8A" : "var(--border)",
                  transition: "all 0.15s ease",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Count */}
        <p style={{ fontSize: "0.85rem", color: "var(--text3)", marginBottom: "1.5rem" }}>
          Showing {names.length} of {total} name{total !== 1 ? "s" : ""}
          {gender ? ` · ${gender} names` : ""}
        </p>

        {/* Name grid */}
        {names.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text3)", padding: "4rem 0" }}>
            <p>No names published yet — check back soon!</p>
          </div>
        ) : (
          <ul
            className="names-index-grid"
            style={{
              display: "grid",
              gap: "1rem",
              listStyle: "none",
              padding: 0,
              margin: 0,
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {names.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/names/${n.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <article
                    className="name-index-card"
                    style={{
                      background: "var(--surface)",
                      border: "1.5px solid var(--border)",
                      borderRadius: 16,
                      padding: "1.1rem 1.1rem 0.9rem",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      transition: "box-shadow 0.18s, transform 0.18s, border-color 0.18s",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: "1.3rem",
                          fontWeight: 900,
                          color: "var(--text)",
                        }}
                      >
                        {n.name}
                      </span>
                      <GenderBadge gender={n.gender} />
                    </div>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text3)",
                        fontWeight: 600,
                        marginBottom: "0.35rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {n.origin}
                    </p>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text2)",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {n.meaning_short}
                    </p>
                    {n.ssa_rank && (
                      <div
                        style={{
                          marginTop: "0.6rem",
                          fontSize: "0.72rem",
                          color: "#FF6B8A",
                          fontWeight: 700,
                        }}
                      >
                        #{n.ssa_rank} in US
                      </div>
                    )}
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2.5rem" }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/names?page=${p}${gender ? `&gender=${gender}` : ""}`}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  background: p === page ? "#FF6B8A" : "var(--surface-el)",
                  color: p === page ? "#fff" : "var(--text2)",
                }}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <style>{`
        .name-index-card:hover {
          box-shadow: 0 6px 20px rgba(255, 107, 138, 0.12) !important;
          transform: translateY(-2px);
          border-color: rgba(255, 107, 138, 0.35) !important;
        }
      `}</style>
    </div>
  );
}
