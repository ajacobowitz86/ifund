'use client';

import BrandHeader from '@/components/BrandHeader';
import LiveMarketBar from '@/components/LiveMarketBar';
import LoanPricingForm from '@/components/LoanPricingForm';
import SiteFooter from '@/components/SiteFooter';

function FeatureIcon({ name }: { name: 'bolt' | 'refresh' | 'check' }) {
  if (name === 'bolt') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M13 2 4 14h8l-2 8 11-14h-8l0-6Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (name === 'refresh') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20 12a8 8 0 1 1-2.2-5.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M20 4.5V9h-4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.2 16.7 19 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8.5 9.2 12.7 19 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ClientPortal() {
  return (
    <div className="ifund-shell">
      <BrandHeader />
      <LiveMarketBar />

      <main className="flex-1 pb-12">
        <div className="ifund-page">
          <section className="pricing-hero">
            <p className="pricing-hero__kicker">Mortgage pricing engine</p>
            <h1 className="pricing-hero__title">Price any property loan in seconds.</h1>
            <p className="pricing-hero__lede">
              Optimal Blue PPE scenario pricing for conventional, FHA, rate-and-term
              refinance, cash-out refinance, and HELOC. Enter only the loan parameters
              required for your loan type — 100% anonymous without personal information.
            </p>
            <div className="pricing-hero__features">
              <div className="pricing-hero__feature">
                <span className="pricing-hero__icon">
                  <FeatureIcon name="bolt" />
                </span>
                Instant, no-obligation pricing
              </div>
              <div className="pricing-hero__feature">
                <span className="pricing-hero__icon">
                  <FeatureIcon name="refresh" />
                </span>
                Real-time rate adjustments
              </div>
              <div className="pricing-hero__feature">
                <span className="pricing-hero__icon">
                  <FeatureIcon name="check" />
                </span>
                All property loan types
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
