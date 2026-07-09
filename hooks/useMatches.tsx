"use client";

import { createClient } from "@/lib/supabase-browser";
import { cacheGet, cacheSet, cacheClear, TTL } from "@/lib/cache";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";
import type { NameEntry } from "./useSwipes";

export interface MatchWithName {
  id: string;
  couple_id: string;
  name_id: string;
  created_at: string;
  name: NameEntry;
  starred: boolean;
  archived: boolean;
}

export function useMatches(coupleId: string | null) {
  const { user } = useAuth();
  const supabase = createClient();
  const [matches, setMatches] = useState<MatchWithName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMatchName, setNewMatchName] = useState<string | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const cacheKey = coupleId ? `matches_${coupleId}` : null;

  const fetchMatches = useCallback(async () => {
    if (!coupleId) return;
    setIsLoading(true);

    // Serve from cache immediately, revalidate in background
    if (cacheKey) {
      const cached = cacheGet<MatchWithName[]>(cacheKey, "session");
      if (cached) {
        setMatches(cached);
        setIsLoading(false);
        // Revalidate silently — don't return, let it fetch and update
      }
    }

    try {
      const { data: matchRows } = await supabase.from("matches").select("*").eq("couple_id", coupleId);
      const { data: shortlist } = await supabase.from("shortlist_states").select("name_id, starred, archived").eq("couple_id", coupleId);
      const slMap = new Map((shortlist ?? []).map((s: any) => [s.name_id, s]));

      const result: MatchWithName[] = [];
      for (const m of (matchRows ?? []) as any[]) {
        const { data: nameData } = await supabase.from("names").select("*").eq("id", m.name_id).single();
        if (!nameData) {
          const { data: aiName } = await supabase.from("ai_names").select("*").eq("id", m.name_id).single();
          const name = aiName
            ? { ...aiName, normalized_name: aiName.name?.toLowerCase(), style_tags: aiName.style_tags ?? [], first_letter: aiName.name?.[0] ?? "", syllable_count: 2, popularity_bucket: "rare", enabled: true }
            : { id: m.name_id, name: "(Unknown)", normalized_name: "", gender: "unisex", origin: "", meaning: "", style_tags: [], first_letter: "?", syllable_count: 2, popularity_bucket: "rare", enabled: true };
          result.push({ ...m, name: name as NameEntry, starred: slMap.get(m.name_id)?.starred ?? false, archived: slMap.get(m.name_id)?.archived ?? false });
        } else {
          result.push({ ...m, name: nameData as NameEntry, starred: slMap.get(m.name_id)?.starred ?? false, archived: slMap.get(m.name_id)?.archived ?? false });
        }
      }
      result.sort((a, b) => a.name.name.localeCompare(b.name.name));
      setMatches(result);
      if (cacheKey) cacheSet(cacheKey, result, TTL.MATCHES, "session");
    } catch (err) { console.error("fetchMatches error:", err); }
    finally { setIsLoading(false); }
  }, [coupleId, supabase, cacheKey]);

  // Real-time subscription — new match comes in, invalidate cache and update UI
  useEffect(() => {
    if (!coupleId) return;
    const channel = supabase
      .channel(`matches-web-${coupleId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "matches", filter: `couple_id=eq.${coupleId}` }, async (payload) => {
        const m = payload.new as any;
        const { data: nameData } = await supabase.from("names").select("*").eq("id", m.name_id).single();
        const name = (nameData as NameEntry) ?? { id: m.name_id, name: "(Unknown)", normalized_name: "", gender: "unisex", origin: "", meaning: "", style_tags: [], first_letter: "?", syllable_count: 2, popularity_bucket: "rare", enabled: true } as NameEntry;
        setMatches((prev) => {
          if (prev.some((x) => x.id === m.id)) return prev;
          const updated = [{ ...m, name, starred: false, archived: false }, ...prev];
          // Update cache with new match
          if (cacheKey) cacheSet(cacheKey, updated, TTL.MATCHES, "session");
          return updated;
        });
        setNewMatchName(name.name);
        setShowMatchModal(true);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [coupleId, supabase, cacheKey]);

  const toggleStar = useCallback(async (nameId: string) => {
    if (!coupleId) return;
    const match = matches.find((m) => m.name_id === nameId);
    const newStarred = !match?.starred;
    await supabase.from("shortlist_states").upsert({ couple_id: coupleId, name_id: nameId, starred: newStarred } as any, { onConflict: "couple_id,name_id" });
    setMatches((prev) => {
      const updated = prev.map((m) => (m.name_id === nameId ? { ...m, starred: newStarred } : m));
      if (cacheKey) cacheSet(cacheKey, updated, TTL.MATCHES, "session");
      return updated;
    });
  }, [coupleId, matches, supabase, cacheKey]);

  const toggleArchive = useCallback(async (nameId: string) => {
    if (!coupleId) return;
    const match = matches.find((m) => m.name_id === nameId);
    const newArchived = !match?.archived;
    await supabase.from("shortlist_states").upsert({ couple_id: coupleId, name_id: nameId, archived: newArchived } as any, { onConflict: "couple_id,name_id" });
    setMatches((prev) => {
      const updated = prev.map((m) => (m.name_id === nameId ? { ...m, archived: newArchived } : m));
      if (cacheKey) cacheSet(cacheKey, updated, TTL.MATCHES, "session");
      return updated;
    });
  }, [coupleId, matches, supabase, cacheKey]);

  const dismissMatch = useCallback(() => { setShowMatchModal(false); setNewMatchName(null); }, []);

  return { matches, isLoading, newMatchName, showMatchModal, fetchMatches, toggleStar, toggleArchive, dismissMatch };
}
