"use client";

import { useState } from "react";
import { X, Link as LinkIcon, Copy, Check, Users, Loader2, Link2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Passed from parent — no second useCouple() subscription
  inviteCode: string | null;
  isConnected: boolean;
  isLoading: boolean;
  createCouple: () => Promise<string>;
  joinCouple: (code: string) => Promise<{ success: boolean; error?: string }>;
}

export default function LinkPartnerModal({
  isOpen, onClose,
  inviteCode, isConnected, isLoading,
  createCouple, joinCouple,
}: Props) {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleGenerateCode = async () => {
    try { await createCouple(); } catch {}
  };

  const handleJoin = async () => {
    if (joinCode.length < 6) return;
    setJoinError(null);
    const { success, error } = await joinCouple(joinCode);
    if (success) { setJoinSuccess(true); setTimeout(onClose, 1500); }
    else setJoinError(error ?? "Invalid code");
  };

  const handleCopy = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    if (!inviteCode) return;
    const link = `${window.location.origin}/join/${inviteCode}`;
    await navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="catalog-backdrop" onClick={onClose}>
      <div className="link-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="link-modal__header">
          <div className="link-modal__icon-wrap">
            <Users size={22} />
          </div>
          <div>
            <h2 className="link-modal__title">Link with Partner</h2>
            <p className="link-modal__subtitle">Swipe together and match names</p>
          </div>
          <button className="catalog-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Already connected */}
        {isConnected ? (
          <div className="link-modal__body">
            <div className="link-modal__connected">
              <div className="link-modal__connected-icon">💑</div>
              <h3>Partner Connected!</h3>
              <p>You&apos;re all set. Swipe names and match with your partner.</p>
              <button className="btn btn--primary" onClick={onClose}>Start Swiping →</button>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="link-modal__tabs">
              <button
                className={`link-modal__tab ${tab === "create" ? "link-modal__tab--active" : ""}`}
                onClick={() => setTab("create")}
              >
                Create Invite
              </button>
              <button
                className={`link-modal__tab ${tab === "join" ? "link-modal__tab--active" : ""}`}
                onClick={() => setTab("join")}
              >
                Join with Code
              </button>
            </div>

            <div className="link-modal__body">
              {/* CREATE TAB */}
              {tab === "create" && (
                <div className="link-modal__create">
                  {inviteCode ? (
                    <>
                      <p className="link-modal__hint">Share this code with your partner:</p>
                      <div className="link-modal__code-display">
                        <span className="link-modal__code">{inviteCode}</span>
                        <button className="link-modal__copy-btn" onClick={handleCopy} title="Copy code">
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      {/* Share link row */}
                      <button className="link-modal__share-link" onClick={handleCopyLink}>
                        {copiedLink ? <Check size={14} /> : <Link2 size={14} />}
                        {copiedLink ? "Link copied!" : "Copy invite link"}
                      </button>
                      <p className="link-modal__waiting">
                        <span className="link-modal__pulse" />
                        Waiting for partner to join…
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="link-modal__hint">Generate a unique 6-character code and share it with your partner.</p>
                      <button className="btn btn--primary" onClick={handleGenerateCode} disabled={isLoading}>
                        {isLoading ? <Loader2 size={16} className="spin" /> : <LinkIcon size={16} />}
                        Generate Invite Code
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* JOIN TAB */}
              {tab === "join" && (
                <div className="link-modal__join">
                  <p className="link-modal__hint">Enter the 6-character code your partner shared with you:</p>
                  {joinSuccess ? (
                    <div className="link-modal__connected">
                      <div className="link-modal__connected-icon">🎉</div>
                      <h3>Connected!</h3>
                      <p>Closing…</p>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="A1B2C3"
                        value={joinCode}
                        onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(null); }}
                        maxLength={6}
                        className="link-modal__code-input"
                        autoComplete="off"
                      />
                      {joinError && <p className="link-modal__error">{joinError}</p>}
                      <button
                        className="btn btn--primary"
                        onClick={handleJoin}
                        disabled={joinCode.length < 6 || isLoading}
                      >
                        {isLoading ? <Loader2 size={16} className="spin" /> : null}
                        Join Partner
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
