'use client';

import React, { useMemo, useState } from 'react';
import UsAddressInput from '@/components/UsAddressInput';
import { usePpeRates } from '@/hooks/usePpeRates';
import {
  buildCalculatorOptions,
  type CalculatorOption,
} from '@/lib/ppe-rates';

const addressInputClassName =
  'w-full rounded-xl border border-brand-navy/15 bg-brand-canvas px-4 py-3 font-sans text-brand-navy outline-none transition-all focus:bg-brand-white focus:ring-2 focus:ring-brand-navy';

const fieldClassName =
  'w-full rounded-xl border border-brand-navy/15 bg-brand-canvas py-3 font-sans text-brand-navy outline-none transition-all focus:bg-brand-white focus:ring-2 focus:ring-brand-navy';

export default function LoanPricingForm() {
  const { products, fetchedAt, loading: ratesLoading, error: ratesError } =
    usePpeRates();

  const [loanPurpose, setLoanPurpose] = useState<
    'purchase' | 'rate_term' | 'cash_out'
  >('purchase');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [creditScore, setCreditScore] = useState<string>('');
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [cashOutAmount, setCashOutAmount] = useState<string>('');
  const [isVaLoan, setIsVaLoan] = useState<boolean>(false);

  const [pricingResults, setPricingResults] = useState<CalculatorOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const boardLabel = useMemo(() => {
    if (!fetchedAt) return 'PPE board loading…';
    return `Using PPE board from ${fetchedAt.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })} (refreshes every 24h)`;
  }, [fetchedAt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(loanAmount);
    const score = parseInt(creditScore, 10);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid loan amount.');
      setPricingResults([]);
      setHasCalculated(false);
      return;
    }

    if (!Number.isFinite(score) || score < 300 || score > 850) {
      setError('Enter a credit score between 300 and 850.');
      setPricingResults([]);
      setHasCalculated(false);
      return;
    }

    if (products.length === 0) {
      setError(ratesError || 'PPE rates are not available yet. Try again shortly.');
      setPricingResults([]);
      setHasCalculated(false);
      return;
    }

    const options = buildCalculatorOptions({
      products,
      loanAmount: amount,
      creditScore: score,
      isVaLoan,
    });

    setPricingResults(options);
    setHasCalculated(true);
  };

  const purposeTabClass = (active: boolean) =>
    `rounded-xl border px-4 py-3 font-sans text-sm font-semibold transition-all ${
      active
        ? 'border-brand-navy bg-brand-navy text-brand-white shadow-md'
        : 'border-brand-navy/15 bg-brand-canvas text-brand-slate hover:bg-brand-white'
    }`;

  return (
    <div className="mx-auto my-8 max-w-3xl rounded-2xl border border-brand-navy/10 bg-brand-white p-6 shadow-md sm:my-10 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-xs font-semibold tracking-[0.14em] text-brand-slate uppercase">
            Loan details
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-brand-navy">
            Price your loan
          </h2>
          <p className="mt-2 font-sans text-xs text-brand-slate">{boardLabel}</p>
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
              {loanPurpose === 'purchase' ? 'Loan Amount' : 'Requested Loan Amount'}
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
              min="300"
              max="850"
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
            className={addressInputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={ratesLoading && products.length === 0}
          className="ifund-cta"
        >
          {ratesLoading && products.length === 0
            ? 'Loading PPE rates…'
            : 'Calculate Monthly Payments'}
        </button>
      </form>

      {(error || ratesError) && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-sans text-sm text-red-700">
          {error || ratesError}
        </div>
      )}

      {hasCalculated && pricingResults.length > 0 && (
        <div className="mt-10 border-t border-brand-navy/10 pt-6">
          <h3 className="mb-1 font-serif text-xl font-bold text-brand-navy">
            Monthly payment options
          </h3>
          <p className="mb-4 font-sans text-xs text-brand-slate">
            Calculated from the 24-hour PPE rate board — no live PPE post on
            each quote. Principal &amp; interest only; taxes and insurance not
            included.
          </p>
          <div className="space-y-4">
            {pricingResults.map((option) => (
              <div
                key={option.productName}
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
                    <span className="text-brand-slate/70">
                      {' '}
                      · {option.termMonths / 12}-yr term
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm font-semibold text-brand-navy">
                    $
                    {option.monthlyPayment.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    /mo
                  </p>
                  <p className="mt-1 font-sans text-xs text-brand-slate">
                    Est. APR: {option.apr}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
