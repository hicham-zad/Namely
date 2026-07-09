"use client";

import { createClient } from "@/lib/supabase-browser";
import { cacheGet, cacheSet, cacheClearByPrefix, cacheClearAll, TTL } from "@/lib/cache";
import { useAuth } from "./useAuth";
import { useCallback, useState } from "react";

export interface NameEntry {
  id: string;
  name: string;
  normalized_name: string;
  gender: "boy" | "girl" | "unisex";
  origin: string;
  meaning: string;
  style_tags: string[];
  first_letter: string;
  syllable_count: number;
  popularity_bucket: string;
  pronunciation_hint?: string;
  enabled: boolean;
  ai_explanation?: string | null;
}

function poolCacheKey(userId: string, coupleId: string | null, gender: string | null, origins: string[] | null) {
  const g = gender ?? "any";
  const o = origins?.length ? origins.slice().sort().join(",") : "any";
  const c = coupleId ?? "solo";
  return `pool_${userId}_${c}_${g}_${o}`;
}

export function useSwipes(coupleId: string | null) {
  const { user, profile } = useAuth();
  const supabase = createClient();

  const [namePool, setNamePool] = useState<NameEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSwipe, setLastSwipe] = useState<{ nameId: string; action: "like" | "pass" } | null>(null);

  // Persist swipedIds in sessionStorage so they survive page refresh
  const swipedKey = user ? `swiped_${user.id}` : null;
  const loadSwipedIds = () => {
    if (!swipedKey) return new Set<string>();
    try {
      const raw = sessionStorage.getItem(swipedKey);
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch { return new Set<string>(); }
  };
  const [swipedIds, setSwipedIds] = useState<Set<string>>(loadSwipedIds);

  const persistSwipedIds = (ids: Set<string>) => {
    if (!swipedKey) return;
    try { sessionStorage.setItem(swipedKey, JSON.stringify([...ids])); } catch {}
  };

  const fetchNamePool = useCallback(async (
    overrideGender?: string | null,
    overrideOrigins?: string[] | null,
    aiPrefs?: {
      user1StyleTags?: string[]; user1Origins?: string[];
      user2StyleTags?: string[]; user2Origins?: string[];
    }
  ) => {
    if (!user) return;

    const gender = overrideGender !== undefined
      ? overrideGender
      : (profile?.gender_preference !== "both" ? profile?.gender_preference : null);
    const origins = overrideOrigins !== undefined
      ? overrideOrigins
      : (profile?.origin_filters?.length ? profile.origin_filters : null);

    const isManualGenerate = overrideGender !== undefined || overrideOrigins !== undefined;
    const cacheKey = poolCacheKey(user.id, coupleId, gender ?? null, origins ?? null);

    // ── On navigation/reload: use session cache first ─────────────────
    if (!isManualGenerate) {
      const cached = cacheGet<NameEntry[]>(cacheKey, "session");
      if (cached && cached.length > 0) {
        const fresh = cached.filter((n) => !swipedIds.has(n.id));
        if (fresh.length > 0) {
          setNamePool(fresh);
          setCurrentIndex(0);
          return;
        }
      }
    }

    setIsLoading(true);
    try {
      let pool: NameEntry[] = [];

      // ── AI generation path (when user clicks Generate Names) ─────────
      if (isManualGenerate) {
        // Collect already-swiped names to pass as avoidNames
        const { data: mySwipeRows } = await supabase.from("swipes").select("name_id").eq("user_id", user.id);
        const swipedNameIds = [...new Set([...(mySwipeRows?.map((s: any) => s.name_id) ?? []), ...swipedIds])];

        // Fetch actual name strings for the avoidNames list (limit to 60)
        let avoidNames: string[] = [];
        if (swipedNameIds.length > 0) {
          const { data: swipedNameRows } = await supabase
            .from("names").select("name").in("id", swipedNameIds.slice(0, 60));
          avoidNames = swipedNameRows?.map((r: any) => r.name) ?? [];
        }

        const aiRes = await fetch("/api/generate-names", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gender: gender ?? null,
            user1StyleTags: aiPrefs?.user1StyleTags ?? profile?.style_tags ?? [],
            user1Origins: aiPrefs?.user1Origins ?? origins ?? [],
            user2StyleTags: aiPrefs?.user2StyleTags ?? [],
            user2Origins: aiPrefs?.user2Origins ?? [],
            avoidNames,
          }),
        });

        if (aiRes.ok) {
          const { names: aiNames } = await aiRes.json();
          // AI names are new — upsert them into the names table so they get real UUIDs
          // then load them back as NameEntry objects
          if (Array.isArray(aiNames) && aiNames.length > 0) {
            const toUpsert = aiNames.map((n: any) => ({
              name: n.name,
              normalized_name: n.name.toLowerCase().trim(),
              gender: n.gender ?? gender ?? "unisex",
              origin: n.origin ?? "Unknown",
              meaning: n.meaning ?? "",
              style_tags: aiPrefs?.user1StyleTags ?? profile?.style_tags ?? [],
              first_letter: n.name[0]?.toUpperCase() ?? "A",
              syllable_count: Math.ceil(n.name.length / 3),
              popularity_bucket: "rare",
              enabled: true,
            }));

            // Upsert by normalized_name so we don't create duplicates
            const { data: upserted } = await supabase
              .from("names")
              .upsert(toUpsert, { onConflict: "normalized_name", ignoreDuplicates: false })
              .select("*");

            if (upserted && upserted.length > 0) {
              pool = (upserted as NameEntry[]).filter((n) => !swipedIds.has(n.id));
            } else {
              // Fallback: fetch by normalized names
              const { data: fetched } = await supabase
                .from("names")
                .select("*")
                .in("normalized_name", aiNames.map((n: any) => n.name.toLowerCase().trim()));
              pool = ((fetched as NameEntry[]) ?? []).filter((n) => !swipedIds.has(n.id));
            }
          }
        }

        // If AI failed or returned nothing, fall through to DB query below
        if (pool.length === 0) {
          console.warn("AI generation failed or empty — falling back to DB query");
        }
      }

      // ── DB fallback / initial load ────────────────────────────────────
      if (pool.length === 0) {
        const { data: names, error } = await supabase.rpc("get_discover_names", {
          p_user_id: user.id, p_couple_id: coupleId, p_limit: 50, p_gender: gender ?? null, p_origins: origins ?? null,
        });

        if (error) {
          const { data: mySwipes } = await supabase.from("swipes").select("name_id").eq("user_id", user.id);
          const swiped = new Set([...(mySwipes?.map((s: any) => s.name_id) ?? []), ...swipedIds]);
          let q = supabase.from("names").select("*").limit(50) as any;
          if (swiped.size > 0) q = q.not("id", "in", `(${[...swiped].join(",")})`);
          if (gender) q = q.eq("gender", gender);
          if (origins?.length) q = q.in("origin", origins);
          const { data } = await q;
          pool = (data as NameEntry[]) ?? [];
        } else {
          pool = (names as NameEntry[]) ?? [];
        }

        pool = pool.filter((n) => !swipedIds.has(n.id));

        // Partner names fallback when pool is still empty
        if (pool.length === 0 && coupleId) {
          const { data: mySwipes } = await supabase.from("swipes").select("name_id").eq("user_id", user.id);
          const mySwipedIds = new Set(mySwipes?.map((s: any) => s.name_id) ?? []);
          const { data: partnerSwipes } = await supabase
            .from("swipes").select("name_id").eq("couple_id", coupleId).neq("user_id", user.id)
            .order("created_at", { ascending: false }).limit(60);
          const partnerNameIds = (partnerSwipes ?? [])
            .map((s: any) => s.name_id)
            .filter((id: string) => !mySwipedIds.has(id) && !swipedIds.has(id));
          if (partnerNameIds.length > 0) {
            const { data: partnerNames } = await supabase.from("names").select("*").in("id", partnerNameIds);
            pool = (partnerNames as NameEntry[]) ?? [];
          }
        }
      }

      if (isManualGenerate) {
        cacheClearByPrefix(`pool_${user.id}`, "session");
      }
      if (pool.length > 0) cacheSet(cacheKey, pool, TTL.NAME_POOL, "session");

      setNamePool(pool);
      setCurrentIndex(0);
    } catch (err) {
      console.error("fetchNamePool error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, profile, coupleId, supabase, swipedIds]);

  const recordSwipe = useCallback(async (nameId: string, action: "like" | "pass"): Promise<{ isMatch: boolean }> => {
    if (!user) return { isMatch: false };
    setSwipedIds((prev) => {
      const next = new Set(prev).add(nameId);
      persistSwipedIds(next);
      return next;
    });
    setLastSwipe({ nameId, action });
    setCurrentIndex((i) => i + 1);
    // Invalidate likes cache since the like list changed
    cacheClearByPrefix(`likes_${user.id}`, "session");
    try {
      await supabase.from("swipes").insert({ user_id: user.id, couple_id: coupleId, name_id: nameId, action });
      if (action === "like" && coupleId) {
        const { data: partnerSwipe } = await supabase
          .from("swipes").select("id").eq("name_id", nameId).eq("couple_id", coupleId)
          .neq("user_id", user.id).eq("action", "like").single();
        if (partnerSwipe) {
          await supabase.from("matches").insert({ couple_id: coupleId, name_id: nameId });
          return { isMatch: true };
        }
      }
      return { isMatch: false };
    } catch { return { isMatch: false }; }
  }, [user, coupleId, supabase]);

  const undoLastSwipe = useCallback(async () => {
    if (!lastSwipe || !user) return;
    setSwipedIds((prev) => {
      const next = new Set(prev);
      next.delete(lastSwipe.nameId);
      persistSwipedIds(next);
      return next;
    });
    setCurrentIndex((i) => Math.max(0, i - 1));
    setLastSwipe(null);
    cacheClearByPrefix(`likes_${user.id}`, "session");
    await supabase.from("swipes").delete().eq("user_id", user.id).eq("name_id", lastSwipe.nameId);
  }, [lastSwipe, user, supabase]);

  const fetchLikes = useCallback(async (): Promise<NameEntry[]> => {
    if (!user) return [];
    const cacheKey = `likes_${user.id}`;
    const cached = cacheGet<NameEntry[]>(cacheKey, "session");
    if (cached) return cached;

    const { data: likeSwipes } = await supabase.from("swipes").select("name_id").eq("user_id", user.id).eq("action", "like");
    if (!likeSwipes?.length) return [];
    const { data: names } = await supabase.from("names").select("*").in("id", likeSwipes.map((s: any) => s.name_id));
    const result = (names as NameEntry[]) ?? [];
    cacheSet(cacheKey, result, TTL.LIKES, "session");
    return result;
  }, [user, supabase]);

  const unlikeName = useCallback(async (nameId: string) => {
    if (!user) return;
    cacheClearByPrefix(`likes_${user.id}`, "session");
    await supabase.from("swipes").delete().eq("user_id", user.id).eq("name_id", nameId).eq("action", "like");
  }, [user, supabase]);

  const currentName = namePool[currentIndex] ?? null;
  const remaining = Math.max(0, namePool.length - currentIndex);
  const allSwiped = namePool.length > 0 && currentIndex >= namePool.length;

  return { namePool, setNamePool, currentIndex, currentName, remaining, allSwiped, isLoading, lastSwipe, fetchNamePool, recordSwipe, undoLastSwipe, fetchLikes, unlikeName };
}
