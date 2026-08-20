'use client';

import React, { useState } from 'react';
import type { BestFitQuote, LoanProductId, Occupancy, PropertyType, SubordinateFinancing, CashOutPurpose } from '@/lib/ppe-rates';
import type { BorrowerApplicationData, CitizenshipStatus, LeadSubmission } from '@/lib/leads';

type ApplicationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quote: BestFitQuote | null;
  scenarioData: {
    productId: LoanProductId;
    propertyValue: number;
    purchasePrice?: number;
    downPayment?: number;
    currentBalance?: number;
    currentRate?: number;
    cashOutAmount?: number;
    cashOutPurpose?: CashOutPurpose;
    subordinateFinancing?: SubordinateFinancing;
    helocLine?: number;
    helocDraw?: number;
    firstLienRate?: number;
    creditScore: number;
    termMonths: number;
    occupancy: Occupancy;
    propertyType: PropertyType;
    lockDays: number;
    propertyAddress: string;
    firstTimeHomebuyer?: boolean;
    waiveEscrow?: boolean;
    financeUpfrontMip?: boolean;
    estimatedTaxMonthly?: number;
    estimatedInsMonthly?: number;
    totalWithPiti?: number;
  };
};

function formatUsd(val: number | undefined | null) {
  if (!val || !Number.isFinite(val)) return '$0';
  return `$${Math.round(val).toLocaleString('en-US')}`;
}

