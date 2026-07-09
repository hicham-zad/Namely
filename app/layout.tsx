import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap", weight: ["600", "700", "800", "900"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://matchbabynames.com"),
  title: { default: "Namely — AI Baby Name Matcher for Couples", template: "%s | Namely" },
  description: "Namely helps couples find the perfect baby name together. Swipe through AI-generated names, sync with your partner in real time, and celebrate when you match.",
  keywords: ["baby names", "baby name generator", "ai baby names", "couple baby names", "swipe baby names", "baby name matcher", "tinder for baby names", "name together"],
  authors: [{ name: "Namely LLC" }],
  publisher: "Namely LLC",
  openGraph: { type: "website", siteName: "Namely", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Namely — The AI Baby Name Matcher for Couples" }] },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  robots: { index: true, follow: true },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
