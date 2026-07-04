import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllSlugs } from "@/lib/blog";
import JsonLd from "@/components/layout/JsonLd";
import type { Article, BreadcrumbList, WithContext } from "schema-dts";

export const revalidate = 3600;
export const dynamicParams = true; // serve new slugs on-demand at runtime

const LOGO_PINK = "#fb9cb0";
const LOGO_BLUE = "#9bccf5";
const TEXT_DARK = "#1f2937";
const SITE_URL = "https://matchbabynames.com";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // No env vars at build time — pages generated on-demand at runtime
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};
    return {
      title: post.title,
      description: post.description,
      keywords: post.keywords,
      alternates: { canonical: `${SITE_URL}/blog/${slug}` },
      openGraph: {
        title: post.title,
        description: post.description,
        url: `${SITE_URL}/blog/${slug}`,
        type: "article",
        images: post.featured_image_url
          ? [{ url: post.featured_image_url, width: 1200, height: 630, alt: post.title }]
          : [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image" },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, post.topic);

  const articleSchema: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    image: post.featured_image_url || `${SITE_URL}/og-image.png`,
    publisher: {
      "@type": "Organization",
      name: "Namely",
      logo: `${SITE_URL}/logo.png`,
    },
    author: { "@type": "Organization", name: "Namely" },
    keywords: post.keywords?.join(", "),
  };

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumb} />

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)", padding: "3rem 1.5rem 2rem", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "1.25rem" }}>
            <ol style={{ display: "flex", gap: "0.4rem", alignItems: "center", listStyle: "none", padding: 0, margin: 0 }}>
              <li><Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/blog" style={{ color: "#9ca3af", textDecoration: "none" }}>Blog</Link></li>
              <li aria-hidden="true">›</li>
              <li style={{ color: TEXT_DARK, fontWeight: 500 }}>{post.title}</li>
            </ol>
          </nav>

          {/* Topic badge */}
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ background: `${LOGO_BLUE}22`, color: LOGO_BLUE, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.2rem 0.65rem", borderRadius: 999 }}>
              {post.topic}
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(1.6rem, 4vw, 2.5rem)", fontWeight: 900, color: TEXT_DARK, lineHeight: 1.2, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            {post.title}
          </h1>

          <p style={{ color: "#6b7280", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            {post.description}
          </p>

          <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.8rem", color: "#9ca3af" }}>
            {post.reading_time && <span>📖 {post.reading_time}</span>}
            {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
            <span>By Namely</span>
          </div>
        </div>
      </div>

      {/* Featured image */}
      {post.featured_image_url && (
        <div style={{ maxWidth: 760, margin: "2rem auto 0", padding: "0 1.5rem" }}>
          <div style={{ position: "relative", width: "100%", paddingTop: "52.5%", borderRadius: 20, overflow: "hidden" }}>
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 760px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      )}

      {/* Article body + sidebar */}
      <div className="blog-post-layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem", display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>

        {/* Main content */}
        <article
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />

        {/* Sidebar */}
        <aside>
          {/* CTA card */}
          <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #fff 100%)", border: "1.5px solid #f1f5f9", borderRadius: 20, padding: "1.5rem", marginBottom: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>👶</div>
            <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 800, color: TEXT_DARK, marginBottom: "0.5rem", fontSize: "1rem" }}>
              Find your perfect baby name
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#6b7280", marginBottom: "1rem", lineHeight: 1.5 }}>
              Swipe together, match instantly, and agree without the argument.
            </p>
            <a
              href="https://apps.apple.com/app/namely"
              target="_blank"
              rel="noopener noreferrer"
              id="blog-sidebar-cta"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: LOGO_BLUE, color: TEXT_DARK, fontWeight: 800, fontSize: "0.85rem", padding: "0.65rem 1.25rem", borderRadius: 999, textDecoration: "none" }}
            >
              Try Namely Free →
            </a>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 800, color: TEXT_DARK, fontSize: "0.9rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #f8fafc" }}>
                Related Articles
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {relatedPosts.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} style={{ textDecoration: "none", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      {r.featured_image_url && (
                        <div style={{ flexShrink: 0, width: 60, height: 45, borderRadius: 8, overflow: "hidden", position: "relative" }}>
                          <Image src={r.featured_image_url} alt={r.title} fill style={{ objectFit: "cover" }} sizes="60px" />
                        </div>
                      )}
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: TEXT_DARK, lineHeight: 1.35 }}>{r.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Bottom CTA */}
      <section style={{ background: "#f8fafc", borderTop: "1px solid #f1f5f9", padding: "3rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-outfit)", fontWeight: 900, color: TEXT_DARK, fontSize: "clamp(1.25rem, 3vw, 1.6rem)", marginBottom: "0.5rem" }}>
            Ready to find your perfect baby name?
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            Download Namely free. 3-day trial, no credit card needed.
          </p>
          <a href="https://apps.apple.com/app/namely" target="_blank" rel="noopener noreferrer" id="blog-post-bottom-cta"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: LOGO_BLUE, color: TEXT_DARK, fontWeight: 800, fontSize: "1rem", padding: "0.85rem 1.75rem", borderRadius: 999, textDecoration: "none", boxShadow: "0 4px 12px rgba(155, 204, 245, 0.4)" }}>
            Start Matching Free →
          </a>
        </div>
      </section>

      <style>{`
        @media (min-width: 900px) {
          .blog-post-layout { grid-template-columns: 1fr 300px !important; }
        }
      `}</style>
    </>
  );
}
