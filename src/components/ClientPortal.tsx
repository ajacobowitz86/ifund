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
        <div className="ifund-page flex items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image
              src="/ifund-house-mark.png"
              alt=""
              width={662}
              height={614}
              priority
              unoptimized
              className="h-16 w-auto shrink-0 object-contain sm:h-20"
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

      <main className="flex-1 py-8 sm:py-12">
        <div className="ifund-page grid items-start gap-8 xl:grid-cols-[minmax(18rem,0.86fr)_minmax(0,1.5fr)] xl:gap-12">
          <section>
            <p className="font-sans text-xs font-semibold tracking-[0.18em] text-brand-champagne uppercase">
              Fast, personalized mortgage pricing
            </p>
            <h1 className="mt-3 max-w-xl font-serif text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              Price your loan in seconds
            </h1>
            <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-brand-slate sm:text-lg">
              Explore purchase, refinance, cash-out, and VA loan scenarios using
              today&apos;s live market board. Enter a few details to compare
              estimated rates and monthly principal-and-interest payments.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="ifund-highlight">
                <p className="font-serif text-lg font-semibold text-brand-navy">
                  Live market board
                </p>
                <p className="mt-1 font-sans text-sm leading-relaxed text-brand-slate">
                  Conventional, FHA, refinance, and cash-out rates stay in view
                  while you price.
                </p>
              </div>
              <div className="ifund-highlight">
                <p className="font-serif text-lg font-semibold text-brand-navy">
                  Instant payment math
                </p>
                <p className="mt-1 font-sans text-sm leading-relaxed text-brand-slate">
                  Monthly principal and interest is calculated locally from the
                  24-hour rate board.
                </p>
              </div>
              <div className="ifund-highlight">
                <p className="font-serif text-lg font-semibold text-brand-navy">
                  VA-ready scenarios
                </p>
                <p className="mt-1 font-sans text-sm leading-relaxed text-brand-slate">
                  Toggle VA pricing when needed and compare options for a U.S.
                  property address.
                </p>
              </div>
            </div>
          </section>

          <LoanPricingForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
