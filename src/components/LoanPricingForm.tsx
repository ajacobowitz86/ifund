'use client';

import { useEffect, useMemo, useState } from 'react';
import UsAddressInput from '@/components/UsAddressInput';
import { usePpeRates } from '@/hooks/usePpeRates';
import {
  CASH_OUT_PURPOSE_OPTIONS,
  LOCK_DAY_OPTIONS,
  LOAN_PRODUCTS,
  LOAN_PRODUCT_GROUPS,
  OCCUPANCY_OPTIONS,
  PPE_REQUIRED_FIELDS,
  PROPERTY_TYPE_OPTIONS,
  SUBORDINATE_FINANCING_OPTIONS,
  allowedPropertyTypes,
  buildBestFitQuote,
  maxLtvFor,
  type CashOutPurpose,
  type LockDays,
  type LoanProductId,
  type Occupancy,
  type PropertyType,
  type SubordinateFinancing,
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
  placeholder,
  helper,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <label className="field-block">
      <div className="field-label-row">
        <span className="field-label">{label}</span>
        {helper && <span className="field-helper">{helper}</span>}
      </div>
      <div className="money-input">
        <span className="money-symbol">$</span>
        <input
          inputMode="numeric"
          placeholder={placeholder}
          value={value ? formatUsd(value) : ''}
          onChange={(event) => onChange(parseMoney(event.target.value))}
        />
      </div>
    </label>
  );
}

function PercentField({
  label,
  value,
  onChange,
  step = 0.125,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <label className="field-block">
      <span className="field-label">{label}</span>
      <div className="percent-input">
        <input
          type="number"
          step={step}
          min={0}
          max={25}
          value={value || ''}
          onChange={(event) => onChange(parseFloat(event.target.value) || 0)}
        />
        <span className="percent-symbol">%</span>
      </div>
    </label>
  );
}

const ADDRESS_CLASS =
  'w-full rounded-[6px] border border-[#d1d5db] bg-white px-3.5 py-[0.7rem] font-sans text-[0.95rem] text-brand-navy outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 transition-all';

