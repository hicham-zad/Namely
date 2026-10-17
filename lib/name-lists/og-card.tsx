import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NameListPage } from "./types";

export const OG_SIZE = { width: 1200, height: 630 };

const PINK = "#FF6B8A";
const INK = "#1C1C1E";
const MUTED = "#6B6B6B";

/** Simple branded share card: logo, headline, a few names, app call-to-action. */
export async function renderListCard(page: NameListPage) {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const picks = page.featured.slice(0, 6);
  const heading = page.kicker; // e.g. "Names that mean love"
  const big = heading.length > 22 ? 72 : 88;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fff1f3 0%, #fde8ee 55%, #f5e6fb 100%)",
          padding: "56px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={56} height={56} alt="" style={{ borderRadius: 14 }} />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: INK, letterSpacing: -0.5 }}>Namely</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: big, fontWeight: 900, color: INK, lineHeight: 1.05, letterSpacing: -2 }}>
            {heading}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {picks.map((n) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  fontSize: 34,
                  fontWeight: 700,
                  color: PINK,
                  background: "#ffffff",
                  border: "2px solid #ffd3dc",
                  borderRadius: 999,
                  padding: "10px 26px",
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 28, color: MUTED }}>
            {page.names.length} names with meanings and origins
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: "#ffffff",
              background: PINK,
              borderRadius: 999,
              padding: "14px 30px",
            }}
          >
            Match names with your partner
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
