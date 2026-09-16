import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wcaqbuqnrvkconziswlx.supabase.co",
        pathname: "/storage/v1/object/public/blog-images/**",
      },
    ],
  },
  async redirects() {
    return [
      // Redirects for specific URLs mentioned that are now 404ing
      {
        source: "/baby-name-trends-2026",
        destination: "/blog/baby-name-trends-2026",
        permanent: true,
      },
      {
        source: "/gender-neutral-baby-names-2026",
        destination: "/blog/gender-neutral-baby-names",
        permanent: true,
      },
      {
        source: "/blog/gender-neutral-baby-names-2026",
        destination: "/blog/gender-neutral-baby-names",
        permanent: true,
      },
      {
        source: "/nature-inspired-baby-names-2026",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/nature-inspired-baby-names-2026",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/baby-names-inspired-by-literature",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/baby-names-inspired-by-literature",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/how-to-avoid-baby-name-arguments",
        destination: "/blog/how-to-avoid-baby-name-arguments",
        permanent: true,
      },
      {
        source: "/ai-baby-name-generator-how-it-works",
        destination: "/blog/ai-baby-name-generator-how-it-works",
        permanent: true,
      },
      {
        source: "/100-unique-baby-names-and-meanings",
        destination: "/blog/100-unique-baby-names-and-meanings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
