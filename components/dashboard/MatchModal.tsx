"use client";

import { Heart, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";

interface MatchModalProps {
  visible: boolean;
  matchedName: string | null;
  onDismiss: () => void;
  onViewMatches: () => void;
}

export default function MatchModal({ visible, matchedName, onDismiss, onViewMatches }: MatchModalProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    if (visible) {
      const colors = ["#fb9cb0", "#9bccf5", "#f9e0c2", "#4A85C8", "#FFD700"];
      setParticles(
        Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
        }))
      );
    }
  }, [visible]);

  if (!visible || !matchedName) return null;

  return (
    <div className="match-modal__backdrop" onClick={onDismiss}>
      <div className="match-modal" onClick={(e) => e.stopPropagation()}>
        {/* Confetti */}
        {particles.map((p) => (
          <div key={p.id} className="match-modal__particle" style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.color, animationDelay: `${p.delay}s` }} />
        ))}

        <div className="match-modal__content">
          <div className="match-modal__icon">
            <PartyPopper size={40} />
          </div>
          <h2 className="match-modal__title">It&apos;s a Match!</h2>
          <p className="match-modal__name">{matchedName}</p>
          <p className="match-modal__subtitle">You and your partner both love this name!</p>
          <div className="match-modal__actions">
            <button onClick={onViewMatches} className="match-modal__btn match-modal__btn--primary">
              <Heart size={16} />
              View All Matches
            </button>
            <button onClick={onDismiss} className="match-modal__btn match-modal__btn--secondary">
              Keep Swiping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
