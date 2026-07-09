"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";
import { ArrowLeft, Copy, Check, Search, UserPlus, LogIn } from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────────── */
const STEPS = ["gender", "style", "origin", "partner"] as const;
type Step = (typeof STEPS)[number];

const GENDER_OPTIONS = [
  { key: "boy",  emoji: "👦", label: "Boy Names",  desc: "Looking for strong, classic boy names" },
  { key: "girl", emoji: "👧", label: "Girl Names",  desc: "Searching for beautiful girl names" },
  { key: "both", emoji: "👶", label: "Both / Surprise!", desc: "Open to all — show us everything" },
] as const;

const STYLE_OPTIONS = [
  "Classic", "Modern", "Rare", "Short", "Strong", "Soft",
  "Elegant", "Nature", "Royal", "Biblical", "Mythological", "Playful",
];

const ORIGIN_OPTIONS = [
  "🇬🇧 English", "🇫🇷 French", "🇸🇦 Arabic", "🇮🇱 Hebrew", "🏛️ Latin", "🇯🇵 Japanese",
  "🇬🇷 Greek", "🇪🇸 Spanish", "🇮🇪 Irish", "🇸🇪 Scandinavian", "🇮🇳 Indian", "🌍 African",
  "🇮🇹 Italian", "🇩🇪 German", "🇷🇺 Slavic", "🇮🇷 Persian", "🇹🇷 Turkish", "🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh",
  "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish", "🇨🇳 Chinese", "🇷🇺 Russian", "🇰🇷 Korean", "🇳🇱 Dutch", "🇵🇹 Portuguese",
  "🇸🇪 Swedish", "🇳🇴 Norwegian", "🇩🇰 Danish", "🇫🇮 Finnish", "🇻🇳 Vietnamese",
  "🇮🇩 Indonesian", "🇵🇭 Filipino", "🇳🇬 Nigerian", "🇺🇦 Ukrainian", "🇵🇱 Polish",
];

/* ─── Sub-components ─────────────────────────────────────────────── */

function StepGender({
  selected, onSelect,
}: { selected: string | null; onSelect: (v: string) => void }) {
  return (
    <div className="ob-gender-grid">
      {GENDER_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          className={`ob-gender-card${selected === opt.key ? " ob-gender-card--selected" : ""}`}
          onClick={() => onSelect(opt.key)}
          type="button"
        >
          <span className="ob-gender-card__emoji">{opt.emoji}</span>
          <div style={{ flex: 1 }}>
            <div className="ob-gender-card__label">{opt.label}</div>
            <div style={{ fontSize: "0.78rem", color: "#6B6B6B", marginTop: 2 }}>{opt.desc}</div>
          </div>
          {selected === opt.key && <span className="ob-gender-card__check">✓</span>}
        </button>
      ))}
    </div>
  );
}

function StepStyle({
  selected, onToggle,
}: { selected: string[]; onToggle: (v: string) => void }) {
  return (
    <>
      <div className="ob-chip-grid">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt}
            className={`ob-chip${selected.includes(opt.toLowerCase()) ? " ob-chip--selected" : ""}`}
            onClick={() => onToggle(opt.toLowerCase())}
            type="button"
          >
            {opt}
          </button>
        ))}
      </div>
      <p className="ob-count">
        {selected.length > 0 ? <><strong>{selected.length}</strong> selected</> : "Pick as many as you like"}
      </p>
    </>
  );
}

