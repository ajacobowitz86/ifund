import Image from "next/image";
import Link from "next/link";
import LiveMarketBar from "@/components/LiveMarketBar";
import MortgagePricingForm from "@/components/MortgagePricingForm";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Step 1 · Loan Evaluation",
};

export default function Step1Page() {
  return (
    <div className="ifund-shell">
      <LiveMarketBar />

      <header className="sticky top-0 z-20 border-b border-brand-navy/10 bg-brand-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
            <Image
              src="/ifund-mark.png"
              alt="IFUND EQUITY"
              width={32}
              height={32}
              priority
              unoptimized
              className="h-8 w-8 object-contain"
            />
            <span className="font-serif text-lg font-bold tracking-wide text-brand-navy">
              IFUND EQUITY
            </span>
          </Link>
          <span className="rounded-full bg-brand-navy px-3 py-1 font-sans text-xs font-semibold text-white">
            Step 1 · Loan evaluation
          </span>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-sm font-semibold tracking-[0.14em] text-brand-champagne uppercase">
            Personalized pricing
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Build your pricing scenario
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-brand-slate">
            Choose your loan path, enter the key numbers, and select a US
            property address. We’ll return broker options next to today’s live
            market board.
          </p>
        </div>
        <MortgagePricingForm />
      </main>

      <SiteFooter />
    </div>
  );
}
