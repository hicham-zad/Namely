"use client";

import { useCouple } from "@/hooks/useCouple";
import { useMatches } from "@/hooks/useMatches";
import MatchModal from "@/components/dashboard/MatchModal";
import LinkPartnerModal from "@/components/dashboard/LinkPartnerModal";
import { HeartHandshake, Star, Archive, Users, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
  const router = useRouter();
  const { couple, isConnected, inviteCode, isLoading: coupleLoading, createCouple, joinCouple } = useCouple();
  const coupleId = couple?.id ?? null;
  const { matches, isLoading, newMatchName, showMatchModal, fetchMatches, toggleStar, toggleArchive, dismissMatch } = useMatches(coupleId);
  const [showArchived, setShowArchived] = useState(false);
  const [showLinkPartner, setShowLinkPartner] = useState(false);

  useEffect(() => { if (coupleId) fetchMatches(); }, [coupleId]);

  const visibleMatches = matches.filter((m) => showArchived ? m.archived : !m.archived);
  const starredCount = matches.filter((m) => m.starred).length;
  const genderLabel = (g: string) => g === "boy" ? "♂ Boy" : g === "girl" ? "♀ Girl" : "⚥ Unisex";

  if (!isConnected) {
    return (
      <div className="matches-page">
        <div className="likes-page__empty">
          <Users size={40} className="text-muted" />
          <h2>Link with your partner</h2>
          <p>Matches appear when you both like the same name. Link up to get started.</p>
          <button className="btn btn--primary" onClick={() => setShowLinkPartner(true)}>
            <Users size={16} /> Link Partner
          </button>
        </div>
        <LinkPartnerModal
          isOpen={showLinkPartner}
          onClose={() => setShowLinkPartner(false)}
          inviteCode={inviteCode}
          isConnected={isConnected}
          isLoading={coupleLoading}
          createCouple={createCouple}
          joinCouple={joinCouple}
        />
      </div>
    );
  }

  return (
    <div className="matches-page">
      <div className="likes-page__header">
        <div>
          <h1>Matches</h1>
          <p className="text-muted">
            {matches.filter((m) => !m.archived).length} match{matches.filter((m) => !m.archived).length !== 1 ? "es" : ""}
            {starredCount > 0 && ` · ${starredCount} starred`}
          </p>
        </div>
        <button
          className={`chip ${showArchived ? "chip--selected" : ""}`}
          onClick={() => setShowArchived(!showArchived)}
        >
          <Archive size={13} /> {showArchived ? "Show Active" : "Archived"}
        </button>
      </div>

      {isLoading ? (
        <div className="likes-page__loading"><div className="dash-loading__spinner" /></div>
      ) : visibleMatches.length === 0 ? (
        <div className="likes-page__empty">
          <HeartHandshake size={40} className="text-muted" />
          <h2>{showArchived ? "Nothing archived" : "No matches yet"}</h2>
          <p>{showArchived ? "Archived matches will appear here." : "Keep swiping — a match happens when you both like the same name!"}</p>
          {!showArchived && (
            <button className="btn btn--primary" onClick={() => router.push("/discover")}>Start Swiping</button>
          )}
        </div>
      ) : (
        <div className="name-grid">
          {visibleMatches.map((match) => (
            <div key={match.id} className={`name-tile name-tile--match ${match.starred ? "name-tile--starred" : ""}`}>
              <div className="name-tile__header">
                <span className="name-tile__gender" data-gender={match.name.gender}>
                  {genderLabel(match.name.gender)}
                </span>
                <span className="name-tile__match-badge">✓ Match</span>
                <div className="name-tile__actions">
                  <button
                    className={`name-tile__action ${match.starred ? "name-tile__action--starred" : ""}`}
                    onClick={() => toggleStar(match.name_id)}
                    title={match.starred ? "Unstar" : "Star"}
                  >
                    <Star size={15} fill={match.starred ? "#FFD700" : "none"} />
                  </button>
                  <button
                    className="name-tile__action"
                    onClick={() => toggleArchive(match.name_id)}
                    title={match.archived ? "Unarchive" : "Archive"}
                  >
                    <Archive size={13} />
                  </button>
                </div>
              </div>
              <div className="name-tile__name">{match.name.name}</div>
              {match.name.meaning && <p className="name-tile__meaning">{match.name.meaning}</p>}
              <div className="name-tile__tags">
                {match.name.origin && (
                  <span className="name-tile__tag name-tile__tag--origin">
                    <Globe size={10} /> {match.name.origin}
                  </span>
                )}
              </div>
              {match.starred && (
                <div className="name-tile__starred-badge">⭐ Favourite</div>
              )}
            </div>
          ))}
        </div>
      )}

      <MatchModal
        visible={showMatchModal}
        matchedName={newMatchName}
        onDismiss={dismissMatch}
        onViewMatches={dismissMatch}
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
    </div>
  );
}
