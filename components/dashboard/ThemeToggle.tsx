"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="theme-toggle-placeholder" style={{ width: 28, height: 28 }} />;
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      className="sidebar__signout"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      title={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
    >
      {currentTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
