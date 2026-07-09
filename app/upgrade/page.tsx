"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Sparkles, Zap, BookOpen, Undo2, Heart,
  CheckCircle2, ArrowRight, Crown, Loader2, X
} from "lucide-react";
import Image from "next/image";

import { Suspense } from "react";

function UpgradeContent() {
  const { user, session, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "true";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // If they land here already premium, redirect to discover
  useEffect(() => {
    if (profile?.is_premium) {
      router.replace("/discover");
    }
  }, [profile, router]);

  const handleUpgrade = async () => {
    if (!session?.access_token) {
      router.push("/login?redirect=/upgrade");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "already_premium") {
          await refreshProfile();
          router.push("/discover");
          return;
        }
        throw new Error(data.error || "Something went wrong");
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Zap size={18} />,       label: "AI Name Generation",    desc: "Personalised batches matching both your styles" },
    { icon: <BookOpen size={18} />,  label: "Full Name Catalog",     desc: "Browse & hand-pick from thousands of names" },
    { icon: <Undo2 size={18} />,     label: "Unlimited Undo",        desc: "Changed your mind? Swipe back anytime" },
    { icon: <Heart size={18} />,     label: "Unlimited Swiping",     desc: "No daily limits — swipe at your own pace" },
  ];

  return (
    <div className="upgrade-page">
      {/* Background orbs */}
      <div className="upgrade-orb upgrade-orb-1" />
      <div className="upgrade-orb upgrade-orb-2" />

      {/* Back arrow */}
      <button className="upgrade-back" onClick={() => router.back()} aria-label="Back">
        <X size={18} />
      </button>

      <div className="upgrade-content">
        {/* Badge */}
        <div className="upgrade-badge">
          <Crown size={14} />
          Premium Plan
        </div>

        {/* Hero */}
        <div className="upgrade-hero">
          <Image src="/icon.png" alt="Namely" width={72} height={72} className="upgrade-logo" />
          <h1 className="upgrade-heading">Find the perfect name, <em>together</em></h1>
          <p className="upgrade-subheading">
            Unlock all features and swipe through AI-curated names with your partner — unlimited.
          </p>
        </div>

        {/* Price card */}
        <div className="upgrade-price-card">
          <div className="upgrade-price-card__top">
            <div className="upgrade-price-card__label">Monthly Premium</div>
            <div className="upgrade-price-card__popular">Most Popular</div>
          </div>
          <div className="upgrade-price-card__price">
            <span className="upgrade-price-card__currency">$</span>
            <span className="upgrade-price-card__amount">5</span>
            <span className="upgrade-price-card__cents">.99</span>
            <span className="upgrade-price-card__period">/ month</span>
          </div>
          <p className="upgrade-price-card__note">Billed monthly · Cancel anytime</p>

          {cancelled && (
            <div className="upgrade-cancelled-notice">
              No worries — your plan wasn&apos;t changed. Upgrade whenever you&apos;re ready.
            </div>
          )}

          {error && (
            <div className="upgrade-error">
              {error}
            </div>
          )}

          <button
            id="upgrade-start-btn"
            className="upgrade-cta"
            onClick={handleUpgrade}
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 size={18} className="upgrade-cta__spin" /> Redirecting…</>
            ) : (
              <><Sparkles size={18} /> Start Premium<ArrowRight size={16} /></>
            )}
          </button>
          <p className="upgrade-cta__sub">Secure payment via Stripe · Cancel anytime</p>
        </div>

        {/* Feature list */}
        <div className="upgrade-features">
          <h2 className="upgrade-features__title">Everything in Premium</h2>
          <ul className="upgrade-feature-list">
            {features.map((f) => (
              <li key={f.label} className="upgrade-feature-item">
                <div className="upgrade-feature-item__icon">{f.icon}</div>
                <div className="upgrade-feature-item__body">
                  <strong>{f.label}</strong>
                  <span>{f.desc}</span>
                </div>
                <CheckCircle2 size={18} className="upgrade-feature-item__check" />
              </li>
            ))}
          </ul>
        </div>

        {/* Trust row */}
        <div className="upgrade-trust">
          <span>🔒 Secure checkout</span>
          <span>·</span>
          <span>💳 Powered by Stripe</span>
          <span>·</span>
          <span>❌ Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div style={{ padding: "60px", textAlign: "center" }}><Loader2 className="dash-loading__spinner" /></div>}>
      <UpgradeContent />
    </Suspense>
  );
}
