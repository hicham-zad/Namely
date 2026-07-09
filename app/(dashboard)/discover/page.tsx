"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCouple } from "@/hooks/useCouple";
import { useCouplePool } from "@/hooks/useCouplePool";
import type { DisplayName } from "@/hooks/useCouplePool";
import { useMatches } from "@/hooks/useMatches";
import MatchModal from "@/components/dashboard/MatchModal";
import CatalogModal from "@/components/dashboard/CatalogModal";
import LinkPartnerModal from "@/components/dashboard/LinkPartnerModal";
import GenerateNamesModal from "@/components/dashboard/GenerateNamesModal";
import UpgradeModal from "@/components/dashboard/UpgradeModal";
import { Heart, X, Undo2, ListPlus, Users, Globe, BookOpen, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DiscoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, session } = useAuth();
  const { couple, isConnected, inviteCode, partnerId, isLoading: coupleLoading, createCouple, joinCouple } = useCouple();
  const coupleId = couple?.id ?? null;

  const {
    pool, currentIndex, currentName, remaining, allSwiped,
    isLoading, isGenerating, lastSwipe,
    generateNames, recordSwipe, undoLastSwipe, addDbName,
    poolSize,
  } = useCouplePool(coupleId);

  const { newMatchName, showMatchModal, dismissMatch } = useMatches(coupleId);
  const [localMatchName, setLocalMatchName] = useState<string | null>(null);
  const [showLocalMatch, setShowLocalMatch] = useState(false);
  const [swipeAnim, setSwipeAnim] = useState<"like" | "pass" | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showLinkPartner, setShowLinkPartner] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [namesAdded, setNamesAdded] = useState(0);
  const [upgradeFeature, setUpgradeFeature] = useState<"generate" | "catalog" | "undo" | "insight" | null>(null);

  // ── AI Insights State ───────────────────────────────────────────────
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightText, setInsightText] = useState<string | null>(null);
  // Local cache so explanations persist across swipes within the same session
  const explanationCache = useRef<Map<string, string>>(new Map());

  const currentNameId = currentName?.id ?? null;

  useEffect(() => {
    // Use cached explanation (from this session) first, then fall back to what was in the pool
    const cached = currentNameId ? explanationCache.current.get(currentNameId) : null;
    setInsightText(cached || currentName?.ai_explanation || null);
    setInsightLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNameId]);

  const handleGetInsight = async () => {
    if (!profile?.is_premium) {
      setUpgradeFeature("insight");
      return;
    }
    if (!currentName || !session?.access_token) return;

    setInsightLoading(true);
    try {
      // Get the pool item source so the API knows which table to use
      const currentItem = pool[currentIndex];
      const res = await fetch("/api/names/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          nameId: currentName.id,
          name: currentName.name,
          source: currentItem?.source ?? "db",
        }),
      });
      const data = await res.json();
      if (res.ok && data.explanation) {
        // Cache locally so coming back to this card shows it immediately
        explanationCache.current.set(currentName.id, data.explanation);
        setInsightText(data.explanation);
      } else {
        setInsightText("Could not generate explanation. Try again.");
      }
    } catch (err) {
      console.error(err);
      setInsightText("Something went wrong. Try again.");
    } finally {
      setInsightLoading(false);
    }
  };

  // ── Show success toast when returning from Stripe ─────────────────
  const [showUpgradeToast, setShowUpgradeToast] = useState(false);
  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setShowUpgradeToast(true);
      setTimeout(() => setShowUpgradeToast(false), 4000);
      // Remove query param without full reload
      const url = new URL(window.location.href);
      url.searchParams.delete("upgraded");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  // ── Add name from catalog at current position ─────────────────────
  const addNameToQueue = useCallback((name: DisplayName | any) => {
    addDbName(name.id, {
      name: name.name, gender: name.gender, origin: name.origin,
      meaning: name.meaning, style_tags: name.style_tags ?? [],
      pronunciation_hint: name.pronunciation_hint,
    });
  }, [addDbName]);

  // ── Premium gate helpers ───────────────────────────────────────────
  const isPremium = !!profile?.is_premium;
  const openGenerate = () => isPremium ? setShowGenerate(true) : setUpgradeFeature("generate");
  const openCatalog  = () => setShowCatalog(true);
  const handleUndo   = () => isPremium ? undoLastSwipe()       : setUpgradeFeature("undo");

  // ── Generate names handler (passed to GenerateNamesModal) ─────────
  const handleGenerate = useCallback(async (
    gender: string | null,
    origins: string[] | null,
    aiPrefs?: { user1StyleTags: string[]; user1Origins: string[]; user2StyleTags: string[]; user2Origins: string[] }
  ) => {
    const added = await generateNames(gender, origins, aiPrefs);
    setNamesAdded(added);
  }, [generateNames]);

  // ── Keyboard shortcuts ────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" && currentName) handleVote("like");
      if (e.key === "ArrowLeft" && currentName) handleVote("pass");
      if ((e.key === "Backspace" || e.key === "z") && lastSwipe) undoLastSwipe();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentName, lastSwipe]);

  const handleVote = useCallback(async (action: "like" | "pass") => {
    if (!currentName) return;
    setSwipeAnim(action);
    setTimeout(() => setSwipeAnim(null), 280);
    const { isMatch } = await recordSwipe(currentName.id, action);
    if (isMatch) { setLocalMatchName(currentName.name); setShowLocalMatch(true); }
  }, [currentName, recordSwipe]);

  const handleDismissMatch = () => { setShowLocalMatch(false); setLocalMatchName(null); dismissMatch(); };
  const progress = poolSize > 0 ? Math.min(100, (currentIndex / poolSize) * 100) : 0;

  // Suppress bg spinner when generate modal owns the loading UI
  const showSpinner = isLoading && poolSize === 0 && !showGenerate;
  const showEmpty = poolSize === 0 && !isLoading && !showGenerate;
  const showAllSwiped = allSwiped;
  const showCards = !showSpinner && !showEmpty && !showAllSwiped;

  return (
    <div className="discover-wrap">

      {/* ── Loading ── */}
      {showSpinner && (
        <div className="discover-empty">
          <div className="dash-loading__spinner" />
          <p>Loading your name queue…</p>
        </div>
      )}

      {/* ── Empty: no names yet ── */}
      {showEmpty && (
        <div className="discover-empty">
          <ListPlus size={52} className="discover-empty__icon" style={{ color: "#FF6B8A" }} />
          <h2>Ready to discover?</h2>
          <p>Generate name suggestions tailored to both your preferences, or browse the catalog.</p>
          <div className="discover-empty__actions">
            <button className="btn btn--primary" onClick={openGenerate}>Generate Names</button>
            <button className="btn btn--secondary" onClick={openCatalog}>Browse Catalog</button>
          </div>
          {!isConnected && (
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", paddingTop: "20px", borderTop: "1px solid var(--border-lt)", width: "100%", maxWidth: 320 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text3)" }}>Link your partner to get matches</span>
              <button className="btn btn--outline btn--sm" onClick={() => setShowLinkPartner(true)}><Users size={14} /> Link Partner</button>
            </div>
          )}
        </div>
      )}

      {/* ── All swiped ── */}
      {showAllSwiped && (
        <div className="discover-empty">
          <span style={{ fontSize: "3rem", lineHeight: 1, marginBottom: 8 }}>🎉</span>
          <h2>You&apos;ve seen them all!</h2>
          <p>Generate a fresh batch of names, browse the catalog, or view the names you and your partner matched on.</p>
          <div className="discover-empty__actions">
            <button className="btn btn--primary" onClick={openGenerate}>More Names</button>
            <button className="btn btn--secondary" onClick={openCatalog}>Browse Catalog</button>
          </div>
          {isConnected && (
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text3)", fontWeight: 500 }}>Check out the names you both loved</span>
              <button className="btn btn--outline btn--sm" onClick={() => router.push("/matches")}>View Matches →</button>
            </div>
          )}
        </div>
      )}

      {/* ── Main swipe UI ── */}
      {showCards && (
        <>
          {/* Header row */}
          <div className="discover-header">
            <div>
              <h1 className="discover-header__title">Discover</h1>
              <p className="discover-header__sub">
                {remaining} of {poolSize} names left
                {isConnected ? " · Partner linked" : ""}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button className="btn btn--ghost btn--sm" onClick={openGenerate}>
                <ListPlus size={14} /> Generate
              </button>
              <button className="btn btn--ghost btn--sm" onClick={openCatalog}>
                <BookOpen size={14} /> Browse
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="discover-progress">
            <div className="discover-progress__fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Partner nudge */}
          {!isConnected && (
            <div className="discover-banner">
              <span>🔗</span>
              <div>
                <strong>Swipe with your partner</strong>
                <span>Link up so likes can become matches</span>
              </div>
              <button className="btn btn--sm" onClick={() => setShowLinkPartner(true)}>Link</button>
            </div>
          )}

          {/* Name card */}
          {currentName && (
            <div className={`discover-card ${swipeAnim === "like" ? "discover-card--like" : swipeAnim === "pass" ? "discover-card--pass" : ""}`}>
              <div className="discover-card__toprow">
                <div className="discover-card__gender" data-gender={currentName.gender}>
                  {currentName.gender === "boy" ? "♂ Boy" : currentName.gender === "girl" ? "♀ Girl" : "⚥ Unisex"}
                </div>
                <span className="discover-card__counter">
                  🏷 {currentIndex + 1} of {poolSize}
                </span>
              </div>

              <div className="discover-card__name">{currentName.name}</div>

              {currentName.pronunciation_hint && (
                <div className="discover-card__pronunciation">
                  <span>{currentName.pronunciation_hint}</span>
                </div>
              )}

              {currentName.meaning && (
                <div className="discover-card__meaning-box">
                  <div className="discover-card__meaning-label">Meaning</div>
                  <div className="discover-card__meaning">{currentName.meaning}</div>
                </div>
              )}

              <div className="discover-card__tags">
                {currentName.origin && (
                  <span className="discover-card__tag discover-card__tag--origin">
                    <Globe size={11} /> {currentName.origin}
                  </span>
                )}
                {currentName.style_tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="discover-card__tag">{tag}</span>
                ))}
              </div>

              {/* AI Insights Section */}
              <div className="discover-card__insight-wrap">
                {(!insightText && !insightLoading) ? (
                  <button className="discover-card__insight-btn" onClick={handleGetInsight}>
                    <BookOpen size={14} /> Why this name?
                  </button>
                ) : (
                  <div className="discover-card__insight-box">
                    <div className="discover-card__insight-header">
                      <BookOpen size={14} color="#FF6B8A" /> <span>About this name</span>
                    </div>
                    {insightLoading ? (
                      <div className="discover-card__insight-loading">
                        <div className="dash-loading__spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                        <span>Analyzing name...</span>
                      </div>
                    ) : (
                      <div className="discover-card__insight-text">{insightText}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="discover-actions">
            <button className="discover-btn discover-btn--pass" onClick={() => handleVote("pass")} title="Nope (←)">
              <X size={24} />
            </button>
            <button
              className="discover-btn discover-btn--undo"
              onClick={handleUndo}
              disabled={!lastSwipe}
              title={isPremium ? "Undo (Z)" : "Undo · Premium feature"}
            >
              <Undo2 size={18} />
              {!isPremium && <Sparkles size={10} style={{ position: "absolute", top: 4, right: 4, color: "#FF6B8A" }} />}
            </button>
            <button className="discover-btn discover-btn--like" onClick={() => handleVote("like")} title="Love it (→)">
              <Heart size={24} fill="white" />
            </button>
          </div>
          <p className="discover-hint">Use ← → arrow keys to vote · Z to undo</p>
        </>
      )}

      {/* ── Modals — always rendered at the root ── */}
      <MatchModal
        visible={showLocalMatch || showMatchModal}
        matchedName={localMatchName || newMatchName}
        onDismiss={handleDismissMatch}
        onViewMatches={() => { handleDismissMatch(); router.push("/matches"); }}
      />
      <CatalogModal
        isOpen={showCatalog}
        onClose={() => setShowCatalog(false)}
        existingIds={new Set(pool.map((p) => p.nameId))}
        onAddName={addNameToQueue}
        isPremium={isPremium}
        onUpgrade={() => { setShowCatalog(false); setUpgradeFeature("catalog"); }}
      />
      <LinkPartnerModal
        isOpen={showLinkPartner}
        onClose={() => setShowLinkPartner(false)}
        inviteCode={inviteCode}
        isConnected={isConnected}
        isLoading={coupleLoading}
        createCouple={createCouple}
        joinCouple={joinCouple}
      />
      <GenerateNamesModal
        isOpen={showGenerate}
        onClose={() => setShowGenerate(false)}
        myProfile={profile}
        coupleId={coupleId}
        partnerId={partnerId}
        onGenerate={handleGenerate}
        namesAdded={namesAdded}
      />
      <UpgradeModal
        isOpen={upgradeFeature !== null}
        onClose={() => setUpgradeFeature(null)}
        feature={upgradeFeature ?? "general"}
      />

      {/* Upgrade success toast */}
      {showUpgradeToast && (
        <div className="upgrade-toast">
          <Sparkles size={16} className="upgrade-toast__icon" style={{ color: "#34C759" }} />
          You&apos;re now Premium! All features unlocked. 🎉
        </div>
      )}
    </div>
  );
}
