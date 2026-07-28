import {
  BASELINE_PPE_PRODUCTS,
  PPE_CACHE_TTL_MS,
  type PpeProduct,
  type PpeRatesPayload,
} from "@/lib/ppe-rates";

type CacheEntry = {
  products: PpeProduct[];
  fetchedAt: number;
  source: "ppe" | "baseline";
};

declare global {
  // Persist across hot reloads in Next.js
  var __ifundPpeRatesCache: CacheEntry | undefined;
}

function getCache(): CacheEntry | undefined {
  return globalThis.__ifundPpeRatesCache;
}

function setCache(entry: CacheEntry) {
  globalThis.__ifundPpeRatesCache = entry;
}

function hasOptimalBlueCredentials(): boolean {
  return Boolean(
    process.env.OPTIMAL_BLUE_CLIENT_ID &&
      process.env.OPTIMAL_BLUE_CLIENT_SECRET &&
      process.env.OPTIMAL_BLUE_BASE_URL,
  );
}

/**
 * Pull a fresh PPE product board.
 * When Optimal Blue credentials exist, this is the integration point.
 * Until then, returns the baseline board (stable for the 24h cache window).
 */
async function fetchFreshPpeProducts(): Promise<{
  products: PpeProduct[];
  source: "ppe" | "baseline";
}> {
  if (hasOptimalBlueCredentials()) {
    // Integration hook: replace with real Optimal Blue PPE product/pricing board call.
    // Credentials are present but the vendor client is not wired yet — fall through
    // to baseline so the site still serves a 24h-cached board.
  }

  return {
    products: BASELINE_PPE_PRODUCTS.map((p) => ({ ...p })),
    source: "baseline",
  };
}

/**
 * Returns PPE products, refreshing at most once every 24 hours.
 */
export async function getCachedPpeRates(): Promise<PpeRatesPayload> {
  const now = Date.now();
  const cached = getCache();

  if (cached && now - cached.fetchedAt < PPE_CACHE_TTL_MS) {
    return {
      products: cached.products,
      fetchedAt: new Date(cached.fetchedAt).toISOString(),
      expiresAt: new Date(cached.fetchedAt + PPE_CACHE_TTL_MS).toISOString(),
      source: cached.source === "ppe" ? "ppe-cache" : "baseline",
      cacheTtlHours: 24,
    };
  }

  const fresh = await fetchFreshPpeProducts();
  setCache({
    products: fresh.products,
    fetchedAt: now,
    source: fresh.source,
  });

  return {
    products: fresh.products,
    fetchedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + PPE_CACHE_TTL_MS).toISOString(),
    source: fresh.source,
    cacheTtlHours: 24,
  };
}
