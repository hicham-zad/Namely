"use client";

import { createClient } from "@/lib/supabase-browser";
import { cacheGet, cacheSet, cacheClear, cacheClearAll, TTL } from "@/lib/cache";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

/* ── Types ──────────────────────────────────────────────────────────── */
export interface UserProfile {
  id: string;
  display_name?: string;
  email?: string;
  gender_preference: "boy" | "girl" | "both";
  style_tags: string[];
  origin_filters: string[];
  starts_with?: string | null;
  ends_with?: string | null;
  is_premium?: boolean;
  created_at: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

/* ── Context ────────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ── Fetch profile from DB ─────────────────────────────────────── */
  const fetchProfile = useCallback(
    async (userId: string) => {
      // Check localStorage cache first — eliminates flicker on hard refresh
      const cached = cacheGet<UserProfile>(`profile_${userId}`, "local");
      if (cached) setProfile(cached);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        const p = data as unknown as UserProfile;
        setProfile(p);
        cacheSet(`profile_${userId}`, p, TTL.PROFILE, "local");
      }
      return data;
    },
    [supabase]
  );

  /* ── Initialise on mount ───────────────────────────────────────── */
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      setIsLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  /* ── Actions ───────────────────────────────────────────────────── */
  const signOut = useCallback(async () => {
    cacheClearAll(); // wipe all caches before sign-out
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    router.push("/login");
  }, [supabase, router]);

  const deleteAccount = useCallback(async (): Promise<{
    error: string | null;
  }> => {
    try {
      const { error } = await supabase.rpc("delete_account");
      if (error) throw error;
      cacheClearAll();
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      router.push("/login");
      return { error: null };
    } catch (e: any) {
      return { error: e?.message ?? "Something went wrong." };
    }
  }, [supabase, router]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) return;
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...updates } as any);
      if (!error) {
        setProfile((prev) => {
          const updated = prev ? { ...prev, ...updates } : null;
          if (updated) cacheSet(`profile_${user.id}`, updated, TTL.PROFILE, "local");
          return updated;
        });
      }
    },
    [supabase, user]
  );

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signOut,
        deleteAccount,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
