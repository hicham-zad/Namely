import { IOS_APP_URL, ANDROID_APP_URL } from "@/lib/app-links";

export function AppleIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.73c-.02-2.3 1.88-3.41 1.97-3.46-1.07-1.57-2.74-1.78-3.33-1.8-1.42-.14-2.77.83-3.49.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.16 9.21.77 1.11 1.68 2.36 2.88 2.31 1.16-.05 1.59-.75 2.99-.75 1.39 0 1.79.75 3.01.72 1.24-.02 2.03-1.13 2.79-2.25.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.42-.93-2.45-3.71ZM14.08 5.98c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.1 1.77-.97 2.83 1.03.08 2.07-.52 2.71-1.29Z" />
    </svg>
  );
}

export function GooglePlayIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.6 1.8c-.3.3-.5.8-.5 1.4v17.6c0 .6.2 1.1.5 1.4l.1.1 9.9-9.9v-.2L3.7 1.7l-.1.1Z" fill="#00D7FE" />
      <path d="m16.9 15.7-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2h-.1Z" fill="#FFCE00" />
      <path d="m17 15.6-3.4-3.4L3.6 22.2c.4.4 1 .4 1.7.1L17 15.6Z" fill="#FF3A44" />
      <path d="M17 8.8 5.3 2.1c-.7-.4-1.3-.3-1.7.1l10 10L17 8.8Z" fill="#00F076" />
    </svg>
  );
}

type Variant = "default" | "light" | "compact";

interface StoreButtonsProps {
  /** Prefix used to build unique element IDs, e.g. "hero" → "hero-ios-btn" */
  idPrefix: string;
  variant?: Variant;
  align?: "start" | "center";
  className?: string;
}

/**
 * Official-style "Download on the App Store" / "Get it on Google Play" buttons.
 * `compact` renders small pill buttons used in the site header.
 */
export default function StoreButtons({ idPrefix, variant = "default", align = "start", className = "" }: StoreButtonsProps) {
  if (variant === "compact") {
    return (
      <div className={`store-btns store-btns--compact ${className}`}>
        <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer" id={`${idPrefix}-ios-btn`} className="store-pill" aria-label="Download Namely for iPhone on the App Store">
          <AppleIcon size={16} />
          <span className="store-pill__label">iOS</span>
        </a>
        <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer" id={`${idPrefix}-android-btn`} className="store-pill" aria-label="Get Namely for Android on Google Play">
          <GooglePlayIcon size={15} />
          <span className="store-pill__label">Android</span>
        </a>
      </div>
    );
  }

  return (
    <div className={`store-btns store-btns--${variant} ${align === "center" ? "store-btns--center" : ""} ${className}`}>
      <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer" id={`${idPrefix}-ios-btn`} className="store-btn" aria-label="Download Namely on the App Store for iPhone and iPad">
        <span className="store-btn__icon"><AppleIcon size={26} /></span>
        <span className="store-btn__text">
          <span className="store-btn__small">Download on the</span>
          <span className="store-btn__big">App Store</span>
        </span>
      </a>
      <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer" id={`${idPrefix}-android-btn`} className="store-btn" aria-label="Get Namely on Google Play for Android">
        <span className="store-btn__icon"><GooglePlayIcon size={24} /></span>
        <span className="store-btn__text">
          <span className="store-btn__small">Get it on</span>
          <span className="store-btn__big">Google Play</span>
        </span>
      </a>
    </div>
  );
}
