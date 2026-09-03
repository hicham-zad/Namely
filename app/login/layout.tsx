import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Namely",
  alternates: { canonical: "https://matchbabynames.com/login" },
  openGraph: {
    title: "Login | Namely",
    url: "https://matchbabynames.com/login",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — The AI Baby Name Matcher for Couples" }],
  },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
