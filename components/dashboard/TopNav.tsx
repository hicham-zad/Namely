"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Compass, HeartHandshake, Settings, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/likes", label: "My Likes", icon: Heart },
  { href: "/matches", label: "Matches", icon: HeartHandshake },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function TopNav({ isConnected }: { isConnected?: boolean }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const initial = (user?.email?.[0] ?? "U").toUpperCase();

  return (
    <>
      <header className="topnav">
        {/* Logo */}
        <Link href="/discover" className="topnav__logo">
          <Image src="/logo.png" alt="Namely" width={32} height={32} className="topnav__logo-img" />
          <span className="topnav__logo-text">Namely</span>
        </Link>

        {/* Nav links */}
        <nav className="topnav__links">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} className={`topnav__link ${active ? "topnav__link--active" : ""}`}>
                <Icon size={16} />
                <span>{label}</span>
                {href === "/matches" && isConnected && <span className="topnav__dot" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="topnav__user" onClick={() => setShowMenu(!showMenu)} onBlur={() => setTimeout(() => setShowMenu(false), 150)} tabIndex={0}>
          <div className="topnav__avatar">{initial}</div>
          <span className="topnav__email">{user?.email}</span>
          {showMenu && (
            <div className="topnav__menu">
              <button onClick={signOut} className="topnav__menu-item">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </header>

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
