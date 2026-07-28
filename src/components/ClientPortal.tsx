'use client';

/**
 * MAIN UI — ClientPortal
 * Composes: LiveMarketBar + SiteFooter + LoanPricingForm (+ UsAddressInput inside the form)
 */

import Image from 'next/image';
import { useState } from 'react';
import LiveMarketBar from '@/components/LiveMarketBar';
import LoanPricingForm from '@/components/LoanPricingForm';
import SiteFooter from '@/components/SiteFooter';

type Screen = 'home' | 'pricing';

function HomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="ifund-shell">
      <LiveMarketBar />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:py-16">
        <div className="brand-soft-in mb-8 flex flex-col items-center">
          <Image
            src="/ifund-logo.png"
            alt="IFUND EQUITY"
            width={280}
            height={280}
            priority
            unoptimized
            className="mb-1 h-auto w-[190px] sm:w-[230px]"
          />
          <p className="mt-1 font-sans text-sm tracking-[0.2em] text-brand-slate uppercase">
            Institutional Growth & Real Estate
          </p>
        </div>

        <div className="ifund-portal-card brand-fade-up">
          <p className="mb-2 font-sans text-xs font-semibold tracking-[0.16em] text-brand-champagne uppercase">
            Secure client portal
          </p>
          <h1 className="mb-3 font-serif text-2xl font-semibold text-brand-navy sm:text-[1.75rem]">
            Capital clarity, priced in real time
          </h1>
          <p className="mb-6 font-sans text-sm leading-relaxed text-brand-slate">
            Track live benchmarks across conventional, government, jumbo, ARM,
            and non-QM programs—then run a personalized scenario for your
            purchase or refinance.
          </p>
          <button type="button" onClick={onContinue} className="ifund-cta">
            Begin Loan Evaluation
          </button>
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-brand-navy/8 pt-4 text-center">
            <div>
              <p className="font-serif text-base font-semibold text-brand-navy">Live</p>
              <p className="font-sans text-[0.65rem] text-brand-slate">Market board</p>
            </div>
            <div>
              <p className="font-serif text-base font-semibold text-brand-navy">US</p>
              <p className="font-sans text-[0.65rem] text-brand-slate">Address lookup</p>
            </div>
            <div>
              <p className="font-serif text-base font-semibold text-brand-navy">VA</p>
              <p className="font-sans text-[0.65rem] text-brand-slate">Benefit ready</p>
            </div>
          </div>
        </div>

        <p className="brand-fade-up-delay mt-8 max-w-lg text-center font-sans text-xs leading-relaxed text-brand-slate">
          Indicative levels update throughout the day. Your final quote depends
          on credit, property, and program eligibility.
        </p>
      </div>

      <SiteFooter />
    </div>
  );
}

function PricingScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="ifund-shell">
      <LiveMarketBar />

      <header className="sticky top-0 z-20 border-b border-brand-navy/10 bg-brand-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            <Image
              src="/ifund-mark.png"
              alt="IFUND EQUITY"
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 object-contain"
            />
            <span className="font-serif text-lg font-bold tracking-wide text-brand-navy">
              IFUND EQUITY
            </span>
          </button>
          <span className="rounded-full bg-brand-navy px-3 py-1 font-sans text-xs font-semibold text-white">
            Loan evaluation
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

        <LoanPricingForm />
      </main>

      <SiteFooter />
    </div>
  );
}

export default function ClientPortal() {
  const [screen, setScreen] = useState<Screen>('home');

  if (screen === 'home') {
    return <HomeScreen onContinue={() => setScreen('pricing')} />;
  }

  return <PricingScreen onBack={() => setScreen('home')} />;
}
