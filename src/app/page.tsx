import ClientPortal from "@/components/ClientPortal";

/**
 * MAIN ENTRY
 * src/app/page.tsx → ClientPortal
 * ClientPortal uses LiveMarketBar, LoanPricingForm, SiteFooter
 * LoanPricingForm uses UsAddressInput + /api/optimal-blue/pricing
 */
export default function HomePage() {
  return <ClientPortal />;
}
