'use client';

/**
 * MAIN UI — ClientPortal
 * Composes: LiveMarketBar (24h PPE board) + SiteFooter + LoanPricingForm calculator
 */

import Image from 'next/image';
import LiveMarketBar from '@/components/LiveMarketBar';
import LoanPricingForm from '@/components/LoanPricingForm';
import SiteFooter from '@/components/SiteFooter';

export default function ClientPortal() {
  return (
    <div className="ifund-shell">
      <header className="border-b border-brand-navy/10 bg-brand-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image
              src="/ifund-mark.png"
              alt=""
              width={451}
              height={471}
              priority
              unoptimized
              className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
            />
            <div className="min-w-0">
              <p className="font-serif text-lg font-bold tracking-[0.12em] text-brand-navy sm:text-2xl">
                IFUND EQUITY
              </p>
              <p className="mt-1 hidden font-sans text-[0.65rem] tracking-[0.14em] text-brand-slate uppercase sm:block">
                Institutional Growth &amp; Real Estate
              </p>
            </div>
          </div>

          <a
            href="mailto:consult@ifundequity.com?subject=IFUND%20Loan%20Pricing"
            className="ifund-chat-button"
          >
            Chat with us
          </a>
        </div>
      </header>

      <LiveMarketBar />

      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-sans text-xs font-semibold tracking-[0.18em] text-brand-champagne uppercase">
            Fast, personalized mortgage pricing
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
            Price your loan in seconds
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-base leading-relaxed text-brand-slate sm:text-lg">
            Explore purchase, refinance, cash-out, and VA loan scenarios using
            today&apos;s live market board. Enter a few details to compare
            estimated rates and monthly principal-and-interest payments.
          </p>
        </div>

        <LoanPricingForm />
      </main>

      <SiteFooter />
    </div>
  );
}
