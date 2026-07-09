"use client";

import { Copy, Check, Users, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface InviteCodeProps {
  code: string;
  isConnected: boolean;
}

export default function InviteCode({ code, isConnected }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="invite-code">
      <div className="invite-code__header">
        <div className={`invite-code__status ${isConnected ? "invite-code__status--connected" : ""}`}>
          {isConnected ? <Users size={14} /> : <LinkIcon size={14} />}
          <span>{isConnected ? "Partner Connected" : "Waiting for partner"}</span>
        </div>
      </div>
      <div className="invite-code__display">
        <span className="invite-code__value">{code}</span>
        <button onClick={handleCopy} className="invite-code__copy" title="Copy code">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      {!isConnected && (
        <p className="invite-code__hint">Share this code with your partner so they can link with you.</p>
      )}
    </div>
  );
}
