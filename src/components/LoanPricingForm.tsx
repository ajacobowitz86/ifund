'use client';

import { useEffect, useMemo, useState } from 'react';
import UsAddressInput from '@/components/UsAddressInput';
import { usePpeRates } from '@/hooks/usePpeRates';
import {
  LOAN_PRODUCTS,
  LOAN_PRODUCT_GROUPS,
  OCCUPANCY_OPTIONS,
  buildBestFitQuote,
  maxLtvFor,
  type LoanProductId,
  type Occupancy,
} from '@/lib/ppe-rates';

function formatUsd(value: number, digits = 0) {
  if (!Number.isFinite(value)) return '0';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatRate(value: number) {
  return `${value.toFixed(3)}%`;
}

function parseMoney(raw: string) {
  const n = Number(raw.replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <span className="money-input">
        <span>$</span>
        <input
          inputMode="numeric"
          value={value ? formatUsd(value) : ''}
          onChange={(event) => onChange(parseMoney(event.target.value))}
        />
      </span>
    </label>
  );
}

const ADDRESS_CLASS =
  'w-full rounded-[5px] border border-[#e5e7eb] bg-white px-3.5 py-[0.7rem] font-sans text-[0.95rem] text-brand-navy outline-none';

export default function LoanPricingForm() {
  const { products, loading, error } = usePpeRates();
  const [productId, setProductId] = useState<LoanProductId>('conventional');
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [propertyValue, setPropertyValue] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [currentBalance, setCurrentBalance] = useState(320000);
  const [cashOutAmount, setCashOutAmount] = useState(50000);
  const [helocLine, setHelocLine] = useState(75000);
  const [helocDraw, setHelocDraw] = useState(25000);
  const [creditScore, setCreditScore] = useState(740);
  const [termMonths, setTermMonths] = useState(360);
  const [occupancy, setOccupancy] = useState<Occupancy>('primary');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [now, setNow] = useState<Date | null>(null);

  const product = LOAN_PRODUCTS.find((item) => item.id === productId) ?? LOAN_PRODUCTS[0];
  const isPurchase = productId === 'conventional' || productId === 'fha';
  const occupancyChoices = OCCUPANCY_OPTIONS.filter((item) =>
    product.occupancyOptions.includes(item.id),
  );

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const quote = useMemo(() => {
    if (products.length === 0) return null;
    return buildBestFitQuote({
      products,
      productId,
      purchasePrice,
      propertyValue,
      downPayment,
      currentBalance,
      cashOutAmount,
      helocLine,
      helocDraw,
      creditScore,
      termMonths,
      occupancy,
    });
  }, [
    products,
    productId,
    purchasePrice,
    propertyValue,
    downPayment,
    currentBalance,
    cashOutAmount,
    helocLine,
    helocDraw,
    creditScore,
    termMonths,
    occupancy,
  ]);

  const liveLabel = now
    ? `Live • ${now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`
    : 'Live';

  const derivedLoan = isPurchase
    ? Math.max(0, purchasePrice - downPayment)
    : productId === 'cash_out'
      ? currentBalance + cashOutAmount
      : productId === 'heloc'
        ? helocLine
        : currentBalance;
  const derivedValue = isPurchase ? purchasePrice : propertyValue;
  const derivedLtv = derivedValue > 0 ? derivedLoan / derivedValue : 0;
  const derivedCltv =
    propertyValue > 0 ? (currentBalance + helocLine) / propertyValue : 0;
  const minFhaDown = Math.round(purchasePrice * 0.035);
  const maxHelocLine = Math.max(
    0,
    Math.round(propertyValue * maxLtvFor('heloc', occupancy) - currentBalance),
  );

  const selectProduct = (id: LoanProductId) => {
    const next = LOAN_PRODUCTS.find((item) => item.id === id);
    if (!next) return;
    setProductId(id);
    setTermMonths(next.defaultTermMonths);
    if (!next.occupancyOptions.includes(occupancy)) {
      setOccupancy(next.occupancyOptions[0]);
    }
    if (id === 'fha') {
      setOccupancy('primary');
      setDownPayment(minFhaDown);
    }
    if (id === 'conventional' && downPayment < purchasePrice * 0.1) {
      setDownPayment(Math.round(purchasePrice * 0.2));
    }
  };

  const consultationHref = useMemo(() => {
    if (!quote) {
      return 'mailto:consult@ifundequity.com?subject=Lock%20rate%20%E2%80%94%20Request%20consultation';
    }
    const body = [
      `Product: ${quote.productName}`,
      `Rate: ${formatRate(quote.interestRate)}  APR: ${formatRate(quote.apr)}`,
      `Estimated monthly: $${formatUsd(quote.totalMonthly)} (${quote.paymentNote})`,
      `Property: ${propertyAddress || 'Not provided'}`,
      `Credit score: ${creditScore}`,
      `Occupancy: ${OCCUPANCY_OPTIONS.find((item) => item.id === occupancy)?.label}`,
      ...quote.metrics.map((metric) =>
        `${metric.label}: ${metric.value}${metric.hint ? ` (${metric.hint})` : ''}`,
      ),
    ].join('\n');

    return `mailto:consult@ifundequity.com?subject=${encodeURIComponent(
      'Lock this rate — Request consultation',
    )}&body=${encodeURIComponent(body)}`;
  }, [quote, creditScore, occupancy, propertyAddress]);

  return (
    <section className="pricing-engine" aria-label="Mortgage pricing engine">
      <div>
        <h2 className="scenario-title">Your scenario</h2>
        <p className="scenario-lede">
          Adjust the details and your quote updates instantly
        </p>

        <p className="field-label">Loan product</p>
        <div className="product-groups">
          {LOAN_PRODUCT_GROUPS.map((group) => (
            <div key={group.id} className="product-group">
              <p className="product-group__label">{group.label}</p>
              <div className="product-grid">
                {group.productIds.map((id) => {
                  const item = LOAN_PRODUCTS.find((product) => product.id === id);
                  if (!item) return null;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`choice-btn${productId === item.id ? ' is-active' : ''}`}
                      aria-pressed={productId === item.id}
                      onClick={() => selectProduct(item.id)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="scenario-hint">{product.needed}</p>

        {isPurchase && (
          <>
            <div className="field-grid">
              <MoneyField
                label="Purchase price"
                value={purchasePrice}
                onChange={(value) => {
                  setPurchasePrice(value);
                  if (downPayment > value) setDownPayment(value);
                }}
              />
              <MoneyField
                label="Down payment"
                value={downPayment}
                onChange={setDownPayment}
              />
            </div>
            <p className="computed-line">
              Loan amount ${formatUsd(derivedLoan)} · {Math.round(derivedLtv * 100)}% LTV
              {productId === 'conventional' ? ' · Conventional' : ''}
              {productId === 'fha' ? ` · FHA minimum down $${formatUsd(minFhaDown)}` : ''}
            </p>
          </>
        )}

        {productId === 'rate_term' && (
          <div className="field-grid">
            <MoneyField
              label="Property value"
              value={propertyValue}
              onChange={setPropertyValue}
            />
            <MoneyField
              label="Current loan balance"
              value={currentBalance}
              onChange={setCurrentBalance}
            />
          </div>
        )}

        {productId === 'cash_out' && (
          <>
            <div className="field-grid">
              <MoneyField
                label="Property value"
                value={propertyValue}
                onChange={setPropertyValue}
              />
              <MoneyField
                label="Current loan balance"
                value={currentBalance}
                onChange={setCurrentBalance}
              />
            </div>
            <div className="extra-box">
              <p className="extra-box__title">Cash-out amount</p>
              <MoneyField
                label="Cash you want to take out"
                value={cashOutAmount}
                onChange={setCashOutAmount}
              />
              <p className="computed-line">
                New loan ${formatUsd(derivedLoan)} · {Math.round(derivedLtv * 100)}% LTV
              </p>
            </div>
          </>
        )}

        {productId === 'heloc' && (
          <>
            <div className="field-grid">
              <MoneyField
                label="Property value"
                value={propertyValue}
                onChange={setPropertyValue}
              />
              <MoneyField
                label="First mortgage balance"
                value={currentBalance}
                onChange={setCurrentBalance}
              />
            </div>
            <div className="extra-box">
              <p className="extra-box__title">HELOC line &amp; draw</p>
              <div className="field-grid">
                <MoneyField
                  label="Requested HELOC line"
                  value={helocLine}
                  onChange={(value) => {
                    setHelocLine(value);
                    if (helocDraw > value) setHelocDraw(value);
                  }}
                />
                <MoneyField
                  label="Amount to draw now"
                  value={helocDraw}
                  onChange={setHelocDraw}
                />
              </div>
              <p className="computed-line">
                Combined LTV {Math.round(derivedCltv * 100)}% · Typical max line $
                {formatUsd(maxHelocLine)}
              </p>
            </div>
          </>
        )}

        <div className="stack-field">
          <div className="credit-head">
            <span className="field-label" style={{ marginBottom: 0 }}>
              Credit score: {creditScore}
            </span>
          </div>
          <input
            className="credit-slider"
            type="range"
            min={580}
            max={820}
            step={5}
            value={creditScore}
            onChange={(event) => setCreditScore(Number(event.target.value))}
            aria-label="Credit score"
          />
          <div className="credit-range">
            <span>580</span>
            <span>820</span>
          </div>
        </div>

        {product.termOptions.length > 0 && productId !== 'heloc' && (
          <div className="stack-field">
            <label>
              <span className="field-label">Term (years)</span>
              <select
                className="select-input"
                value={termMonths}
                onChange={(event) => setTermMonths(Number(event.target.value))}
              >
                {product.termOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="stack-field">
          <p className="field-label">Occupancy</p>
          <div
            className="occupancy-grid"
            style={{
              gridTemplateColumns: `repeat(${occupancyChoices.length}, minmax(0, 1fr))`,
            }}
          >
            {occupancyChoices.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`choice-btn${occupancy === item.id ? ' is-active' : ''}`}
                onClick={() => setOccupancy(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {productId === 'fha' && (
            <p className="computed-line">FHA financing requires owner occupancy.</p>
          )}
        </div>

        <div className="stack-field">
          <label>
            <span className="field-label">Property address</span>
            <UsAddressInput
              value={propertyAddress}
              onChange={setPropertyAddress}
              className={ADDRESS_CLASS}
            />
          </label>
        </div>
      </div>

      <aside className="quote-card" aria-live="polite">
        {error && products.length === 0 ? (
          <div className="quote-card__empty">{error}</div>
        ) : loading && !quote ? (
          <div className="quote-card__empty">Loading live pricing…</div>
        ) : quote ? (
          <>
            <header className="quote-card__header">
              <div className="quote-card__top">
                <span className="quote-card__badge">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M4.6 8.2 6.8 10.3 11.4 5.6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Best-fit quote
                </span>
                <span className="quote-card__live">{liveLabel}</span>
              </div>
              <h3 className="quote-card__product">{quote.productName}</h3>
              <p className="quote-card__board">{quote.boardName}</p>
              <div>
                <span className="quote-card__rate-label">Rate</span>
                <span className="quote-card__rate">{formatRate(quote.interestRate)}</span>
                <p className="quote-card__apr">APR {formatRate(quote.apr)}</p>
              </div>
            </header>

            <div className="quote-card__body">
              <div className="quote-card__payment">
                <p className="quote-card__payment-label">Estimated monthly payment</p>
                <p className="quote-card__payment-amount">
                  ${formatUsd(Math.round(quote.totalMonthly))}
                </p>
                <p className="quote-card__payment-note">{quote.paymentNote}</p>
                <svg
                  className="quote-card__chart"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 16.5 8.2 11l3.6 3.2L21 6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 6.5h6v6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="quote-card__metrics">
                {quote.metrics.map((metric) => (
                  <div key={metric.label} className="quote-metric">
                    <div className="quote-metric__label">{metric.label}</div>
                    <div className="quote-metric__value">{metric.value}</div>
                    {metric.hint ? (
                      <div className="quote-metric__hint">{metric.hint}</div>
                    ) : null}
                  </div>
                ))}
              </div>

              <a className="quote-card__cta" href={consultationHref}>
                Lock This Rate — Request Consultation
              </a>
              <p className="quote-card__disclaimer">
                Rates are estimates for illustration only and are not a commitment to
                lend. Final pricing is subject to credit, property, occupancy,
                documentation, and investor underwriting guidelines. Equal Housing
                Lender.
              </p>
            </div>
          </>
        ) : (
          <div className="quote-card__empty">Enter a scenario to see live pricing.</div>
        )}
      </aside>
    </section>
  );
}
