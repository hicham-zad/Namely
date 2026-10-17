import Image from "next/image";
import { SCREENSHOTS, SCREENSHOT_ORDER, SCREENSHOT_SIZE, type ScreenshotKey } from "@/lib/app-links";

/** Three fanned phone screenshots used in landing-page heroes. */
export function HeroFan({
  main = "swipe",
  left = "home",
  right = "matches",
  alts,
}: {
  main?: ScreenshotKey;
  left?: ScreenshotKey;
  right?: ScreenshotKey;
  /** Optional keyword-scoped alt text overrides: [main, left, right] */
  alts?: [string, string, string];
}) {
  const shots = [
    { key: left, cls: "hero-fan__shot hero-fan__shot--left", alt: alts?.[1], sizes: "(max-width: 640px) 0px, 190px" },
    { key: right, cls: "hero-fan__shot hero-fan__shot--right", alt: alts?.[2], sizes: "(max-width: 640px) 0px, 190px" },
    { key: main, cls: "hero-fan__main", alt: alts?.[0], sizes: "240px" },
  ];
  return (
    <div className="hero-fan">
      {shots.map((s) => (
        <div key={s.cls} className={s.cls}>
          <Image
            src={SCREENSHOTS[s.key].src}
            alt={s.alt ?? SCREENSHOTS[s.key].alt}
            width={SCREENSHOT_SIZE.width}
            height={SCREENSHOT_SIZE.height}
            sizes={s.sizes}
            priority
          />
        </div>
      ))}
    </div>
  );
}

/** Horizontally scrolling gallery of every app screenshot, with captions. */
export function ShotGallery({ order = SCREENSHOT_ORDER }: { order?: ScreenshotKey[] }) {
  return (
    <div className="shot-gallery">
      {order.map((key) => {
        const s = SCREENSHOTS[key];
        return (
          <figure key={key} className="shot-gallery__item">
            <Image src={s.src} alt={s.alt} width={SCREENSHOT_SIZE.width} height={SCREENSHOT_SIZE.height} sizes="200px" loading="lazy" />
            <figcaption>{s.caption}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