export default function LoanPricingForm() {
  const { products, loading, error } = usePpeRates();
  const [productId, setProductId] = useState<LoanProductId>('conventional');

  // Purchase fields
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [firstTimeHomebuyer, setFirstTimeHomebuyer] = useState(false);
  const [waiveEscrow, setWaiveEscrow] = useState(false);
  const [financeUpfrontMip, setFinanceUpfrontMip] = useState(true);

  // Refinance & Cash-out fields
  const [propertyValue, setPropertyValue] = useState(500000);
  const [currentBalance, setCurrentBalance] = useState(320000);
  const [currentRate, setCurrentRate] = useState(7.25);
  const [subordinateFinancing, setSubordinateFinancing] =
    useState<SubordinateFinancing>('none');
  const [cashOutAmount, setCashOutAmount] = useState(50000);
  const [cashOutPurpose, setCashOutPurpose] =
    useState<CashOutPurpose>('home_improvement');

  // HELOC fields
  const [helocLine, setHelocLine] = useState(75000);
  const [helocDraw, setHelocDraw] = useState(25000);
  const [firstLienRate, setFirstLienRate] = useState(3.50);

  // Common PPE scenario attributes
  const [creditScore, setCreditScore] = useState(740);
  const [termMonths, setTermMonths] = useState(360);
  const [occupancy, setOccupancy] = useState<Occupancy>('primary');
  const [propertyType, setPropertyType] = useState<PropertyType>('sfr');
  const [lockDays, setLockDays] = useState<LockDays>(30);
  const [propertyAddress, setPropertyAddress] = useState('');
  const [activeTab, setActiveTab] = useState<'quote' | 'breakdown'>('quote');
  const [now, setNow] = useState<Date | null>(null);

  const product = LOAN_PRODUCTS.find((item) => item.id === productId) ?? LOAN_PRODUCTS[0];
  const requiredInfo = PPE_REQUIRED_FIELDS[productId];
  const isPurchase = productId === 'conventional' || productId === 'fha';
  const isRefi = productId === 'rate_term' || productId === 'cash_out';
  const isHeloc = productId === 'heloc';

  const occupancyChoices = OCCUPANCY_OPTIONS.filter((item) =>
    product.occupancyOptions.includes(item.id),
  );
  const availablePropertyTypes = PROPERTY_TYPE_OPTIONS.filter((item) =>
    allowedPropertyTypes(productId).includes(item.id),
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
      currentRate,
      cashOutAmount,
      cashOutPurpose,
      subordinateFinancing,
      helocLine,
      helocDraw,
      firstLienRate,
      creditScore,
      termMonths,
      occupancy,
      propertyType,
      lockDays,
      firstTimeHomebuyer,
      waiveEscrow,
      financeUpfrontMip,
    });
  }, [
    products,
    productId,
    purchasePrice,
    propertyValue,
    downPayment,
    currentBalance,
    currentRate,
    cashOutAmount,
    cashOutPurpose,
    subordinateFinancing,
    helocLine,
    helocDraw,
    firstLienRate,
    creditScore,
    termMonths,
    occupancy,
    propertyType,
    lockDays,
    firstTimeHomebuyer,
    waiveEscrow,
    financeUpfrontMip,
  ]);

  const liveLabel = now
    ? `Live • ${now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`
    : 'Live';

  // Derived calculations for real-time guidance lines
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
  const maxCashOutCap = Math.round(propertyValue * maxLtvFor('cash_out', occupancy));
  const maxAvailableCashOut = Math.max(0, maxCashOutCap - currentBalance);
  const maxHelocLine = Math.max(
    0,
    Math.round(propertyValue * maxLtvFor('heloc', occupancy) - currentBalance),
  );

  // Estimated Taxes & Homeowners Insurance (standard nationwide benchmarks)
  const estimatedTaxMonthly = Math.round((derivedValue * 0.0115) / 12);
  const estimatedInsMonthly = Math.round((derivedValue * 0.0038) / 12);
  const totalWithPiti = quote ? Math.round(quote.totalMonthly + estimatedTaxMonthly + estimatedInsMonthly) : 0;

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
      if (downPayment < minFhaDown) {
        setDownPayment(minFhaDown);
      }
      if (propertyType === 'coop') {
        setPropertyType('sfr');
      }
    }
    if (id === 'conventional' && downPayment < purchasePrice * 0.05) {
      setDownPayment(Math.round(purchasePrice * 0.2));
    }
  };

  const applyDownPaymentPercent = (percent: number) => {
    setDownPayment(Math.round(purchasePrice * percent));
  };

  const consultationHref = useMemo(() => {
    if (!quote) {
      return 'mailto:consult@ifundequity.com?subject=Lock%20rate%20%E2%80%94%20Request%20consultation';
    }
    const body = [
      `Product: ${quote.productName} (${quote.boardName})`,
      `Rate: ${formatRate(quote.interestRate)}  APR: ${formatRate(quote.apr)}`,
      `Estimated Monthly P&I: $${formatUsd(quote.totalMonthly)} (${quote.paymentNote})`,
      quote.monthlySavings ? `Estimated Monthly Savings: $${formatUsd(quote.monthlySavings)}/mo` : '',
      quote.netCashOut ? `Net Cash Out: $${formatUsd(quote.netCashOut)}` : '',
      quote.blendedRate ? `Blended Effective Rate: ${formatRate(quote.blendedRate)}` : '',
      `Property: ${propertyAddress || 'Not provided'}`,
      `Property Type: ${PROPERTY_TYPE_OPTIONS.find((t) => t.id === propertyType)?.label}`,
      `Occupancy: ${OCCUPANCY_OPTIONS.find((item) => item.id === occupancy)?.label}`,
      `Credit score: ${creditScore}`,
      `Lock period: ${lockDays} days`,
      ...quote.metrics.map((metric) =>
        `${metric.label}: ${metric.value}${metric.hint ? ` (${metric.hint})` : ''}`,
      ),
    ]
      .filter(Boolean)
      .join('\n');

    return `mailto:consult@ifundequity.com?subject=${encodeURIComponent(
      `Lock ${quote.productName} Rate — Request Consultation`,
    )}&body=${encodeURIComponent(body)}`;
  }, [quote, creditScore, occupancy, propertyType, lockDays, propertyAddress]);

  return (
    <section className="pricing-engine" aria-label="Mortgage pricing engine">
      <div className="pricing-engine__form-side">
        {/* Top Header Pill & Goal Switcher */}
        <div className="ppe-badge-row">
          <span className="ppe-pill">Optimal Blue &amp; Morty PPE</span>
          <span className="ppe-pill-sub">100% Anonymous · No Personal Info or Credit Pull</span>
        </div>

        <div className="scenario-header">
          <h2 className="scenario-title">Your scenario</h2>
          <p className="scenario-lede">
            Select your loan path and adjust key parameters for instant real-time pricing.
          </p>
        </div>

        {/* Step 1: Loan Program Selector */}
        <div className="pricer-step-section">
          <div className="pricer-step-title">
            <span className="pricer-step-number">1</span>
            <span>Select Loan Program</span>
          </div>

          <div className="product-groups">
            {LOAN_PRODUCT_GROUPS.map((group) => (
              <div key={group.id} className="product-group">
                <p className="product-group__label">{group.label}</p>
                <div className="product-grid">
                  {group.productIds.map((id) => {
                    const item = LOAN_PRODUCTS.find((p) => p.id === id);
                    if (!item) return null;
                    const isActive = productId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`choice-btn${isActive ? ' is-active' : ''}`}
                        aria-pressed={isActive}
                        onClick={() => selectProduct(item.id)}
                      >
                        <span className="choice-btn__title">{item.label}</span>
                        {item.id === 'conventional' && <span className="choice-btn__badge">Most Popular</span>}
                        {item.id === 'fha' && <span className="choice-btn__badge">3.5% Down</span>}
                        {item.id === 'rate_term' && <span className="choice-btn__badge">Lower Payment</span>}
                        {item.id === 'cash_out' && <span className="choice-btn__badge">Get Cash</span>}
                        {item.id === 'heloc' && <span className="choice-btn__badge">Keep 1st Rate</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Program requirements banner */}
          <div className="ppe-info-box">
            <div className="ppe-info-box__head">
              <span className="ppe-info-box__badge">{requiredInfo.badge}</span>
            </div>
            <p className="ppe-info-box__desc">{requiredInfo.description}</p>
          </div>
        </div>

        {/* Step 2: Loan Scenario Specific Fields */}
        <div className="pricer-step-section">
          <div className="pricer-step-title">
            <span className="pricer-step-number">2</span>
            <span>
              {isPurchase ? 'Purchase & Down Payment' : isRefi ? 'Refinance & Property Balances' : 'HELOC Equity Details'}
            </span>
          </div>

          {/* PURCHASE SPECIFIC FIELDS */}
          {isPurchase && (
            <div className="scenario-section">
              <div className="field-grid">
                <MoneyField
                  label="Purchase price"
                  value={purchasePrice}
                  onChange={(value) => {
                    setPurchasePrice(value);
                    if (downPayment > value) setDownPayment(value);
                  }}
                />
                <div>
                  <MoneyField
                    label="Down payment"
                    value={downPayment}
                    onChange={setDownPayment}
                  />
                  <div className="quick-pill-row">
                    {productId === 'fha' ? (
                      <>
                        <button
                          type="button"
                          className="quick-pill"
                          onClick={() => applyDownPaymentPercent(0.035)}
                        >
                          3.5% (Min)
                        </button>
                        <button
                          type="button"
                          className="quick-pill"
                          onClick={() => applyDownPaymentPercent(0.05)}
                        >
                          5%
                        </button>
                        <button
                          type="button"
                          className="quick-pill"
                          onClick={() => applyDownPaymentPercent(0.1)}
                        >
                          10%
                        </button>
                        <button
                          type="button"
                          className="quick-pill"
                          onClick={() => applyDownPaymentPercent(0.2)}
                        >
                          20%
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="quick-pill"
                          onClick={() => applyDownPaymentPercent(0.03)}
                        >
                          3%
                        </button>
                        <button
                          type="button"
                          className="quick-pill"
                          onClick={() => applyDownPaymentPercent(0.05)}
                        >
                          5%
                        </button>
                        <button
                          type="button"
                          className="quick-pill"
                          onClick={() => applyDownPaymentPercent(0.1)}
                        >
                          10%
                        </button>
                        <button
                          type="button"
                          className="quick-pill"
                          onClick={() => applyDownPaymentPercent(0.2)}
                        >
                          20% (No PMI)
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Visual LTV Health Gauge */}
              <div className="ltv-gauge-card">
                <div className="ltv-gauge-card__head">
                  <span className="ltv-gauge-card__loan">Base Loan: <strong>${formatUsd(derivedLoan)}</strong></span>
                  <span className={`ltv-gauge-card__tag ${derivedLtv <= 0.8 ? 'is-green' : derivedLtv <= 0.9 ? 'is-amber' : 'is-blue'}`}>
                    {Math.round(derivedLtv * 100)}% LTV {derivedLtv <= 0.8 ? '· No PMI' : derivedLtv <= 0.9 ? '· Low Down' : '· FHA 96.5%'}
                  </span>
                </div>
                <div className="ltv-bar-track">
                  <div
                    className={`ltv-bar-fill ${derivedLtv <= 0.8 ? 'is-green' : derivedLtv <= 0.9 ? 'is-amber' : 'is-blue'}`}
                    style={{ width: `${Math.min(100, Math.round(derivedLtv * 100))}%` }}
                  />
                </div>
                <div className="ltv-bar-labels">
                  <span>0% (Full Cash)</span>
                  <span className="ltv-bar-marker">80% (PMI Threshold)</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="scenario-toggles">
                {productId === 'conventional' && (
                  <>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={firstTimeHomebuyer}
                        onChange={(e) => setFirstTimeHomebuyer(e.target.checked)}
                      />
                      <span>First-time homebuyer (qualifies for 3% down conforming program)</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={waiveEscrow}
                        onChange={(e) => setWaiveEscrow(e.target.checked)}
                      />
                      <span>Waive escrow impounds (pay property taxes &amp; insurance directly)</span>
                    </label>
                  </>
                )}
                {productId === 'fha' && (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={financeUpfrontMip}
                      onChange={(e) => setFinanceUpfrontMip(e.target.checked)}
                    />
                    <span>Finance 1.75% Upfront MIP into total loan amount (Standard)</span>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* RATE & TERM REFINANCE FIELDS */}
          {productId === 'rate_term' && (
            <div className="scenario-section">
              <div className="field-grid">
                <MoneyField
                  label="Estimated property value"
                  value={propertyValue}
                  onChange={setPropertyValue}
                />
                <MoneyField
                  label="Current 1st mortgage balance (Payoff)"
                  value={currentBalance}
                  onChange={setCurrentBalance}
                />
              </div>

              <div className="field-grid" style={{ marginTop: '0.85rem' }}>
                <PercentField
                  label="Current interest rate (to compute monthly savings)"
                  value={currentRate}
                  onChange={setCurrentRate}
                />
                <label className="field-block">
                  <span className="field-label">2nd mortgage / Subordinate lien</span>
                  <select
                    className="select-input"
                    value={subordinateFinancing}
                    onChange={(e) =>
                      setSubordinateFinancing(e.target.value as SubordinateFinancing)
                    }
                  >
                    {SUBORDINATE_FINANCING_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="computed-line">
                New loan ${formatUsd(derivedLoan)} · {Math.round(derivedLtv * 100)}% LTV
                {currentRate > 0 && quote?.monthlySavings ? ` · Current rate: ${currentRate}%` : ''}
              </p>
            </div>
          )}

          {/* CASH-OUT REFINANCE FIELDS */}
          {productId === 'cash_out' && (
            <div className="scenario-section">
              <div className="field-grid">
                <MoneyField
                  label="Estimated property value"
                  value={propertyValue}
                  onChange={setPropertyValue}
                />
                <MoneyField
                  label="Current mortgage payoff balance"
                  value={currentBalance}
                  onChange={setCurrentBalance}
                />
              </div>

              <div className="extra-box">
                <p className="extra-box__title">Cash-out request &amp; purpose</p>
                <div className="field-grid">
                  <MoneyField
                    label="Cash amount needed in pocket"
                    value={cashOutAmount}
                    onChange={setCashOutAmount}
                  />
                  <label className="field-block">
                    <span className="field-label">Primary cash-out purpose</span>
                    <select
                      className="select-input"
                      value={cashOutPurpose}
                      onChange={(e) =>
                        setCashOutPurpose(e.target.value as CashOutPurpose)
                      }
                    >
                      {CASH_OUT_PURPOSE_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="computed-line" style={{ marginTop: '0.65rem' }}>
                  New total loan ${formatUsd(derivedLoan)} · {Math.round(derivedLtv * 100)}% LTV
                  (Max 80% LTV: ${formatUsd(maxCashOutCap)}) · Max cash available: ${formatUsd(maxAvailableCashOut)}
                </p>
              </div>
            </div>
          )}

          {/* HELOC FIELDS */}
          {isHeloc && (
            <div className="scenario-section">
              <div className="field-grid">
                <MoneyField
                  label="Estimated property value"
                  value={propertyValue}
                  onChange={setPropertyValue}
                />
                <MoneyField
                  label="Current 1st mortgage balance (kept in place)"
                  value={currentBalance}
                  onChange={setCurrentBalance}
                />
              </div>

              <div className="extra-box">
                <p className="extra-box__title">HELOC credit line &amp; initial draw</p>
                <div className="field-grid">
                  <MoneyField
                    label="Requested HELOC credit line"
                    value={helocLine}
                    onChange={(value) => {
                      setHelocLine(value);
                      if (helocDraw > value) setHelocDraw(value);
                    }}
                  />
                  <MoneyField
                    label="Amount to draw immediately at closing"
                    value={helocDraw}
                    onChange={setHelocDraw}
                  />
                </div>

                <div style={{ marginTop: '0.85rem' }}>
                  <PercentField
                    label="Existing 1st mortgage rate (for blended rate comparison)"
                    value={firstLienRate}
                    onChange={setFirstLienRate}
                  />
                </div>

                <p className="computed-line" style={{ marginTop: '0.65rem' }}>
                  Combined LTV {Math.round(derivedCltv * 100)}% (Max 90% CLTV) · Max line available ${formatUsd(maxHelocLine)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Credit, Lock, Occupancy & Location */}
        <div className="pricer-step-section">
          <div className="pricer-step-title">
            <span className="pricer-step-number">3</span>
            <span>Credit Tier, Lock &amp; Location</span>
          </div>

          {/* Credit score slider with quick preset buttons */}
          <div className="stack-field">
            <div className="credit-head">
              <span className="field-label" style={{ marginBottom: 0 }}>
                Credit Score (FICO Tier): <strong>{creditScore}</strong>
              </span>
              <span className="credit-score-badge">
                {creditScore >= 760 ? '★ Prime Tier (Best Rates)' : creditScore >= 720 ? '✓ Preferred Tier' : creditScore >= 680 ? 'Good Credit' : 'Standard'}
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
            <div className="credit-presets-row">
              <button type="button" className={`credit-preset-btn ${creditScore === 680 ? 'is-active' : ''}`} onClick={() => setCreditScore(680)}>680 Good</button>
              <button type="button" className={`credit-preset-btn ${creditScore === 720 ? 'is-active' : ''}`} onClick={() => setCreditScore(720)}>720 Great</button>
              <button type="button" className={`credit-preset-btn ${creditScore === 740 ? 'is-active' : ''}`} onClick={() => setCreditScore(740)}>740 Preferred</button>
              <button type="button" className={`credit-preset-btn ${creditScore === 780 ? 'is-active' : ''}`} onClick={() => setCreditScore(780)}>780+ Top Tier</button>
            </div>
          </div>

          {/* Property Type & Lock Period */}
          <div className="field-grid stack-field">
            <label className="field-block">
              <span className="field-label">Property type</span>
              <select
                className="select-input"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              >
                {availablePropertyTypes.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-block">
              <span className="field-label">Lock period</span>
              <select
                className="select-input"
                value={lockDays}
                onChange={(e) => setLockDays(Number(e.target.value) as LockDays)}
              >
                {LOCK_DAY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Term Selector */}
          {product.termOptions.length > 0 && !isHeloc && (
            <div className="stack-field">
              <label className="field-block">
                <span className="field-label">Loan term</span>
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

          {/* Occupancy */}
          <div className="stack-field">
            <p className="field-label">Property occupancy</p>
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
              <p className="computed-line">FHA government financing strictly requires owner-occupied primary residence.</p>
            )}
          </div>

          {/* Property location (Address) */}
          <div className="stack-field">
            <label className="field-block">
              <span className="field-label">Property location (Service area: NY, NJ, PA, CT, FL)</span>
              <UsAddressInput
                value={propertyAddress}
                onChange={setPropertyAddress}
                className={ADDRESS_CLASS}
              />
            </label>
          </div>
        </div>
      </div>

      {/* BEST-FIT QUOTE STICKY SIDEBAR */}
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
                  Optimal Blue Quote
                </span>
                <span className="quote-card__live">{liveLabel}</span>
              </div>
              <h3 className="quote-card__product">{quote.productName}</h3>
              <p className="quote-card__board">{quote.boardName} · {quote.scenarioSummary}</p>
              <div>
                <span className="quote-card__rate-label">Note Rate</span>
                <span className="quote-card__rate">{formatRate(quote.interestRate)}</span>
                <p className="quote-card__apr">APR {formatRate(quote.apr)}</p>
              </div>
            </header>

            <div className="quote-card__body">
              {/* Tab Selector: Quote Summary vs Payment Breakdown */}
              <div className="quote-tab-row">
                <button
                  type="button"
                  className={`quote-tab-btn ${activeTab === 'quote' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('quote')}
                >
                  Quote Summary
                </button>
                <button
                  type="button"
                  className={`quote-tab-btn ${activeTab === 'breakdown' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('breakdown')}
                >
                  Payment Breakdown (PITI)
                </button>
              </div>

              {/* Refinance savings banner */}
              {productId === 'rate_term' && quote.monthlySavings != null && quote.monthlySavings > 0 && (
                <div className="quote-highlight-banner">
                  <span className="quote-highlight-banner__icon">✓</span>
                  <div>
                    <strong>Save ${formatUsd(quote.monthlySavings)} / month</strong>
                    <p>vs your current {currentRate}% interest rate</p>
                  </div>
                </div>
              )}

              {/* HELOC blended rate banner */}
              {isHeloc && quote.blendedRate != null && (
                <div className="quote-highlight-banner quote-highlight-banner--gold">
                  <span className="quote-highlight-banner__icon">★</span>
                  <div>
                    <strong>Blended Rate: {formatRate(quote.blendedRate)}</strong>
                    <p>across 1st mortgage ({firstLienRate}%) + HELOC draw</p>
                  </div>
                </div>
              )}

              {/* Cash-out net proceeds banner */}
              {productId === 'cash_out' && quote.netCashOut != null && (
                <div className="quote-highlight-banner quote-highlight-banner--navy">
                  <span className="quote-highlight-banner__icon">$</span>
                  <div>
                    <strong>${formatUsd(quote.netCashOut)} Net Cash to You</strong>
                    <p>in pocket after points &amp; estimated fees</p>
                  </div>
                </div>
              )}

              {activeTab === 'quote' ? (
                <>
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
                </>
              ) : (
                /* Interactive Payment Breakdown Tab */
                <div className="payment-breakdown-box">
                  <div className="payment-breakdown-row">
                    <span>Principal &amp; Interest</span>
                    <strong>${formatUsd(Math.round(quote.monthlyPayment))}</strong>
                  </div>
                  {quote.monthlyInsurance > 0 && (
                    <div className="payment-breakdown-row is-highlight">
                      <span>{productId === 'fha' ? 'FHA Monthly MIP' : 'Private Mortgage Insurance (PMI)'}</span>
                      <strong>${formatUsd(Math.round(quote.monthlyInsurance))}</strong>
                    </div>
                  )}
                  <div className="payment-breakdown-row">
                    <span>Est. Property Taxes</span>
                    <strong>${formatUsd(estimatedTaxMonthly)}</strong>
                  </div>
                  <div className="payment-breakdown-row">
                    <span>Est. Homeowners Insurance</span>
                    <strong>${formatUsd(estimatedInsMonthly)}</strong>
                  </div>
                  <div className="payment-breakdown-total">
                    <span>Total Est. Monthly (PITI)</span>
                    <strong className="payment-breakdown-total__amount">${formatUsd(totalWithPiti)}</strong>
                  </div>
                  <p className="payment-breakdown-note">Taxes &amp; insurance are estimates based on standard county averages.</p>
                </div>
              )}

              <a className="quote-card__cta" href={consultationHref}>
                Lock This Rate — Request Consultation
              </a>
              <p className="quote-card__disclaimer">
                Optimal Blue PPE scenario rates are indicative estimates for illustration only and do not constitute a commitment to lend. Final pricing is subject to property appraisal, title, documentation, and investor underwriting guidelines. Equal Housing Lender.
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
