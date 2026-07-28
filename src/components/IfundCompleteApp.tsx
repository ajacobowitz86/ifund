'use client';

/**
 * IFUND EQUITY — Complete app (from full session)
 * Brand portal + Step 1 loan pricing + US Places autocomplete + stub Optimal Blue pricing
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';

const libraries: ('places')[] = ['places'];

const usAutocompleteOptions: google.maps.places.AutocompleteOptions = {
  componentRestrictions: { country: 'us' },
  fields: ['formatted_address', 'address_components', 'geometry'],
  types: ['address'],
};

type LoanPurpose = 'purchase' | 'rate_term' | 'cash_out';
type Screen = 'portal' | 'step1';

type PricingOption = {
  productName: string;
  interestRate: number;
  monthlyPayment: number;
  apr: number;
};

const fieldClassName =
  'w-full rounded-xl border border-brand-navy/15 bg-brand-canvas py-3 font-sans text-brand-navy outline-none transition-all focus:bg-brand-white focus:ring-2 focus:ring-brand-navy';

const addressInputClassName =
  'w-full rounded-xl border border-brand-navy/15 bg-brand-canvas px-4 py-3 font-sans text-brand-navy outline-none transition-all focus:bg-brand-white focus:ring-2 focus:ring-brand-navy';

function UsAddressInput({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const hasMapsKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  if (!hasMapsKey) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={addressInputClassName}
        placeholder="Enter US street address, city, state, zip"
        autoComplete="street-address"
      />
    );
  }

  return (
    <GoogleUsAddressInput
      value={value}
      onChange={onChange}
      required={required}
    />
  );
}

function GoogleUsAddressInput({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  if (loadError) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={addressInputClassName}
        placeholder="Enter US street address, city, state, zip"
        autoComplete="street-address"
      />
    );
  }

  if (!isLoaded) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={addressInputClassName}
        placeholder="Loading US address lookup..."
        autoComplete="street-address"
      />
    );
  }

  return (
    <Autocomplete
      onLoad={setAutocomplete}
      onPlaceChanged={() => {
        const place = autocomplete?.getPlace();
        if (place?.formatted_address) onChange(place.formatted_address);
      }}
      options={usAutocompleteOptions}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={addressInputClassName}
        placeholder="Start typing a US street address"
        autoComplete="street-address"
      />
    </Autocomplete>
  );
}

function BrandPortal({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-canvas p-6 text-brand-navy">
      <div className="brand-soft-in mb-10 flex flex-col items-center">
        <Image
          src="/ifund-logo.png"
          alt="IFUND EQUITY"
          width={280}
          height={280}
          priority
          unoptimized
          className="mb-2 h-auto w-[200px] sm:w-[240px]"
        />
        <p className="mt-1 font-sans text-sm tracking-widest text-brand-slate uppercase">
          Institutional Growth & Real Estate
        </p>
      </div>

      <div className="brand-fade-up w-full max-w-md rounded-2xl border border-gray-100 bg-brand-white p-8 text-center shadow-md">
        <h2 className="mb-3 font-serif text-xl font-semibold">
          Secure Client Portal
        </h2>
        <p className="mb-6 font-sans text-sm text-brand-slate">
          Access automated evaluation pipelines and portfolio management tools.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-xl bg-brand-champagne py-3 font-sans font-medium text-white shadow transition hover:opacity-95"
        >
          Request Consultation
        </button>
      </div>
    </div>
  );
}

function MortgagePricingStep({ onBack }: { onBack: () => void }) {
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>('purchase');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [cashOutAmount, setCashOutAmount] = useState('');
  const [isVaLoan, setIsVaLoan] = useState(false);
  const [pricingResults, setPricingResults] = useState<PricingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purposeTabClass = (active: boolean) =>
    `rounded-xl border px-4 py-3 font-sans text-sm font-semibold transition-all ${
      active
        ? 'border-brand-navy bg-brand-navy text-brand-white shadow-md'
        : 'border-brand-navy/15 bg-brand-canvas text-brand-slate hover:bg-brand-white'
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/optimal-blue/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanPurpose,
          purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
          loanAmount: parseFloat(loanAmount),
          creditScore: parseInt(creditScore, 10),
          propertyAddress,
          cashOutAmount: cashOutAmount ? parseFloat(cashOutAmount) : 0,
          isVaLoan,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch pricing');
      setPricingResults(data.options);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-canvas text-brand-navy">
      <header className="border-b border-brand-navy/10 bg-brand-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-3"
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

        <div className="mx-auto my-8 max-w-3xl rounded-2xl border border-brand-navy/10 bg-brand-white p-6 shadow-md sm:my-10 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.14em] text-brand-slate uppercase">
                Loan details
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-brand-navy">
                Price your loan
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsVaLoan(!isVaLoan)}
              className={`self-start rounded-lg px-4 py-2 font-sans text-sm font-semibold shadow-sm transition-all ${
                isVaLoan
                  ? 'bg-brand-champagne text-white ring-2 ring-brand-champagne/40'
                  : 'bg-brand-canvas text-brand-navy hover:bg-brand-navy/5'
              }`}
            >
              {isVaLoan ? '✓ VA Loan Active' : '+ VA Loan'}
            </button>
          </div>

          <div className="mb-8 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setLoanPurpose('purchase')}
              className={purposeTabClass(loanPurpose === 'purchase')}
            >
              Purchase
            </button>
            <button
              type="button"
              onClick={() => setLoanPurpose('rate_term')}
              className={purposeTabClass(loanPurpose === 'rate_term')}
            >
              Rate & Term Refi
            </button>
            <button
              type="button"
              onClick={() => setLoanPurpose('cash_out')}
              className={purposeTabClass(loanPurpose === 'cash_out')}
            >
              Cash-Out Refi
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {loanPurpose === 'purchase' && (
                <div>
                  <label className="mb-2 block font-sans text-sm font-semibold text-brand-navy">
                    Purchase Price
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-slate">
                      $
                    </span>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      required
                      className={`${fieldClassName} pl-8 pr-4`}
                      placeholder="500,000"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block font-sans text-sm font-semibold text-brand-navy">
                  {loanPurpose === 'purchase'
                    ? 'Loan Amount'
                    : 'Requested Loan Amount'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-slate">
                    $
                  </span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    required
                    className={`${fieldClassName} pl-8 pr-4`}
                    placeholder="400,000"
                  />
                </div>
              </div>

              {loanPurpose === 'cash_out' && (
                <div>
                  <label className="mb-2 block font-sans text-sm font-semibold text-brand-navy">
                    Cash-Out Amount Needed
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-slate">
                      $
                    </span>
                    <input
                      type="number"
                      value={cashOutAmount}
                      onChange={(e) => setCashOutAmount(e.target.value)}
                      required
                      className={`${fieldClassName} pl-8 pr-4`}
                      placeholder="50,000"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block font-sans text-sm font-semibold text-brand-navy">
                  Credit Score
                </label>
                <input
                  type="number"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  required
                  min={300}
                  max={850}
                  className={`${fieldClassName} px-4`}
                  placeholder="740"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-sans text-sm font-semibold text-brand-navy">
                Property Address (United States)
              </label>
              <UsAddressInput
                value={propertyAddress}
                onChange={setPropertyAddress}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-champagne py-4 font-sans font-bold text-white shadow transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Fetching Live Rates...' : 'Calculate Live Pricing'}
            </button>
          </form>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-sans text-sm text-red-700">
              {error}
            </div>
          )}

          {pricingResults.length > 0 && (
            <div className="mt-10 border-t border-brand-navy/10 pt-6">
              <h3 className="mb-4 font-serif text-xl font-bold text-brand-navy">
                Live Broker Pricing Options
              </h3>
              <div className="space-y-4">
                {pricingResults.map((option, index) => (
                  <div
                    key={`${option.productName}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-brand-navy/10 bg-brand-canvas p-5 transition-all hover:border-brand-navy/25"
                  >
                    <div>
                      <h4 className="font-sans text-base font-bold text-brand-navy">
                        {option.productName}
                      </h4>
                      <p className="mt-1 font-sans text-sm text-brand-slate">
                        Interest Rate:{' '}
                        <span className="font-bold text-brand-champagne">
                          {option.interestRate}%
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-sm font-semibold text-brand-navy">
                        ${option.monthlyPayment.toLocaleString('en-US')} /mo
                      </p>
                      <p className="mt-1 font-sans text-xs text-brand-slate">
                        APR: {option.apr}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function IfundCompleteApp() {
  const [screen, setScreen] = useState<Screen>('portal');

  if (screen === 'portal') {
    return <BrandPortal onContinue={() => setScreen('step1')} />;
  }

  return <MortgagePricingStep onBack={() => setScreen('portal')} />;
}
