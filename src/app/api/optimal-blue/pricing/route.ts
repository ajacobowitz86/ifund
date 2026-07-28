import { NextResponse } from "next/server";

/**
 * Legacy Optimal Blue POST endpoint.
 * Personalized quotes no longer POST on each calculator submit.
 * The site loads a 24h-cached PPE board via GET /api/ppe/rates and
 * calculates monthly payments locally from those rates.
 */
export async function POST() {
  return NextResponse.json(
    {
      message:
        "Per-request PPE posting is disabled. Use GET /api/ppe/rates (24h cache) and the built-in monthly payment calculator.",
      ratesEndpoint: "/api/ppe/rates",
    },
    { status: 410 },
  );
}
