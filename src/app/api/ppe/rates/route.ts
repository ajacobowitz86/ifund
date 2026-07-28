import { NextResponse } from "next/server";
import { getCachedPpeRates } from "@/lib/ppe-rates-cache";

/**
 * GET /api/ppe/rates
 * Returns the live PPE product board, cached for 24 hours.
 * Header ticker and the built-in calculator both read from this endpoint.
 */
export async function GET() {
  try {
    const payload = await getCachedPpeRates();

    return NextResponse.json(payload, {
      headers: {
        // Allow browsers/CDN to reuse for up to 1 hour; server enforces 24h PPE refresh.
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load PPE rates" },
      { status: 500 },
    );
  }
}
