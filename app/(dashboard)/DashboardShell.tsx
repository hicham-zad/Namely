"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="dash-loading">
        <div className="dash-loading__spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="dash">
      <div className="dash__inner">
        <Sidebar />
        <main className="dash__main">
          {children}
        </main>
      </div>
    </div>
  );
}
