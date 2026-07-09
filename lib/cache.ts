/**
 * Lightweight client-side cache.
 *
 * Two stores:
 *  - sessionStorage: tab-scoped, cleared on close (name pools, likes, matches)
 *  - localStorage:   persistent across tabs/refreshes (profile, couple state)
 *
 * NEVER cache: swipe actions, match inserts, auth tokens.
 * TTLs are conservative — real-time subscriptions handle live invalidation.
 */

const PREFIX = "namely_";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

type Store = "session" | "local";

function getStorage(store: Store): Storage | null {
  if (typeof window === "undefined") return null;
  return store === "local" ? localStorage : sessionStorage;
}

function getKey(key: string) {
  return `${PREFIX}${key}`;
}

export function cacheGet<T>(key: string, store: Store = "session"): T | null {
  try {
    const raw = getStorage(store)?.getItem(getKey(key));
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      getStorage(store)?.removeItem(getKey(key));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, data: T, ttlMs: number, store: Store = "session"): void {
  try {
    const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };
    getStorage(store)?.setItem(getKey(key), JSON.stringify(entry));
  } catch {
    // Silent: storage full or private mode
  }
}

export function cacheClear(key: string, store: Store = "session"): void {
  try {
    getStorage(store)?.removeItem(getKey(key));
  } catch {}
}

export function cacheClearByPrefix(prefix: string, store: Store = "session"): void {
  try {
    const s = getStorage(store);
    if (!s) return;
    const full = `${PREFIX}${prefix}`;
    Object.keys(s).filter((k) => k.startsWith(full)).forEach((k) => s.removeItem(k));
  } catch {}
}

/** Clear ALL app caches (call on signOut) */
export function cacheClearAll(): void {
  ["session", "local"].forEach((store) => {
    try {
      const s = getStorage(store as Store);
      if (!s) return;
      Object.keys(s).filter((k) => k.startsWith(PREFIX)).forEach((k) => s.removeItem(k));
    } catch {}
  });
}

/* ── TTL constants — single source of truth ── */
export const TTL = {
  PROFILE:  30 * 60 * 1000, // 30 min  (localStorage)
  COUPLE:    5 * 60 * 1000, //  5 min  (localStorage)
  NAME_POOL: 60 * 60 * 1000, //  1 hr  (sessionStorage)
  LIKES:    15 * 60 * 1000, // 15 min  (sessionStorage)
  MATCHES:   5 * 60 * 1000, //  5 min  (sessionStorage)
} as const;
