"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send feedback");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fmodal-backdrop" onClick={onClose}>
      <div className="fmodal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="fmodal-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        {isSuccess ? (
          <div className="fmodal-success">
            <CheckCircle2 size={48} className="fmodal-success__icon" />
            <h3 className="fmodal-success__title">Thank You!</h3>
            <p className="fmodal-success__text">We appreciate your feedback.</p>
          </div>
        ) : (
          <>
            <div className="fmodal-header">
              <h2 className="fmodal-title">We'd love your feedback</h2>
              <p className="fmodal-sub">What do you love? What could be better? Let us know!</p>
            </div>

            <form onSubmit={handleSubmit} className="fmodal-form">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your feedback here..."
                className="fmodal-textarea"
                rows={5}
                autoFocus
              />

              {error && <p className="fmodal-error">{error}</p>}

              <div className="fmodal-actions">
                <button type="button" onClick={onClose} className="fmodal-cancel">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fmodal-submit"
                  disabled={!message.trim() || isSubmitting}
                >
                  {isSubmitting ? <><Loader2 size={16} className="spin" /> Sending...</> : "Send Feedback"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
