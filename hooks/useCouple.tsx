"use client";

import { createClient } from "@/lib/supabase-browser";
import { cacheGet, cacheSet, cacheClear, TTL } from "@/lib/cache";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";

/* ── Types ──────────────────────────────────────────────────────────── */
interface CoupleRow {
  id: string;
  created_by: string;
  invite_code: string;
  status: "waiting" | "connected";
  created_at: string;
}

export interface CoupleState {
  couple: CoupleRow | null;
  partnerId: string | null;
  isConnected: boolean;
  inviteCode: string | null;
  isLoading: boolean;
  error: string | null;
  fetchCouple: () => Promise<void>;
  createCouple: () => Promise<string>;
  joinCouple: (code: string) => Promise<{ success: boolean; error?: string }>;
  leaveCouple: () => Promise<{ success: boolean; error?: string }>;
}

interface CachedCoupleState {
  couple: CoupleRow | null;
  partnerId: string | null;
  isConnected: boolean;
  inviteCode: string | null;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/* ── Hook ───────────────────────────────────────────────────────────── */
export function useCouple(): CoupleState {
  const { user } = useAuth();
  const supabase = createClient();

  // Seed state from cache immediately — eliminates loading flicker on navigation
  const getCacheKey = (uid: string) => `couple_${uid}`;
  const seedFromCache = (uid: string): CachedCoupleState => {
    return cacheGet<CachedCoupleState>(getCacheKey(uid), "local") ?? {
      couple: null, partnerId: null, isConnected: false, inviteCode: null,
    };
  };

  const seed = user ? seedFromCache(user.id) : { couple: null, partnerId: null, isConnected: false, inviteCode: null };

  const [couple, setCouple] = useState<CoupleRow | null>(seed.couple);
  const [partnerId, setPartnerId] = useState<string | null>(seed.partnerId);
  const [isConnected, setIsConnected] = useState(seed.isConnected);
  const [inviteCode, setInviteCode] = useState<string | null>(seed.inviteCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Fetch couple ─────────────────────────────────────────────── */
  const fetchCouple = useCallback(async () => {
    if (!user) return;

    // Return cached immediately, then revalidate silently in background
    const cached = cacheGet<CachedCoupleState>(getCacheKey(user.id), "local");
    if (cached) {
      setCouple(cached.couple);
      setPartnerId(cached.partnerId);
      setIsConnected(cached.isConnected);
      setInviteCode(cached.inviteCode);
    }

    const { data: membership } = await supabase
      .from("couple_members")
      .select("couple_id")
      .eq("user_id", user.id)
      .single();

    if (!membership?.couple_id) {
      const empty: CachedCoupleState = { couple: null, partnerId: null, isConnected: false, inviteCode: null };
      setCouple(null); setIsConnected(false); setInviteCode(null); setPartnerId(null);
      cacheSet(getCacheKey(user.id), empty, TTL.COUPLE, "local");
      return;
    }

    const { data: coupleData } = await supabase
      .from("couples").select("*").eq("id", membership.couple_id).single();
    if (!coupleData) return;

    const { data: members } = await supabase
      .from("couple_members").select("user_id").eq("couple_id", coupleData.id);

    const partner = (members as any[])?.find((m: any) => m.user_id !== user.id);
    const isActuallyConnected = (members as any[])?.length >= 2;

    if (isActuallyConnected && coupleData.status === "waiting") {
      await supabase.from("couples").update({ status: "connected" }).eq("id", coupleData.id);
      coupleData.status = "connected";
    }

    const state: CachedCoupleState = {
      couple: coupleData as unknown as CoupleRow,
      partnerId: partner?.user_id ?? null,
      isConnected: isActuallyConnected,
      inviteCode: coupleData.invite_code,
    };

    setCouple(state.couple);
    setInviteCode(state.inviteCode);
    setIsConnected(state.isConnected);
    setPartnerId(state.partnerId);
    cacheSet(getCacheKey(user.id), state, TTL.COUPLE, "local");
  }, [user, supabase]);

  useEffect(() => { fetchCouple(); }, [fetchCouple]);

  // Real-time subscription — invalidate cache when couple changes
  useEffect(() => {
    if (!couple?.id) return;
    const channel = supabase
      .channel(`couple-web-${couple.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "couple_members", filter: `couple_id=eq.${couple.id}` },
        () => { if (user) cacheClear(getCacheKey(user.id), "local"); fetchCouple(); })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "couples", filter: `id=eq.${couple.id}` },
        () => { if (user) cacheClear(getCacheKey(user.id), "local"); fetchCouple(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [couple?.id, supabase, fetchCouple, user]);

  /* ── Create couple ─────────────────────────────────────────────── */
  const createCouple = useCallback(async (): Promise<string> => {
    if (!user) throw new Error("Not authenticated");
    if (inviteCode && couple) return inviteCode;

    setIsLoading(true); setError(null);
    try {
      const { data: existing } = await supabase.from("couple_members").select("couple_id").eq("user_id", user.id).single();
      if (existing?.couple_id) {
        const { data: existingCouple } = await supabase.from("couples").select("*").eq("id", existing.couple_id).single();
        if (existingCouple) {
          const state: CachedCoupleState = { couple: existingCouple as unknown as CoupleRow, partnerId: null, isConnected: existingCouple.status === "connected", inviteCode: existingCouple.invite_code };
          setCouple(state.couple); setInviteCode(state.inviteCode); setIsConnected(state.isConnected);
          cacheSet(getCacheKey(user.id), state, TTL.COUPLE, "local");
          return existingCouple.invite_code as string;
        }
      }

      let coupleData: any = null;
      let code = "";
      for (let i = 0; i < 3; i++) {
        code = generateCode();
        const { data, error } = await supabase.from("couples").insert({ created_by: user.id, invite_code: code, status: "waiting" }).select().single();
        if (!error) { coupleData = data; break; }
        if (error.code !== "23505") throw error;
      }
      if (!coupleData) throw new Error("Could not create a couple.");

      await supabase.from("couple_members").upsert({ couple_id: coupleData.id, user_id: user.id }, { onConflict: "couple_id,user_id" });

      const state: CachedCoupleState = { couple: coupleData as CoupleRow, partnerId: null, isConnected: false, inviteCode: code };
      setCouple(state.couple); setInviteCode(code); setIsConnected(false);
      cacheSet(getCacheKey(user.id), state, TTL.COUPLE, "local");
      fetchCouple(); // refresh in background so partnerId resolves if partner already joined
      return code;
    } catch (err: any) {
      setError(err?.message ?? "Unknown error"); throw err;
    } finally { setIsLoading(false); }
  }, [user, supabase, couple, inviteCode]);

  /* ── Join couple ───────────────────────────────────────────────── */
  const joinCouple = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };
    setIsLoading(true); setError(null);
    try {
      const { data: coupleData, error: findErr } = await supabase.from("couples").select("*").eq("invite_code", code.toUpperCase().trim()).single();
      if (findErr || !coupleData) return { success: false, error: "Invalid invite code." };

      const { data: members } = await supabase.from("couple_members").select("user_id").eq("couple_id", coupleData.id);
      const amIMember = members?.some((m: any) => m.user_id === user.id);
      if (members && members.length >= 2 && !amIMember) return { success: false, error: "This invite code is no longer valid." };

      if (!amIMember) {
        const { data: already } = await supabase.from("couple_members").select("couple_id").eq("user_id", user.id).single();
        if (already) {
          const { data: existingCouple } = await supabase.from("couples").select("status, created_by").eq("id", already.couple_id).single();
          if (existingCouple?.status === "connected") return { success: false, error: "You are already linked." };
          if (existingCouple?.created_by === user.id) {
            await supabase.from("couples").delete().eq("id", already.couple_id);
          } else {
            await supabase.from("couple_members").delete().eq("couple_id", already.couple_id).eq("user_id", user.id);
          }
        }
        await supabase.from("couple_members").upsert({ couple_id: coupleData.id, user_id: user.id }, { onConflict: "couple_id,user_id" });
        await supabase.from("couples").update({ status: "connected" }).eq("id", coupleData.id);
      }

      const { data: allMembers } = await supabase.from("couple_members").select("user_id").eq("couple_id", coupleData.id);
      const partnerMember = allMembers?.find((m: any) => m.user_id !== user.id);

      const state: CachedCoupleState = {
        couple: { ...coupleData, status: "connected" } as unknown as CoupleRow,
        partnerId: partnerMember?.user_id ?? null,
        isConnected: true,
        inviteCode: coupleData.invite_code,
      };
      setCouple(state.couple); setInviteCode(state.inviteCode); setIsConnected(true); setPartnerId(state.partnerId);
      cacheSet(getCacheKey(user.id), state, TTL.COUPLE, "local");
      return { success: true };
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      return { success: false, error: err?.message };
    } finally { setIsLoading(false); }
  }, [user, supabase]);

  /* ── Leave couple ──────────────────────────────────────────────── */
  const leaveCouple = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!user || !couple) return { success: true };
    setIsLoading(true);
    try {
      await supabase.from("couple_members").delete().eq("couple_id", couple.id).eq("user_id", user.id);
      const { data: members } = await supabase.from("couple_members").select("user_id").eq("couple_id", couple.id);
      if (!members || members.length === 0) {
        await supabase.from("couples").delete().eq("id", couple.id);
      } else {
        await supabase.from("couples").update({ status: "waiting" }).eq("id", couple.id);
      }
      setCouple(null); setPartnerId(null); setIsConnected(false); setInviteCode(null);
      cacheClear(getCacheKey(user.id), "local");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message };
    } finally { setIsLoading(false); }
  }, [user, couple, supabase]);

  return { couple, partnerId, isConnected, inviteCode, isLoading, error, fetchCouple, createCouple, joinCouple, leaveCouple };
}
