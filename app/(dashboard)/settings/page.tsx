"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCouple } from "@/hooks/useCouple";
import InviteCode from "@/components/dashboard/InviteCode";
import ChipSelector from "@/components/dashboard/ChipSelector";
import UpgradeModal from "@/components/dashboard/UpgradeModal";
import { Settings as SettingsIcon, Users, Palette, Globe, User, LogOut, Trash2, Link as LinkIcon, ChevronRight, Crown, Sparkles, Loader2, CreditCard } from "lucide-react";
import { useCallback, useState } from "react";

const STYLE_OPTIONS = ["Classic", "Modern", "Rare", "Short", "Strong", "Soft", "Elegant", "Nature", "Royal", "Biblical", "Mythological"];
const ORIGIN_OPTIONS = ["English", "French", "Arabic", "Hebrew", "Latin", "Japanese", "Greek", "Spanish", "Irish", "Scandinavian", "Indian", "African", "Italian", "German", "Slavic", "Persian", "Turkish", "Welsh", "Chinese", "Korean"];
const GENDER_OPTIONS = [
  { key: "boy", label: "Boy Names", emoji: "👶🏻", color: "#E3EDF7" },
  { key: "girl", label: "Girl Names", emoji: "👶🏽", color: "#F7E3EE" },
  { key: "both", label: "Both", emoji: "✨", color: "#ebf5fe" },
] as const;

