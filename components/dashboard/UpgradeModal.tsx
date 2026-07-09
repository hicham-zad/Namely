"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { X, Check, Loader2 } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: "generate" | "catalog" | "undo" | "filters" | "general" | "insight";
}

const BENEFITS = [
  { text: "AI curates names matching both your tastes" },
  { text: "Browse the full catalog of 10,000+ unique names" },
  { text: "Unlimited swiping with no daily limits" },
  { text: "Undo any swipe — no regrets" },
  { text: "Real-time syncing and match notifications" },
];

export default function UpgradeModal({ isOpen, onClose, feature = "general" }: UpgradeModalProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const featureText = {
    general: "Your partner is waiting. Upgrade and start matching today.",
    generate: "Unlock AI Name Generation and find the perfect match instantly.",
    catalog: "Get full access to browse and hand-pick from 10,000+ names.",
    undo: "Upgrade to undo your swipe and unlock all premium features.",
    filters: "Unlock Advanced Filters to find exactly the names you want.",
    insight: "Unlock AI Name Insights to get deep dives on every name.",
  }[feature];

  const handleUpgrade = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="umodal-backdrop" onClick={onClose}>
      <div className="umodal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">

        {/* Close */}
        <button className="umodal-close" onClick={onClose} aria-label="Close">
          <X size={15} />
        </button>

        {/* Header */}
        <div className="umodal-header">
          <div className="umodal-eyebrow">Namely Premium</div>
          <h2 className="umodal-title">Name your baby together,<br />without limits.</h2>
          <p className="umodal-sub">{featureText}</p>
        </div>

        {/* Benefits */}
        <ul className="umodal-benefits">
          {BENEFITS.map((b) => (
            <li key={b.text}>
              <span className="umodal-check"><Check size={13} strokeWidth={3} /></span>
              {b.text}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="umodal-pricing">
          <div className="umodal-price">
            <span className="umodal-price__amount">$5.99</span>
            <span className="umodal-price__period">/ month</span>
          </div>

          {error && <p className="umodal-error">{error}</p>}

          <button
            id="upgrade-modal-cta"
            className="umodal-cta"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading
              ? <><Loader2 size={16} className="umodal-spin" /> Redirecting…</>
              : "Upgrade to Premium"}
          </button>

          <p className="umodal-fine">Cancel anytime · Secure payment via Stripe</p>
        </div>
      </div>
    </div>
  );
}