function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, '').substring(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  quote,
  scenarioData,
}: ApplicationModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [citizenshipStatus, setCitizenshipStatus] = useState<CitizenshipStatus>('us_citizen');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email' | 'text'>('phone');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<LeadSubmission | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please provide both first and last name.');
      return;
    }

    if (!dob.trim()) {
      setErrorMessage('Please enter your date of birth.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please provide a valid 10-digit phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const borrower: BorrowerApplicationData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dob: dob.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        citizenshipStatus,
        preferredContact,
        additionalNotes: additionalNotes.trim() || undefined,
      };

      const scenario = {
        productId: scenarioData.productId,
        productName: quote?.productName || 'Mortgage Loan',
        boardName: quote?.boardName || 'Optimal Blue PPE',
        interestRate: quote?.interestRate || 0,
        apr: quote?.apr || 0,
        monthlyPayment: quote?.monthlyPayment || 0,
        monthlyInsurance: quote?.monthlyInsurance || 0,
        totalMonthly: quote?.totalMonthly || 0,
        estimatedTaxMonthly: scenarioData.estimatedTaxMonthly,
        estimatedInsMonthly: scenarioData.estimatedInsMonthly,
        totalWithPiti: scenarioData.totalWithPiti,
        propertyValue: scenarioData.propertyValue,
        purchasePrice: scenarioData.purchasePrice,
        downPayment: scenarioData.downPayment,
        loanAmount: quote?.loanAmount || scenarioData.propertyValue * 0.8,
        ltv: quote?.ltv || 0.8,
        cltv: quote?.cltv,
        creditScore: scenarioData.creditScore,
        termMonths: scenarioData.termMonths,
        occupancy: scenarioData.occupancy,
        propertyType: scenarioData.propertyType,
        lockDays: scenarioData.lockDays,
        propertyAddress: scenarioData.propertyAddress || 'Not provided',
        firstTimeHomebuyer: scenarioData.firstTimeHomebuyer,
        waiveEscrow: scenarioData.waiveEscrow,
        financeUpfrontMip: scenarioData.financeUpfrontMip,
        currentBalance: scenarioData.currentBalance,
        currentRate: scenarioData.currentRate,
        monthlySavings: quote?.monthlySavings,
        subordinateFinancing: scenarioData.subordinateFinancing,
        cashOutAmount: scenarioData.cashOutAmount,
        cashOutPurpose: scenarioData.cashOutPurpose,
        netCashOut: quote?.netCashOut,
        helocLine: scenarioData.helocLine,
        helocDraw: scenarioData.helocDraw,
        firstLienRate: scenarioData.firstLienRate,
        blendedRate: quote?.blendedRate,
        metrics: quote?.metrics,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ borrower, scenario }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit application.');
      }

      setSubmittedLead(data.lead);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to submit application. Please check your connection and try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedLead?.referenceNumber) {
      void navigator.clipboard.writeText(submittedLead.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setSubmittedLead(null);
    setFirstName('');
    setLastName('');
    setDob('');
    setEmail('');
    setPhone('');
    setAdditionalNotes('');
    onClose();
  };

  return (
    <div className="app-modal-backdrop" role="dialog" aria-modal="true">
      <div className="app-modal-container">
        {/* Modal Close Button */}
        <button
          type="button"
          className="app-modal-close-btn"
          onClick={handleReset}
          aria-label="Close application modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {!submittedLead ? (
          /* ========================================================= */
          /* STEP 2: BORROWER APPLICATION FORM                         */
          /* ========================================================= */
          <div className="app-modal-content">
            {/* Modal Header */}
            <div className="app-modal-header">
              <div className="app-modal-badge-row">
                <span className="app-modal-step-badge">Step 2 of 2</span>
                <span className="app-modal-badge-text">Direct Lending Application</span>
              </div>
              <h2 className="app-modal-title">Start Your Loan Application</h2>
              <p className="app-modal-subtitle">
                Lock your custom quote and connect directly with an IFUND Senior Loan Officer.
                No hard credit pull at this step.
              </p>
            </div>

            {/* Locked Quote Scenario Summary Strip */}
            {quote && (
              <div className="app-locked-scenario-strip">
                <div className="app-locked-scenario-left">
                  <div className="app-locked-tag">Selected Quote</div>
                  <strong className="app-locked-product">{quote.productName}</strong>
                  <span className="app-locked-meta">
                    {quote.boardName} · {scenarioData.termMonths / 12}-Yr Fixed · {scenarioData.lockDays}-Day Lock
                  </span>
                </div>
                <div className="app-locked-scenario-right">
                  <div className="app-locked-figures">
                    <span className="app-locked-rate">{quote.interestRate.toFixed(3)}%</span>
                    <span className="app-locked-apr">APR {quote.apr.toFixed(3)}%</span>
                  </div>
                  <div className="app-locked-payment">
                    Est. {formatUsd(quote.totalMonthly)} / mo
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="app-form-error-banner" role="alert">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="app-modal-form">
              {/* Field 1: Name */}
              <div className="app-form-row-2">
                <label className="app-form-label-block">
                  <span className="app-form-label">
                    First Name <span className="app-required">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="app-form-input"
                    autoComplete="given-name"
                  />
                </label>
                <label className="app-form-label-block">
                  <span className="app-form-label">
                    Last Name <span className="app-required">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smith"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="app-form-input"
                    autoComplete="family-name"
                  />
                </label>
              </div>

              {/* Field 2 & 3: Date of Birth and Email */}
              <div className="app-form-row-2">
                <label className="app-form-label-block">
                  <span className="app-form-label">
                    Date of Birth <span className="app-required">*</span>
                  </span>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="app-form-input"
                    autoComplete="bday"
                  />
                  <span className="app-input-hint">For borrower age &amp; guidelines verification</span>
                </label>
                <label className="app-form-label-block">
                  <span className="app-form-label">
                    Email Address <span className="app-required">*</span>
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="john.smith@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="app-form-input"
                    autoComplete="email"
                  />
                  <span className="app-input-hint">Official rate lock &amp; disclosures will be sent here</span>
                </label>
              </div>

              {/* Field 4: Phone Number */}
              <div className="app-form-row-2">
                <label className="app-form-label-block">
                  <span className="app-form-label">
                    Phone Number <span className="app-required">*</span>
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="app-form-input"
                    autoComplete="tel"
                  />
                  <span className="app-input-hint">For quick phone / SMS rate lock confirmation</span>
                </label>

                {/* Field 5: Citizenship / Residency Status */}
                <div className="app-form-label-block">
                  <span className="app-form-label">
                    Residency / Citizenship Status <span className="app-required">*</span>
                  </span>
                  <div className="app-residency-toggle-grid">
                    <button
                      type="button"
                      className={`app-residency-btn ${citizenshipStatus === 'us_citizen' ? 'is-active' : ''}`}
                      onClick={() => setCitizenshipStatus('us_citizen')}
                    >
                      <span>🇺🇸 US Citizen</span>
                    </button>
                    <button
                      type="button"
                      className={`app-residency-btn ${citizenshipStatus === 'green_card' ? 'is-active' : ''}`}
                      onClick={() => setCitizenshipStatus('green_card')}
                    >
                      <span>🪪 Green Card</span>
                    </button>
                    <button
                      type="button"
                      className={`app-residency-btn ${citizenshipStatus === 'other' ? 'is-active' : ''}`}
                      onClick={() => setCitizenshipStatus('other')}
                    >
                      <span>🌐 Other / Visa</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferred Contact & Optional Notes */}
              <div className="app-form-row-2">
                <label className="app-form-label-block">
                  <span className="app-form-label">Preferred Contact Method</span>
                  <select
                    className="app-form-select"
                    value={preferredContact}
                    onChange={(e) =>
                      setPreferredContact(e.target.value as 'phone' | 'email' | 'text')
                    }
                  >
                    <option value="phone">Phone Call</option>
                    <option value="email">Email Disclosures</option>
                    <option value="text">SMS Text Message</option>
                  </select>
                </label>
                <label className="app-form-label-block">
                  <span className="app-form-label">Special Notes / Comments (Optional)</span>
                  <input
                    type="text"
                    placeholder="e.g. Target closing date, self-employed, etc."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="app-form-input"
                  />
                </label>
              </div>

              {/* Trust & Security Strip */}
              <div className="app-security-strip">
                <div className="app-security-item">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <div className="app-security-item">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No Hard Credit Pull Required</span>
                </div>
                <div className="app-security-item">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>Equal Housing Lender</span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="app-modal-actions">
                <button
                  type="submit"
                  disabled={submitting}
                  className="app-modal-submit-btn"
                >
                  {submitting ? (
                    <span className="app-btn-loading">
                      <span className="app-spinner" /> Submitting Application &amp; Creating Lead…
                    </span>
                  ) : (
                    <span>Submit Application &amp; Lock Scenario</span>
                  )}
                </button>
              </div>

              <p className="app-modal-terms">
                By clicking Submit, you authorize IFUND EQUITY to review your loan scenario
                and contact you regarding mortgage financing options. We will never sell your personal information.
              </p>
            </form>
          </div>
        ) : (
          /* ========================================================= */
          /* STEP 2 SUCCESS: BEAUTIFUL CONFIRMATION & CRM RECEIPT       */
          /* ========================================================= */
          <div className="app-success-content">
            <div className="app-success-header">
              <div className="app-success-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="app-success-badge">Application Received</span>
              <h2 className="app-success-title">Your Application Was Submitted Successfully!</h2>
              <p className="app-success-desc">
                Your loan scenario has been registered in the IFUND pricing CRM. A Senior Loan Officer
                is reviewing your file to confirm your rate lock.
              </p>
            </div>

            {/* Reference Card */}
            <div className="app-success-ref-card">
              <div className="app-success-ref-left">
                <span className="app-success-ref-label">Application Reference ID</span>
                <strong className="app-success-ref-number">{submittedLead.referenceNumber}</strong>
              </div>
              <button
                type="button"
                className="app-success-copy-btn"
                onClick={handleCopyRef}
              >
                {copied ? '✓ Copied to clipboard' : 'Copy Reference ID'}
              </button>
            </div>

            {/* Application Summary Box */}
            <div className="app-success-summary-grid">
              <div className="app-success-summary-box">
                <h4 className="app-summary-box-title">Borrower Information</h4>
                <div className="app-summary-list">
                  <div className="app-summary-item">
                    <span>Applicant Name:</span>
                    <strong>{submittedLead.borrower.fullName}</strong>
                  </div>
                  <div className="app-summary-item">
                    <span>Email Address:</span>
                    <strong>{submittedLead.borrower.email}</strong>
                  </div>
                  <div className="app-summary-item">
                    <span>Phone Number:</span>
                    <strong>{submittedLead.borrower.phone}</strong>
                  </div>
                  <div className="app-summary-item">
                    <span>Residency Status:</span>
                    <strong>
                      {submittedLead.borrower.citizenshipStatus === 'us_citizen'
                        ? 'US Citizen'
                        : submittedLead.borrower.citizenshipStatus === 'green_card'
                          ? 'Permanent Resident (Green Card)'
                          : 'Other / Visa'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="app-success-summary-box">
                <h4 className="app-summary-box-title">Calculated Loan Scenario</h4>
                <div className="app-summary-list">
                  <div className="app-summary-item">
                    <span>Loan Program:</span>
                    <strong>{submittedLead.scenario.productName}</strong>
                  </div>
                  <div className="app-summary-item">
                    <span>Locked Note Rate:</span>
                    <strong className="app-highlight-green">{submittedLead.scenario.interestRate.toFixed(3)}% (APR {submittedLead.scenario.apr.toFixed(3)}%)</strong>
                  </div>
                  <div className="app-summary-item">
                    <span>Est. Monthly Payment:</span>
                    <strong>{formatUsd(submittedLead.scenario.totalMonthly)} / mo</strong>
                  </div>
                  <div className="app-summary-item">
                    <span>Loan Amount &amp; LTV:</span>
                    <strong>{formatUsd(submittedLead.scenario.loanAmount)} ({Math.round(submittedLead.scenario.ltv * 100)}% LTV)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next 3-Step Flow */}
            <div className="app-next-steps-section">
              <h4 className="app-next-steps-title">What Happens Next?</h4>
              <div className="app-next-steps-grid">
                <div className="app-next-step-card">
                  <div className="app-step-num">1</div>
                  <div className="app-step-body">
                    <strong>Lead Registered in CRM</strong>
                    <p>Your Optimal Blue PPE calculations have been forwarded to the underwriting desk.</p>
                  </div>
                </div>
                <div className="app-next-step-card">
                  <div className="app-step-num">2</div>
                  <div className="app-step-body">
                    <strong>Senior Loan Officer Review</strong>
                    <p>An IFUND advisor will reach out to confirm guidelines, lock your rate, and answer questions.</p>
                  </div>
                </div>
                <div className="app-next-step-card">
                  <div className="app-step-num">3</div>
                  <div className="app-step-body">
                    <strong>Disclosures &amp; Pre-Approval</strong>
                    <p>Receive your customized loan package and fast-track pre-approval to closing.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="app-success-actions">
              <button
                type="button"
                className="app-btn-secondary"
                onClick={() => window.print()}
              >
                🖨️ Print / Save Summary
              </button>
              <button
                type="button"
                className="app-modal-submit-btn"
                onClick={handleReset}
              >
                Done · Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
