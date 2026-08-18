import Image from "next/image";
import Link from "next/link";
import LiveMarketBar from "@/components/LiveMarketBar";
import LoanPricingForm from "@/components/LoanPricingForm";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Loan Pricing",
};

export default function PricingPage() {
  return (
    <div className="ifund-shell">
      <header className="border-b border-brand-navy/10 bg-brand-white">
        <div className="ifund-page flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
            <Image
              src="/ifund-house-mark.png"
              alt="IFUND EQUITY"
              width={662}
              height={614}
              priority
              unoptimized
              className="h-12 w-auto object-contain"
            />
            <span className="font-serif text-lg font-bold tracking-wide text-brand-navy">
              IFUND EQUITY
            </span>
          </Link>
          <span className="rounded-full bg-brand-navy px-3 py-1 font-sans text-xs font-semibold text-white">
            Loan pricing
          </span>
        </div>
      </header>

      <LiveMarketBar />

      <main className="px-0 py-8 sm:py-12">
        <div className="ifund-page grid items-start gap-8 xl:grid-cols-[minmax(18rem,0.86fr)_minmax(0,1.5fr)] xl:gap-12">
          <div>
            <p className="font-sans text-sm font-semibold tracking-[0.14em] text-brand-champagne uppercase">
              Personalized pricing
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
              Build your pricing scenario
            </h1>
            <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-brand-slate">
              Choose your loan path, enter the key numbers, and select a US
              property address. Monthly payments are calculated from the 24-hour
              rate board shown in the header.
            </p>
          </div>
          <LoanPricingForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
