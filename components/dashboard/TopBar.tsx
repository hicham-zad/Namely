"use client";

import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

export default function TopBar() {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1 className="topbar__title">Dashboard</h1>
      </div>
      <div className="topbar__right">
        <div className="topbar__user" onClick={() => setShowMenu(!showMenu)}>
          <div className="topbar__avatar">
            <User size={16} />
          </div>
          <span className="topbar__email">{user?.email ?? "User"}</span>
        </div>
        {showMenu && (
          <div className="topbar__menu" onMouseLeave={() => setShowMenu(false)}>
            <button onClick={signOut} className="topbar__menu-item">
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
