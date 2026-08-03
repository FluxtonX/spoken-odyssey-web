/**
 * Client-side SWR (Stale-While-Revalidate) Cache Manager
 * Provides 0ms instant cached data retrieval and background refresh capability.
 */

const memoryCache = new Map();

export function getCachedData(key, ttlMs = 5 * 60 * 1000) {
  if (typeof window === "undefined" || !key) return null;

  // 1. Check in-memory RAM cache first
  const memEntry = memoryCache.get(key);
  if (memEntry && Date.now() - memEntry.timestamp < ttlMs) {
    return memEntry.data;
  }

  // 2. Check SessionStorage cache
  try {
    const sessionRaw = sessionStorage.getItem(`so_cache_${key}`);
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw);
      if (parsed && Date.now() - parsed.timestamp < ttlMs) {
        memoryCache.set(key, parsed);
        return parsed.data;
      }
    }
  } catch (_) {}

  return memEntry ? memEntry.data : null;
}

export function setCachedData(key, data) {
  if (typeof window === "undefined" || !key || data === undefined) return;

  const entry = { data, timestamp: Date.now() };
  memoryCache.set(key, entry);

  try {
    sessionStorage.setItem(`so_cache_${key}`, JSON.stringify(entry));
  } catch (_) {}
}

export function invalidateCachePattern(pattern) {
  if (typeof window === "undefined") return;

  const regex = new RegExp(pattern);

  // Clear matching in-memory cache
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }

  // Clear matching SessionStorage keys
  try {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const sKey = sessionStorage.key(i);
      if (sKey && sKey.startsWith("so_cache_")) {
        const cleanKey = sKey.replace(/^so_cache_/, "");
        if (regex.test(cleanKey)) {
          keysToRemove.push(sKey);
        }
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (_) {}
}

export function invalidateAllCache() {
  memoryCache.clear();
  if (typeof window === "undefined") return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const sKey = sessionStorage.key(i);
      if (sKey && sKey.startsWith("so_cache_")) {
        keysToRemove.push(sKey);
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (_) {}
}
