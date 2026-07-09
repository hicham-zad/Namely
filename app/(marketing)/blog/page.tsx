import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { listPosts, getTopics } from "@/lib/blog";
import JsonLd from "@/components/layout/JsonLd";
import type { Blog, WithContext } from "schema-dts";

export const revalidate = 3600;

const LOGO_PINK = "#fb9cb0";
const LOGO_BLUE = "#9bccf5";

const TOPIC_COLORS: Record<string, string> = {
  "Partner Naming": LOGO_PINK,
  "AI Baby Names": LOGO_BLUE,
  "Baby Name Trends": "#a78bfa",
  "Baby Name Lists": "#6ee7b7",
};

function topicColor(topic: string) {
  return TOPIC_COLORS[topic] || LOGO_BLUE;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Baby Name Blog — Tips, Trends & Ideas for Couples | Namely",
    description: "Explore baby name guides, trends, and tips for couples. Find the perfect name together with Namely.",
    alternates: { canonical: "https://matchbabynames.com/blog" },
    openGraph: {
      title: "Baby Name Blog | Namely",
      url: "https://matchbabynames.com/blog",
      type: "website",
    },
  };
}

const blogSchema: WithContext<Blog> = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Namely Baby Name Blog",
  description: "Baby name guides, trends, and tips for couples.",
  url: "https://matchbabynames.com/blog",
  publisher: { "@type": "Organization", name: "Namely", logo: "https://matchbabynames.com/logo.png" },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const topic = sp.topic;
  const page = Math.max(1, parseInt(sp.page || "1"));

  const [{ posts, pagination }, topics] = await Promise.all([
    listPosts({ page, limit: 12, topic }),
    getTopics(),
  ]);

  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh" }}>
      <JsonLd data={blogSchema} />

      {/* Hero */}
      <section style={{ background: "var(--surface-el)", padding: "3rem 1.5rem 2rem", textAlign: "center", borderBottom: "1px solid var(--border-lt)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, color: "var(--text)", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            Baby Name Blog
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Guides, trends, and ideas for couples choosing the perfect name together.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Topic filters */}
        <nav aria-label="Filter by topic" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <Link href="/blog" style={{ padding: "0.4rem 1rem", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", background: !topic ? "var(--text)" : "var(--surface-el)", color: !topic ? "var(--bg)" : "var(--text2)" }}>
              All
            </Link>
            {topics.map((t) => (
              <Link key={t.topic} href={`/blog?topic=${encodeURIComponent(t.topic)}`}
                style={{ padding: "0.4rem 1rem", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", background: topic === t.topic ? topicColor(t.topic) : "var(--surface-el)", color: topic === t.topic ? "#fff" : "var(--text2)" }}>
                {t.topic} ({t.count})
              </Link>
            ))}
          </div>
        </nav>

        {/* Post grid */}
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text3)", padding: "4rem 0" }}>
            <p>No articles published yet — check back soon!</p>
          </div>
        ) : (
          <ul className="blog-grid" style={{ display: "grid", gap: "1.5rem", listStyle: "none", padding: 0, margin: 0 }}>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <article className="blog-card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", transition: "box-shadow 0.2s, transform 0.2s" }}>
                    {post.featured_image_url && (
                      <div style={{ position: "relative", width: "100%", paddingTop: "52.5%" }}>
                        <Image src={post.featured_image_url} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ padding: "1.25rem" }}>
                      <span style={{ display: "inline-block", background: `${topicColor(post.topic)}22`, color: topicColor(post.topic), fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.2rem 0.65rem", borderRadius: 999, marginBottom: "0.6rem" }}>
                        {post.topic}
                      </span>
                      <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.35, marginBottom: "0.5rem" }}>
                        {post.title}
                      </h2>
                      <p style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.5, marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {post.description}
                      </p>
                      <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.72rem", color: "var(--text3)" }}>
                        {post.reading_time && <span>📖 {post.reading_time}</span>}
                        {post.published_at && <span>{formatDate(post.published_at)}</span>}
                      </div>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={`/blog?page=${p}${topic ? `&topic=${encodeURIComponent(topic)}` : ""}`}
                style={{ padding: "0.4rem 0.9rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", background: p === page ? LOGO_BLUE : "var(--surface-el)", color: p === page ? "#1f2937" : "var(--text2)" }}
                aria-current={p === page ? "page" : undefined}>
                {p}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <style>{`
        @media (min-width: 640px) { .blog-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (min-width: 1024px) { .blog-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        .blog-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
