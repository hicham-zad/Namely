"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Compass, HeartHandshake, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import FeedbackModal from "./FeedbackModal";

const NAV_ITEMS = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/likes", label: "My Likes", icon: Heart },
  { href: "/matches", label: "Matches", icon: HeartHandshake },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isConnected }: { isConnected?: boolean }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const initial = (user?.email?.[0] ?? "N").toUpperCase();
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <Link href="/discover" className="sidebar__logo">
          <Image src="/logo.png" alt="Namely" width={32} height={32} className="sidebar__logo-img" />
          <span className="sidebar__logo-text">Namely</span>
        </Link>


        {/* Nav */}
        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} className={`sidebar__link ${active ? "sidebar__link--active" : ""}`}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user + sign out */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button 
            onClick={() => setShowFeedback(true)} 
            className="sidebar__feedback-btn"
            title="Send Feedback"
            style={{ marginBottom: 0 }}
          >
            Leave Feedback
          </button>
          
          <div className="sidebar__footer" style={{ marginTop: 0 }}>
            <div className="sidebar__user">
              <div className="sidebar__avatar">{initial}</div>
              <span className="sidebar__email">{user?.email}</span>
            </div>
            <ThemeToggle />
            <button onClick={signOut} className="sidebar__signout" title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={`bottom-nav__link ${active ? "bottom-nav__link--active" : ""}`}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