export default function SettingsPage() {
  const { user, profile, updateProfile, signOut, deleteAccount, session } = useAuth();
  const { couple, isConnected, inviteCode, createCouple, joinCouple, leaveCouple } = useCouple();

  const [activeModal, setActiveModal] = useState<"gender" | "style" | "origins" | null>(null);
  const [showUpgrade, setShowUpgrade] = useState<"general" | "filters" | null>(null);
  const [draftGender, setDraftGender] = useState(profile?.gender_preference ?? "both");
  const [draftStyle, setDraftStyle] = useState<string[]>((profile?.style_tags ?? []).map((s) => s.charAt(0).toUpperCase() + s.slice(1)));
  const [draftOrigins, setDraftOrigins] = useState<string[]>(profile?.origin_filters ?? []);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);

  const openModal = (type: "gender" | "style" | "origins") => {
    if (type === "gender") setDraftGender(profile?.gender_preference ?? "both");
    if (type === "style") setDraftStyle((profile?.style_tags ?? []).map((s) => s.charAt(0).toUpperCase() + s.slice(1)));
    if (type === "origins") setDraftOrigins(profile?.origin_filters ?? []);
    setActiveModal(type);
  };

  const saveGender = () => { updateProfile({ gender_preference: draftGender as any }); setActiveModal(null); };
  const saveStyle = () => { updateProfile({ style_tags: draftStyle.map((s) => s.toLowerCase()) }); setActiveModal(null); };
  const saveOrigins = () => { updateProfile({ origin_filters: draftOrigins }); setActiveModal(null); };

  const handleCreateCouple = async () => { try { await createCouple(); } catch {} };
  const handleJoin = async () => {
    if (joinCode.length < 6) return;
    const { success, error } = await joinCouple(joinCode);
    if (!success) setJoinError(error ?? "Failed");
    else setJoinCode("");
  };
  const handleUnlink = async () => {
    if (confirm(isConnected ? "Unlink your partner? You will lose mutual matches." : "Cancel this invite code?")) {
      await leaveCouple();
    }
  };
  const handleSignOut = () => { if (confirm("Sign out?")) signOut(); };
  const handleDelete = async () => {
    if (!confirm("Delete your account? This cannot be undone.")) return;
    if (!confirm("Are you absolutely sure? All data will be lost forever.")) return;
    setIsDeleting(true);
    await deleteAccount();
    setIsDeleting(false);
  };

  // ── Stripe billing portal ──────────────────────────────────────────
  const handleManageBilling = async () => {
    if (!session?.access_token) return;
    setIsBillingLoading(true);
    setBillingError(null);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not open billing portal");
      window.location.href = data.url;
    } catch (err: any) {
      setBillingError(err.message);
      setIsBillingLoading(false);
    }
  };

  const genderLabel = GENDER_OPTIONS.find((o) => o.key === (profile?.gender_preference ?? "both"))?.label ?? "Both";
  const styleLabel = profile?.style_tags?.length ? `${profile.style_tags.length} styles` : "None";
  const originsLabel = profile?.origin_filters?.length ? `${profile.origin_filters.length} origins` : "All";

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* Partner Section */}
      <section className="settings-section">
        <h2 className="settings-section__title"><Users size={16} /> Partner</h2>
        <div className="settings-card">
          {inviteCode ? (
            <>
              <InviteCode code={inviteCode} isConnected={isConnected} />
              <button className="settings-row settings-row--danger" onClick={handleUnlink}>
                <span>{isConnected ? "Unlink Partner" : "Cancel Invite"}</span>
                <ChevronRight size={16} />
              </button>
            </>
          ) : (
            <div className="settings-partner-setup">
              <p>Link with your partner to match names together.</p>
              <button className="btn btn--primary" onClick={handleCreateCouple}>
                <LinkIcon size={16} /> Generate Invite Code
              </button>
              <div className="settings-divider"><span>or enter a code</span></div>
              <div className="settings-join-row">
                <input type="text" placeholder="A1B2C3" value={joinCode} onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(null); }} maxLength={6} className="settings-join-input" />
                <button className="btn btn--sm" onClick={handleJoin} disabled={joinCode.length < 6}>Join</button>
              </div>
              {joinError && <p className="settings-error">{joinError}</p>}
            </div>
          )}
        </div>
      </section>

      {/* Preferences */}
      <section className="settings-section">
        <h2 className="settings-section__title"><Palette size={16} /> Preferences</h2>
        <div className="settings-card">
          <button className="settings-row" onClick={() => openModal("gender")}>
            <span>Gender</span><span className="text-muted">{genderLabel}</span><ChevronRight size={16} />
          </button>
          <button className="settings-row" onClick={() => openModal("style")}>
            <span>Style</span><span className="text-muted">{styleLabel}</span><ChevronRight size={16} />
          </button>
          <button className="settings-row" onClick={() => openModal("origins")}>
            <span>Origins</span><span className="text-muted">{originsLabel}</span><ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Account */}
      <section className="settings-section">
        <h2 className="settings-section__title"><User size={16} /> Account</h2>
        <div className="settings-card">
          <div className="settings-row"><span>Email</span><span className="text-muted">{user?.email ?? "—"}</span></div>
        </div>
      </section>

      {/* Subscription */}
      <section className="settings-section">
        <h2 className="settings-section__title"><Crown size={16} /> Subscription</h2>
        <div className="settings-card">
          {profile?.is_premium ? (
            <>
              <div className="settings-row">
                <span>Plan</span>
                <span className="premium-badge"><Sparkles size={10} /> Premium</span>
              </div>
              {billingError && (
                <div style={{ padding: "8px 16px", fontSize: "0.8rem", color: "var(--error)" }}>{billingError}</div>
              )}
              <button className="settings-row" onClick={handleManageBilling} disabled={isBillingLoading}>
                <CreditCard size={16} />
                <span>{isBillingLoading ? "Opening billing…" : "Manage Billing"}</span>
                {isBillingLoading ? <Loader2 size={14} className="spin" /> : <ChevronRight size={16} />}
              </button>
            </>
          ) : (
            <div className="settings-partner-setup">
              <p style={{ fontSize: "0.875rem", color: "var(--text2)" }}>
                You&apos;re on the <strong>Free plan</strong>. Upgrade to unlock AI name generation, the full catalog, and unlimited undo.
              </p>
              <button
                className="btn btn--primary"
                onClick={() => setShowUpgrade("general")}
                id="settings-upgrade-btn"
              >
                <Sparkles size={16} /> Upgrade to Premium
              </button>
              <p style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: "8px" }}>$5.99/month · Cancel anytime</p>
            </div>
          )}
        </div>
      </section>

      {/* Danger zone */}
      <section className="settings-section">
        <div className="settings-card">
          <button className="settings-row settings-row--danger" onClick={handleSignOut}><LogOut size={16} /><span>Sign Out</span></button>
          <button className="settings-row settings-row--danger" onClick={handleDelete} disabled={isDeleting}><Trash2 size={16} /><span>{isDeleting ? "Deleting…" : "Delete Account"}</span></button>
        </div>
      </section>

      {/* Modals */}
      <UpgradeModal isOpen={showUpgrade !== null} onClose={() => setShowUpgrade(null)} feature={showUpgrade ?? "general"} />
      {activeModal && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{activeModal === "gender" ? "Gender Preference" : activeModal === "style" ? "Name Style" : "Origins"}</h3>
              <button onClick={() => setActiveModal(null)} className="modal__close">✕</button>
            </div>
            <div className="modal__body">
              {activeModal === "gender" && (
                <div className="gender-options">
                  {GENDER_OPTIONS.map((opt) => (
                    <button key={opt.key} className={`gender-card ${draftGender === opt.key ? "gender-card--selected" : ""}`} style={{ backgroundColor: opt.color }} onClick={() => setDraftGender(opt.key)}>
                      <span className="gender-card__emoji">{opt.emoji}</span>
                      <span>{opt.label}</span>
                      {draftGender === opt.key && <span className="gender-card__check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
              {activeModal === "style" && <ChipSelector options={STYLE_OPTIONS} selected={draftStyle} onToggle={(t) => setDraftStyle((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])} />}
              {activeModal === "origins" && <ChipSelector options={ORIGIN_OPTIONS} selected={draftOrigins} onToggle={(o) => setDraftOrigins((p) => p.includes(o) ? p.filter((x) => x !== o) : [...p, o])} />}
            </div>
            <div className="modal__footer">
              <button className="btn btn--primary" onClick={activeModal === "gender" ? saveGender : activeModal === "style" ? saveStyle : saveOrigins}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
