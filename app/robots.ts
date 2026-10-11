import type { MetadataRoute } from "next";

/** API routes and the switched-off web-app auth routes have nothing worth indexing. */
const DISALLOW = ["/api/", "/auth/"];

/**
 * AI crawlers, named explicitly. A crawler that matches a named group ignores the "*"
 * group, so each one gets the same allow/disallow rules.
 */
const AI_CRAWLERS = [
  // Training / indexing
  "GPTBot", "ClaudeBot", "anthropic-ai", "Google-Extended", "Applebot-Extended", "CCBot", "Amazonbot",
  // AI search & answer engines (what gets cited)
  "OAI-SearchBot", "Claude-SearchBot", "PerplexityBot", "YouBot", "Applebot",
  // Fetches made live on a user's request
  "ChatGPT-User", "Claude-User", "Perplexity-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: "https://matchbabynames.com/sitemap.xml",
  };
}
