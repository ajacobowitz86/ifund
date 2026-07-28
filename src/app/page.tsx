import ClientPortal from "@/components/ClientPortal";

/**
 * MAIN ENTRY
 * src/app/page.tsx → ClientPortal
 * ClientPortal uses LiveMarketBar, LoanPricingForm, SiteFooter
 * LiveMarketBar + LoanPricingForm share GET /api/ppe/rates (24h cache)
 * Calculator computes monthly payments locally from the PPE board
 */
export default function HomePage() {
  return <ClientPortal />;
}
