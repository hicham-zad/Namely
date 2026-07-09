"use client";

import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────

export interface PoolItem {
  nameId: string;
  source: "ai" | "db";
  aiData?: { name: string; origin: string; meaning: string; gender: string };
  dbData?: { name: string; origin: string; meaning: string; gender: string; style_tags: string[]; pronunciation_hint?: string; ai_explanation?: string | null };
}

/** Flat displayable shape the swipe card needs */
export interface DisplayName {
  id: string;
  name: string;
  gender: string;
  origin: string;
  meaning: string;
  style_tags: string[];
  pronunciation_hint?: string;
  ai_explanation?: string | null;
}

function toDisplayName(item: PoolItem): DisplayName {
  const d = item.aiData ?? item.dbData;
  return {
    id: item.nameId,
    name: d?.name ?? "",
    gender: d?.gender ?? "unisex",
    origin: d?.origin ?? "",
    meaning: d?.meaning ?? "",
    style_tags: item.dbData?.style_tags ?? [],
    pronunciation_hint: item.dbData?.pronunciation_hint,
    ai_explanation: item.dbData?.ai_explanation ?? (item.aiData as any)?.ai_explanation ?? null,
  };
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useCouplePool(coupleId: string | null) {
  const { user, profile } = useAuth();
  const supabase = createClient();

  const [pool, setPool] = useState<PoolItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSwipe, setLastSwipe] = useState<{ nameId: string; action: "like" | "pass" } | null>(null);
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Swiped IDs: persisted to sessionStorage per user ──────────────
  const swipedKey = user ? `swiped_${user.id}` : null;
  const loadSwiped = (): Set<string> => {
    if (!swipedKey) return new Set();
    try { const r = sessionStorage.getItem(swipedKey); return r ? new Set(JSON.parse(r)) : new Set(); }
    catch { return new Set(); }
  };
  const [swipedIds, setSwipedIds] = useState<Set<string>>(loadSwiped);
  const persistSwiped = (ids: Set<string>) => {
    if (!swipedKey) return;
    try { sessionStorage.setItem(swipedKey, JSON.stringify([...ids])); } catch {}
  };

  // ── Load pool from couple_name_pools ──────────────────────────────
  const loadPool = useCallback(async (freshPool?: PoolItem[]) => {
    if (!user) return;
    setIsLoading(true);
    try {
      let items: PoolItem[] = freshPool ?? [];

      if (!freshPool && coupleId) {
        const { data } = await supabase
          .from("couple_name_pools")
          .select("pool")
          .eq("couple_id", coupleId)
          .single();
        if (data?.pool) {
          items = typeof data.pool === "string" ? JSON.parse(data.pool) : data.pool;
        }
      }

      if (items.length === 0) { setPool([]); setCurrentIndex(0); return; }

      // Hydrate ai_explanation from both tables in one pass
      const dbIds = items.filter((i) => i.source === "db" && i.nameId).map((i) => i.nameId);
      const aiIds = items.filter((i) => i.source === "ai" && i.nameId).map((i) => i.nameId);

      const [dbRows, aiRows] = await Promise.all([
        dbIds.length > 0
          ? supabase.from("names").select("id, ai_explanation").in("id", dbIds.slice(0, 100))
          : Promise.resolve({ data: [] }),
        aiIds.length > 0
          ? supabase.from("ai_names").select("id, ai_explanation").in("id", aiIds.slice(0, 100))
          : Promise.resolve({ data: [] }),
      ]);

      const explanationMap = new Map<string, string>();
      [...(dbRows.data ?? []), ...(aiRows.data ?? [])].forEach((r: any) => {
        if (r.ai_explanation) explanationMap.set(r.id, r.ai_explanation);
      });

      if (explanationMap.size > 0) {
        items = items.map((item) => {
          const exp = explanationMap.get(item.nameId);
          if (!exp) return item;
          if (item.source === "db" && item.dbData) {
            return { ...item, dbData: { ...item.dbData, ai_explanation: exp } };
          }
          if (item.source === "ai" && item.aiData) {
            return { ...item, aiData: { ...item.aiData, ai_explanation: exp } as any };
          }
          return item;
        });
      }

      // Fast-forward past already-swiped names
      const swiped = loadSwiped();
      let start = 0;
      while (start < items.length && swiped.has(items[start].nameId)) start++;

      setPool(items);
      setCurrentIndex(start);
    } catch (err) {
      console.error("loadPool error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, coupleId, supabase]);

  // ── Initial load ──────────────────────────────────────────────────
  useEffect(() => { loadPool(); }, [loadPool]);

  // ── Real-time: sync when partner generates names ──────────────────
  useEffect(() => {
    if (!coupleId) return;
    if (subscriptionRef.current) supabase.removeChannel(subscriptionRef.current);

    const channel = supabase
      .channel(`pool-web-${coupleId}`)
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "couple_name_pools", filter: `couple_id=eq.${coupleId}` },
        async () => {
          // Partner updated pool — reload silently keeping current index
          try {
            const { data } = await supabase
              .from("couple_name_pools").select("pool").eq("couple_id", coupleId).single();
            if (data?.pool) {
              const items: PoolItem[] = typeof data.pool === "string" ? JSON.parse(data.pool) : data.pool;
              setPool(items);
              // Don't reset currentIndex — keep partner's progress
            }
          } catch { /* silent */ }
        }
      )
      .subscribe();

    subscriptionRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [coupleId, supabase]);

  // ── Generate names via API ────────────────────────────────────────
  const generateNames = useCallback(async (
    gender: string | null,
    origins: string[] | null,
    aiPrefs?: { user1StyleTags: string[]; user1Origins: string[]; user2StyleTags: string[]; user2Origins: string[] }
  ): Promise<number> => {
    if (!user) return 0;
    setIsGenerating(true);
    try {
      // Build avoidNames from sessionStorage swiped IDs
      const swiped = loadSwiped();
      let avoidNames: string[] = [];
      if (swiped.size > 0) {
        const { data: swipedNameRows } = await supabase
          .from("ai_names").select("name").in("id", [...swiped].slice(0, 60));
        avoidNames = swipedNameRows?.map((r: any) => r.name) ?? [];
        // Also check regular names table
        if (avoidNames.length < 30) {
          const { data: dbNameRows } = await supabase
            .from("names").select("name").in("id", [...swiped].slice(0, 60));
          avoidNames = [...new Set([...avoidNames, ...(dbNameRows?.map((r: any) => r.name) ?? [])])];
        }
      }

      const res = await fetch("/api/generate-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleId,
          gender: gender ?? null,
          user1StyleTags: aiPrefs?.user1StyleTags ?? profile?.style_tags ?? [],
          user1Origins: aiPrefs?.user1Origins ?? origins ?? [],
          user2StyleTags: aiPrefs?.user2StyleTags ?? [],
          user2Origins: aiPrefs?.user2Origins ?? [],
          avoidNames,
        }),
      });

      if (!res.ok) throw new Error(`generate-names API: ${res.status}`);
      const { pool: newPool, namesAdded } = await res.json();

      // The API already persisted to couple_name_pools — just update local state
      if (Array.isArray(newPool)) {
        const swiped = loadSwiped();
        let start = currentIndex;
        // If no items were being shown, find first unswiped
        if (pool.length === 0) {
          start = 0;
          while (start < newPool.length && swiped.has(newPool[start].nameId)) start++;
        }
        setPool(newPool);
        if (pool.length === 0) setCurrentIndex(start);
      }
      return namesAdded ?? 0;
    } finally {
      setIsGenerating(false);
    }
  }, [user, coupleId, profile, currentIndex, pool.length, supabase]);

  // ── Record swipe ──────────────────────────────────────────────────
  const recordSwipe = useCallback(async (nameId: string, action: "like" | "pass"): Promise<{ isMatch: boolean }> => {
    if (!user) return { isMatch: false };

    setSwipedIds((prev) => {
      const next = new Set(prev).add(nameId);
      persistSwiped(next);
      return next;
    });
    setLastSwipe({ nameId, action });
    setCurrentIndex((i) => i + 1);

    try {
      // Insert into swipes — works for both ai_names IDs and regular name IDs
      await supabase.from("swipes").insert({ user_id: user.id, couple_id: coupleId, name_id: nameId, action });

      if (action === "like" && coupleId) {
        const { data: partnerSwipe } = await supabase
          .from("swipes").select("id")
          .eq("name_id", nameId).eq("couple_id", coupleId)
          .neq("user_id", user.id).eq("action", "like").single();
        if (partnerSwipe) {
          await supabase.from("matches").insert({ couple_id: coupleId, name_id: nameId });
          return { isMatch: true };
        }
      }
      return { isMatch: false };
    } catch { return { isMatch: false }; }
  }, [user, coupleId, supabase]);

  // ── Undo last swipe ───────────────────────────────────────────────
  const undoLastSwipe = useCallback(async () => {
    if (!lastSwipe || !user) return;
    setSwipedIds((prev) => {
      const next = new Set(prev);
      next.delete(lastSwipe.nameId);
      persistSwiped(next);
      return next;
    });
    setCurrentIndex((i) => Math.max(0, i - 1));
    setLastSwipe(null);
    await supabase.from("swipes").delete()
      .eq("user_id", user.id).eq("name_id", lastSwipe.nameId);
  }, [lastSwipe, user, supabase]);

  // ── Add a DB name from catalog at current position ────────────────
  const addDbName = useCallback(async (nameId: string, nameData: any) => {
    const newItem: PoolItem = { nameId, source: "db", dbData: nameData };
    setPool((prev) => {
      if (prev.some((p) => p.nameId === nameId)) return prev;
      const next = [...prev];
      next.splice(currentIndex, 0, newItem);
      return next;
    });
    // Persist to couple_name_pools if in a couple
    if (coupleId) {
      setPool((current) => {
        // Fire and forget persistence
        supabase.from("couple_name_pools")
          .upsert({ couple_id: coupleId, pool: JSON.stringify(current), generated_at: new Date().toISOString() }, { onConflict: "couple_id" })
          .then(() => {});
        return current;
      });
    }
  }, [coupleId, currentIndex, supabase]);

  // ── Derived state ─────────────────────────────────────────────────
  const unseenPool = pool.filter((p) => !swipedIds.has(p.nameId));
  const currentItem = pool[currentIndex] ?? null;
  const currentName: DisplayName | null = currentItem ? toDisplayName(currentItem) : null;
  const remaining = Math.max(0, pool.length - currentIndex);
  const allSwiped = pool.length > 0 && currentIndex >= pool.length;

  return {
    pool, currentIndex, currentName, remaining, allSwiped,
    isLoading, isGenerating, lastSwipe,
    generateNames, recordSwipe, undoLastSwipe, addDbName,
    poolSize: pool.length,
  };
}
