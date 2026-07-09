"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, ListPlus, User, Users, CheckCircle, Loader2 } from "lucide-react";
import type { NameEntry } from "@/hooks/useSwipes";
import type { UserProfile } from "@/hooks/useAuth";

const LOADING_MESSAGES = [
  { title: "Asking the AI…", sub: "Crafting the perfect prompt for your preferences" },
  { title: "Combining your styles…", sub: "Blending both partners' taste into one list" },
  { title: "Finding unique names…", sub: "Searching for names that feel just right" },
  { title: "Almost there…", sub: "Putting the finishing touches on your list" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  myProfile: UserProfile | null;
  coupleId: string | null;
  partnerId: string | null;
  onGenerate: (
    gender: string | null,
    origins: string[] | null,
    aiPrefs?: { user1StyleTags: string[]; user1Origins: string[]; user2StyleTags: string[]; user2Origins: string[] }
  ) => Promise<void>;
  namesAdded: number;
}

type State = "idle" | "loading" | "done" | "error";

const GENDER_LABEL: Record<string, string> = { boy: "👦 Boy", girl: "👧 Girl", both: "⚥ Both" };
const GENDER_COLOR: Record<string, string> = { boy: "#3b82f6", girl: "#ec4899", both: "#8b5cf6" };

function PrefCard({ title, profile, isYou, isLoading }: { title: string; profile: UserProfile | null; isYou: boolean; isLoading?: boolean }) {
  if (isLoading) return (
    <div className="gen-modal__pref-card gen-modal__pref-card--empty">
      <div className="gen-modal__pref-card-icon"><Users size={18} /></div>
      <p className="gen-modal__pref-label">{title}</p>
      <p className="gen-modal__pref-empty" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading…
      </p>
    </div>
  );
  if (!profile) return (
    <div className="gen-modal__pref-card gen-modal__pref-card--empty">
      <div className="gen-modal__pref-card-icon"><Users size={18} /></div>
      <p className="gen-modal__pref-label">{title}</p>
      <p className="gen-modal__pref-empty">Partner preferences will show here after linking.</p>
    </div>
  );

  const genderPref = profile.gender_preference ?? "both";
  const origins = profile.origin_filters ?? [];
  const styles = profile.style_tags ?? [];

  return (
    <div className="gen-modal__pref-card">
      <div className="gen-modal__pref-card-header">
        <div className="gen-modal__pref-card-icon" style={{ background: isYou ? "rgba(255,107,138,0.12)" : "rgba(74,133,200,0.12)", color: isYou ? "#FF6B8A" : "#4A85C8" }}>
          <User size={18} />
        </div>
        <span className="gen-modal__pref-label">{title}</span>
      </div>

      <div className="gen-modal__pref-row">
        <span className="gen-modal__pref-key">Gender</span>
        <span className="gen-modal__pref-badge" style={{ background: GENDER_COLOR[genderPref] + "22", color: GENDER_COLOR[genderPref] }}>
          {GENDER_LABEL[genderPref] ?? genderPref}
        </span>
      </div>

      {origins.length > 0 && (
        <div className="gen-modal__pref-row">
          <span className="gen-modal__pref-key">Origins</span>
          <div className="gen-modal__pref-chips">
            {origins.slice(0, 4).map(o => <span key={o} className="gen-modal__chip">{o}</span>)}
            {origins.length > 4 && <span className="gen-modal__chip">+{origins.length - 4}</span>}
          </div>
        </div>
      )}

      {styles.length > 0 && (
        <div className="gen-modal__pref-row">
          <span className="gen-modal__pref-key">Style</span>
          <div className="gen-modal__pref-chips">
            {styles.slice(0, 3).map(s => <span key={s} className="gen-modal__chip">{s}</span>)}
            {styles.length > 3 && <span className="gen-modal__chip">+{styles.length - 3}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// Tiny inline confetti
function Confetti() {
  const colors = ["#FF6B8A", "#FF6BAE", "#4A85C8", "#FFD700", "#34C759", "#9b59b6"];
  const pieces = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div className="gen-confetti" aria-hidden>
      {pieces.map(i => (
        <div
          key={i}
          className="gen-confetti__piece"
          style={{
            background: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.4}s`,
            animationDuration: `${0.8 + Math.random() * 0.6}s`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

export default function GenerateNamesModal({ isOpen, onClose, myProfile, coupleId, partnerId, onGenerate, namesAdded }: Props) {
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [count, setCount] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const generatingRef = useRef(false);

  // Load partner profile via secure API route (bypasses RLS)
  useEffect(() => {
    if (!isOpen || !partnerId) { setPartnerProfile(null); setPartnerLoading(false); return; }
    setPartnerLoading(true);
    fetch(`/api/partner-profile?partnerId=${partnerId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setPartnerProfile(data ?? null); setPartnerLoading(false); })
      .catch(() => { setPartnerProfile(null); setPartnerLoading(false); });
  }, [isOpen, partnerId]);

  // Advance loading messages every 3s — stop at the last one
  useEffect(() => {
    if (state !== "loading") { setMsgIdx(0); return; }
    const t = setInterval(() => setMsgIdx(i => Math.min(i + 1, LOADING_MESSAGES.length - 1)), 3000);
    return () => clearInterval(t);
  }, [state]);

  // Reset when closed (but don't interrupt in-flight generation)
  useEffect(() => {
    if (!isOpen) {
      // If generation is in progress, let the hook finish silently
      if (!generatingRef.current) {
        setState("idle"); setCount(0); setErrorMsg("");
      }
    }
  }, [isOpen]);

  // Compute merged preferences
  const getMergedPrefs = useCallback((): { gender: string | null; origins: string[] | null } => {
    const myGender = myProfile?.gender_preference ?? "both";
    const partnerGender = partnerProfile?.gender_preference ?? "both";

    // Merge gender: if both want the same specific gender, use it. Otherwise null (both).
    let gender: string | null = null;
    if (myGender !== "both" && partnerGender !== "both" && myGender === partnerGender) {
      gender = myGender;
    } else if (myGender !== "both" && partnerGender === "both") {
      gender = myGender;
    } else if (partnerGender !== "both" && myGender === "both") {
      gender = partnerGender;
    }
    // if both have specific but DIFFERENT genders — show all (null)

    // Merge origins: union of both sets (or null if both empty)
    const myOrigins = myProfile?.origin_filters ?? [];
    const partnerOrigins = partnerProfile?.origin_filters ?? [];
    const allOrigins = [...new Set([...myOrigins, ...partnerOrigins])];
    const origins = allOrigins.length > 0 ? allOrigins : null;

    return { gender, origins };
  }, [myProfile, partnerProfile]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setState("loading");
    setMsgIdx(0);
    setErrorMsg("");
    generatingRef.current = true;
    try {
      const { gender, origins } = getMergedPrefs();
      await onGenerate(gender, origins, {
        user1StyleTags: myProfile?.style_tags ?? [],
        user1Origins: myProfile?.origin_filters ?? [],
        user2StyleTags: partnerProfile?.style_tags ?? [],
        user2Origins: partnerProfile?.origin_filters ?? [],
      });
      generatingRef.current = false;
      setState("done");
    } catch (e: any) {
      generatingRef.current = false;
      setState("error");
      setErrorMsg(e?.message ?? "Something went wrong");
    }
  };

  // Handle close: if generating, let it run in bg and close modal
  const handleClose = () => {
    if (state === "loading") {
      // Generation continues in useSwipes hook — just close modal
      generatingRef.current = false;
      setState("idle");
    }
    onClose();
  };

  return (
    <div className="catalog-backdrop" onClick={handleClose}>
      <div className="gen-modal" onClick={e => e.stopPropagation()}>
        {state === "done" && <Confetti />}

        {/* Header */}
        <div className="gen-modal__header">
          <div className="gen-modal__header-icon">
            <ListPlus size={20} />
          </div>
          <div>
            <h2 className="gen-modal__title">Generate Names</h2>
            <p className="gen-modal__subtitle">Generate names based on both your preferences</p>
          </div>
          <button className="catalog-close" style={{ position: "absolute", top: 16, right: 16 }} onClick={handleClose}><X size={18} /></button>
        </div>

        {/* Success state */}
        {state === "done" ? (
          <div className="gen-modal__success">
            <CheckCircle size={48} className="gen-modal__success-icon" />
            <h3>Names ready! 🎉</h3>
            <p><strong>{namesAdded}</strong> names added to your queue.</p>
            <p className="gen-modal__success-hint">Start swiping to vote on them.</p>
            <button className="btn btn--primary" onClick={onClose}>Start Swiping →</button>
          </div>
        ) : state === "loading" ? (
          <div className="gen-modal__loading">
            <div className="gen-modal__loading-orb" />
            <Loader2 size={36} className="gen-modal__spin" />
            <h3 key={LOADING_MESSAGES[msgIdx].title} style={{ animation: "fadeUp 0.4s ease" }}>
              {LOADING_MESSAGES[msgIdx].title}
            </h3>
            <p key={LOADING_MESSAGES[msgIdx].sub} style={{ animation: "fadeUp 0.4s ease" }}>
              {LOADING_MESSAGES[msgIdx].sub}
            </p>
            <div className="gen-modal__loading-dots">
              <span /><span /><span />
            </div>
          </div>
        ) : (
          <>
            {/* Pref cards */}
            <div className="gen-modal__prefs">
              <PrefCard title="Your preferences" profile={myProfile} isYou={true} />
              <PrefCard title="Partner's preferences" profile={partnerId ? partnerProfile : null} isLoading={!!partnerId && partnerLoading} isYou={false} />
            </div>

            {/* Merge summary */}
            {(() => {
              const { gender, origins } = getMergedPrefs();
              return (
                <div className="gen-modal__merge">
                  <span className="gen-modal__merge-label">✨ Will generate</span>
                  <span className="gen-modal__merge-desc">
                    {gender ? GENDER_LABEL[gender] : "All genders"} names
                    {origins?.length ? ` · ${origins.slice(0, 3).join(", ")}${origins.length > 3 ? ` +${origins.length - 3}` : ""} origins` : ""}
                  </span>
                </div>
              );
            })()}

            {state === "error" && (
              <p className="gen-modal__error">{errorMsg}</p>
            )}

            <button className="btn btn--primary gen-modal__cta" onClick={handleGenerate}>
              <ListPlus size={16} /> Generate Names
            </button>
          </>
        )}
      </div>
    </div>
  );
}