function StepOrigin({
  selected, onToggle,
}: { selected: string[]; onToggle: (v: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = ORIGIN_OPTIONS.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div className="ob-search-wrap">
        <Search size={16} className="ob-search-icon" />
        <input
          className="ob-search"
          placeholder="Search origins…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="ob-chips-scroll">
        <div className="ob-chip-grid">
          {filtered.map((opt) => (
            <button
              key={opt}
              className={`ob-chip${selected.includes(opt) ? " ob-chip--selected" : ""}`}
              onClick={() => onToggle(opt)}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <p className="ob-count">
        {selected.length > 0 ? <><strong>{selected.length}</strong> origin{selected.length > 1 ? "s" : ""} selected</> : "Select at least one, or skip to see all"}
      </p>
    </>
  );
}

function StepPartner({
  joinCode: prefilledCode,
  inviteCode,
  onGenerateInvite,
  onJoin,
  joining,
}: {
  joinCode: string | null;
  inviteCode: string | null;
  onGenerateInvite: () => Promise<void>;
  onJoin: (code: string) => Promise<void>;
  joining: boolean;
}) {
  const [tab, setTab] = useState<"invite" | "join">(prefilledCode ? "join" : "invite");
  const [code, setCode] = useState(prefilledCode ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (tab === "invite" && !inviteCode) {
      onGenerateInvite();
    }
  }, [tab]);

  const handleCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {prefilledCode && (
        <div className="ob-pair-invited">
          <span className="ob-pair-invited__icon">🔗</span>
          <div className="ob-pair-invited__text">
            Your partner invited you! Enter their code below to link up automatically.
          </div>
        </div>
      )}

      <div className="ob-pair-tabs">
        <button
          className={`ob-pair-tab${tab === "invite" ? " ob-pair-tab--active" : ""}`}
          onClick={() => setTab("invite")}
          type="button"
        >
          <UserPlus size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
          Get Invite Code
        </button>
        <button
          className={`ob-pair-tab${tab === "join" ? " ob-pair-tab--active" : ""}`}
          onClick={() => setTab("join")}
          type="button"
        >
          <LogIn size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
          Enter Partner's Code
        </button>
      </div>

      {tab === "invite" ? (
        <>
          <p style={{ fontSize: "0.85rem", color: "#6B6B6B", marginBottom: 14 }}>
            Share this code with your partner so they can link to your account.
          </p>
          <div className="ob-invite-code">
            {inviteCode ? (
              <>
                <span className="ob-invite-code__value">{inviteCode}</span>
                <button className={`ob-invite-code__copy${copied ? " ob-invite-code__copied" : ""}`} onClick={handleCopy} type="button" title="Copy code">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </>
            ) : (
              <span style={{ fontSize: "0.9rem", color: "#AEAEB2" }}>Generating…</span>
            )}
          </div>
          {copied && <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#34C759", marginTop: -8, marginBottom: 12 }}>Copied to clipboard!</p>}
        </>
      ) : (
        <>
          <p style={{ fontSize: "0.85rem", color: "#6B6B6B", marginBottom: 14 }}>
            Ask your partner for their 6-letter invite code.
          </p>
          <input
            className="ob-join-input"
            placeholder="Enter 6-letter code"
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
          />
          <button
            className="ob-cta"
            disabled={code.length !== 6 || joining}
            onClick={() => onJoin(code)}
            type="button"
          >
            {joining ? <span className="ob-spinner" /> : "Link Partner →"}
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Main onboarding component ─────────────────────────────────── */
function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinCode = searchParams.get("joinCode");

  const supabase = createClient();

  // State
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [gender, setGender] = useState<string | null>(null);
  const [styles, setStyles] = useState<string[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const goNext = useCallback(() => {
    setDirection("forward");
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    setError(null);
  }, []);

  const goBack = useCallback(() => {
    setDirection("back");
    setStepIndex((i) => Math.max(i - 1, 0));
    setError(null);
  }, []);

  const toggleStyle = (v: string) =>
    setStyles((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

  const toggleOrigin = (v: string) =>
    setOrigins((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

  // Generate invite code (create couple) — called when step 4 mounts on "invite" tab
  const handleGenerateInvite = useCallback(async () => {
    if (inviteCode) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if couple already exists
    const { data: existing } = await supabase
      .from("couples")
      .select("invite_code")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .single();

    if (existing?.invite_code) {
      setInviteCode(existing.invite_code);
      return;
    }

    // Generate random 6-letter code
    const code = Array.from({ length: 6 }, () =>
      "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random() * 24)]
    ).join("");

    const { error } = await supabase.from("couples").insert({
      user1_id: user.id,
      invite_code: code,
    });

    if (!error) setInviteCode(code);
  }, [inviteCode, supabase]);

  // Join couple via code
  const handleJoin = useCallback(async (code: string) => {
    setJoining(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const { data: couple, error: findErr } = await supabase
        .from("couples")
        .select("id, user1_id, user2_id")
        .eq("invite_code", code.toUpperCase())
        .single();

      if (findErr || !couple) throw new Error("Code not found — double-check and try again");
      if (couple.user1_id === user.id || couple.user2_id === user.id)
        throw new Error("You're already in this couple!");
      if (couple.user2_id && couple.user2_id !== user.id)
        throw new Error("This couple is already full");

      const { error: updateErr } = await supabase
        .from("couples")
        .update({ user2_id: user.id })
        .eq("id", couple.id);

      if (updateErr) throw new Error("Couldn't join — please try again");

      // Proceed to finish after joining
      await finishOnboarding(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setJoining(false);
    }
  }, [supabase]);

  // Save profile + finish
  const finishOnboarding = useCallback(async (partnerLinked = false) => {
    setSaving(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const { error: upsertErr } = await supabase.from("profiles").upsert({
        id: user.id,
        gender_preference: gender ?? "both",
        style_tags: styles,
        origin_filters: origins,
      });

      if (upsertErr) throw new Error(upsertErr.message);

      // If invited via joinCode but user hasn't joined yet (skipped step 4 tab)
      if (joinCode && !partnerLinked) {
        await handleJoin(joinCode);
        return; // handleJoin calls finishOnboarding again
      }

      router.push("/discover");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }, [supabase, gender, styles, origins, joinCode, router]);

  // CTA label/action per step
  const stepCTA = (() => {
    if (currentStep === "gender") return { label: "Continue", disabled: !gender, action: goNext };
    if (currentStep === "style") return { label: styles.length ? `Continue with ${styles.length} style${styles.length > 1 ? "s" : ""}` : "Continue", disabled: false, action: goNext };
    if (currentStep === "origin") return { label: origins.length ? `Start with ${origins.length} origin${origins.length > 1 ? "s" : ""}` : "Show All Names", disabled: false, action: goNext };
    if (currentStep === "partner") return { label: "Finish & Start Swiping →", disabled: saving, action: () => finishOnboarding(false) };
    return { label: "Continue", disabled: false, action: goNext };
  })();

  const stepSkip = (() => {
    if (currentStep === "style") return { label: "Skip — I'll decide later", action: () => { setStyles([]); goNext(); } };
    if (currentStep === "origin") return { label: "Skip — show all origins", action: () => { setOrigins([]); goNext(); } };
    if (currentStep === "partner") return { label: "I'll link my partner later", action: () => finishOnboarding(false) };
    return null;
  })();

  const stepMeta = {
    gender: { num: 1, title: "What are you looking for?", sub: "You can always change this later in Settings." },
    style:  { num: 2, title: "What's your name style?", sub: "Pick as many as you like — this helps curate your feed." },
    origin: { num: 3, title: "Name origins?", sub: "Filter by cultural origin, or skip to see all names." },
    partner:{ num: 4, title: "Link your partner", sub: "Swipe together and reveal matches when you both love the same name." },
  }[currentStep];

  return (
    <div className="ob-wrap" data-theme="light">
      <div className="ob-orb ob-orb-1" />
      <div className="ob-orb ob-orb-2" />

      <div className="ob-card">
        {/* Progress bar */}
        <div className="ob-progress-track">
          <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="ob-body">
          {/* Logo */}
          <div className="ob-logo-row">
            <Image src="/logo.png" alt="Namely" width={32} height={32} style={{ borderRadius: 8 }} />
            <span className="ob-logo-text">Namely</span>
          </div>

          {/* Back button */}
          {stepIndex > 0 && (
            <button className="ob-back" onClick={goBack} type="button">
              <ArrowLeft size={14} /> Back
            </button>
          )}

          {/* Step label */}
          <div className="ob-step-label">Step {stepMeta.num} of {STEPS.length}</div>

          {/* Title */}
          <h1 className="ob-title">{stepMeta.title}</h1>
          <p className="ob-subtitle">{stepMeta.sub}</p>

          {/* Step content */}
          <div className={`ob-step${direction === "back" ? " ob-step-back" : ""}`} key={currentStep}>
            {currentStep === "gender" && (
              <StepGender selected={gender} onSelect={setGender} />
            )}
            {currentStep === "style" && (
              <StepStyle selected={styles} onToggle={toggleStyle} />
            )}
            {currentStep === "origin" && (
              <StepOrigin selected={origins} onToggle={toggleOrigin} />
            )}
            {currentStep === "partner" && (
              <StepPartner
                joinCode={joinCode}
                inviteCode={inviteCode}
                onGenerateInvite={handleGenerateInvite}
                onJoin={handleJoin}
                joining={joining}
              />
            )}
          </div>

          {/* Footer — only show primary CTA for non-partner step, or always for partner */}
          {currentStep !== "partner" && (
            <div className="ob-footer">
              <button
                className="ob-cta"
                disabled={stepCTA.disabled || saving}
                onClick={stepCTA.action}
                type="button"
              >
                {saving ? <span className="ob-spinner" /> : stepCTA.label}
              </button>
              {stepSkip && (
                <button className="ob-skip" onClick={stepSkip.action} type="button">
                  {stepSkip.label}
                </button>
              )}
            </div>
          )}

          {/* Partner step footer — only "finish" and "skip" */}
          {currentStep === "partner" && (
            <div className="ob-footer" style={{ marginTop: 20 }}>
              <button
                className="ob-cta"
                disabled={saving}
                onClick={() => finishOnboarding(false)}
                type="button"
              >
                {saving ? <span className="ob-spinner" /> : "Finish & Start Swiping →"}
              </button>
              <button className="ob-skip" onClick={() => finishOnboarding(false)} type="button">
                I&apos;ll link my partner later
              </button>
            </div>
          )}

          {error && <p className="ob-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="ob-wrap" data-theme="light">
        <div className="ob-card" style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="ob-spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
