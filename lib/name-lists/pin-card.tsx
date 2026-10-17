import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NameListPage } from "./types";

/** Pinterest's preferred ratio is 2:3. */
export const PIN_SIZE = { width: 1000, height: 1500 };

const PINK = "#FF6B8A";
const INK = "#1C1C1E";
const MUTED = "#6B6B6B";

/** First clause of a meaning, trimmed to fit one line on the pin. */
function shortMeaning(meaning: string): string {
  const first = meaning.split(/\s\(|;|\s—\s/)[0].trim();
  const text = first.charAt(0).toUpperCase() + first.slice(1);
  return text.length > 40 ? `${text.slice(0, 39).trimEnd()}…` : text;
}

/** Clean 2:3 pin: title, six featured names with meanings, app call-to-action. */
export async function renderPin(page: NameListPage) {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const rows = page.featured
    .map((f) => page.names.find((n) => n.name === f))
    .filter((n): n is NonNullable<typeof n> => Boolean(n))
    .slice(0, 6);
  const headline = page.kicker;
  const titleSize = headline.length > 26 ? 76 : headline.length > 18 ? 88 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #fff1f3 0%, #fde8ee 55%, #f5e6fb 100%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={60} height={60} alt="" style={{ borderRadius: 15 }} />
          <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: INK }}>Namely</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 900, color: INK, lineHeight: 1.04, letterSpacing: -2 }}>
            {headline}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: MUTED }}>
            {page.names.length} names with meanings and origins
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {rows.map((n) => (
            <div
              key={n.name}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                border: "2px solid #ffd3dc",
                borderRadius: 24,
                padding: "16px 30px",
              }}
            >
              <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: PINK }}>{n.name}</div>
              <div style={{ display: "flex", fontSize: 28, color: INK }}>{shortMeaning(n.meaning)}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              color: "#ffffff",
              background: PINK,
              borderRadius: 999,
              padding: "18px 46px",
            }}
          >
            Match names with your partner
          </div>
          <div style={{ display: "flex", fontSize: 26, color: MUTED }}>matchbabynames.com</div>
        </div>
      </div>
    ),
    { ...PIN_SIZE }
  );
}
