import Image from "next/image";
import Link from "next/link";
import MortgagePricingForm from "@/components/MortgagePricingForm";

export default function Step1Page() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#dde5ef_0%,_var(--brand-canvas)_48%,_#e8eef5_100%)]">
      <header className="border-b border-brand-navy/10 bg-brand-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/ifund-mark.png"
              alt="IFUND EQUITY"
              width={32}
              height={32}
              priority
              className="h-8 w-8 object-contain"
            />
            <span className="font-serif text-lg font-bold tracking-wide text-brand-navy">
              IFUND EQUITY
            </span>
          </Link>
          <span className="font-sans text-sm font-medium text-brand-slate">
            Step 1 · Loan pricing
          </span>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-sm font-semibold tracking-[0.14em] text-brand-slate uppercase">
            Step 1
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Price your loan
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base text-brand-slate">
            Choose a loan purpose, enter amounts and credit score, then pick a US
            property address to preview broker pricing options.
          </p>
        </div>
        <MortgagePricingForm />
      </main>
    </div>
  );
}
