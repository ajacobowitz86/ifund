import Link from "next/link";
import MortgagePricingForm from "@/components/MortgagePricingForm";

export default function Step1Page() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#dde5ef_0%,_var(--brand-canvas)_48%,_#e8eef5_100%)]">
      <header className="border-b border-brand-navy/10 bg-brand-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-navy">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 text-brand-white"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </span>
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
