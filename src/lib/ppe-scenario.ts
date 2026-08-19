/**
 * Optimal Blue / Morty PPE scenario inputs used to price a loan.
 * These are loan and property attributes only — strictly no borrower personal identity.
 */

import { SERVICE_STATE_CODES, SERVICE_STATE_NAMES } from "@/lib/service-states";

export type LoanProductId =
  | "conventional"
  | "fha"
  | "rate_term"
  | "cash_out"
  | "heloc";

export type Occupancy = "primary" | "second" | "investment";

export type PropertyType =
  | "sfr"
  | "pud"
  | "condo"
  | "two_to_four"
  | "coop"
  | "manufactured";

export type SubordinateFinancing = "none" | "subordinate" | "payoff";

export type CashOutPurpose =
  | "home_improvement"
  | "debt_consolidation"
  | "investment"
  | "major_expense";

export type LockDays = 15 | 30 | 45 | 60;

export const PROPERTY_TYPE_OPTIONS: Array<{
  id: PropertyType;
  label: string;
  obValue: string;
}> = [
  { id: "sfr", label: "Single-family (SFR)", obValue: "SFR" },
  { id: "pud", label: "Townhouse / PUD", obValue: "PUD" },
  { id: "condo", label: "Condominium", obValue: "Condo" },
  { id: "two_to_four", label: "2–4 Unit Multi-family", obValue: "2-4Unit" },
  { id: "coop", label: "Co-op", obValue: "Coop" },
  { id: "manufactured", label: "Manufactured home", obValue: "Manufactured" },
];

export const SUBORDINATE_FINANCING_OPTIONS: Array<{
  id: SubordinateFinancing;
  label: string;
  description: string;
}> = [
  { id: "none", label: "No 2nd mortgage", description: "First lien only" },
  { id: "subordinate", label: "Keep / subordinate 2nd", description: "Keep existing 2nd lien in place" },
  { id: "payoff", label: "Pay off 2nd into new loan", description: "Seasoned >12mo or purchase money" },
];

export const CASH_OUT_PURPOSE_OPTIONS: Array<{
  id: CashOutPurpose;
  label: string;
}> = [
  { id: "home_improvement", label: "Home improvement & renovations" },
  { id: "debt_consolidation", label: "High-interest debt consolidation" },
  { id: "investment", label: "Real estate or business investment" },
  { id: "major_expense", label: "Major expense / Cash reserves" },
];

export const LOCK_DAY_OPTIONS: Array<{ value: LockDays; label: string }> = [
  { value: 15, label: "15-day lock" },
  { value: 30, label: "30-day lock (Standard)" },
  { value: 45, label: "45-day lock" },
  { value: 60, label: "60-day lock" },
];

export const PROPERTY_STATE_OPTIONS = SERVICE_STATE_CODES.map((code) => ({
  code,
  label: SERVICE_STATE_NAMES[code],
}));

/** Morty/Optimal Blue program floors used for pricing eligibility. */
export const PROGRAM_GUIDELINES: Record<
  LoanProductId,
  { minCredit: number; minDownPrimary: number; maxLtvPrimary: number; maxDti: number }
> = {
  conventional: { minCredit: 620, minDownPrimary: 0.03, maxLtvPrimary: 0.97, maxDti: 0.5 },
  fha: { minCredit: 580, minDownPrimary: 0.035, maxLtvPrimary: 0.965, maxDti: 0.57 },
  rate_term: { minCredit: 620, minDownPrimary: 0, maxLtvPrimary: 0.97, maxDti: 0.5 },
  cash_out: { minCredit: 620, minDownPrimary: 0, maxLtvPrimary: 0.80, maxDti: 0.5 },
  heloc: { minCredit: 660, minDownPrimary: 0, maxLtvPrimary: 0.90, maxDti: 0.5 },
};

export function allowedPropertyTypes(productId: LoanProductId): PropertyType[] {
  if (productId === "fha") {
    return ["sfr", "pud", "condo", "two_to_four", "manufactured"];
  }
  return PROPERTY_TYPE_OPTIONS.map((item) => item.id);
}

/**
 * Fields Optimal Blue & Morty require to search products & price scenarios accurately.
 * Personal identity fields (Name, SSN, DOB, Phone, Email) are strictly not required for scenario pricing.
 */
export const PPE_REQUIRED_FIELDS: Record<
  LoanProductId,
  { label: string; badge: string; description: string; items: string[] }
> = {
  conventional: {
    label: "Conventional Purchase",
    badge: "Fannie Mae / Freddie Mac Conforming PPE",
    description: "Requires purchase price, down payment, credit tier, occupancy, and property type to calculate base loan, LTV, and Fannie/Freddie LLPAs (PMI calculated if LTV > 80%).",
    items: [
      "Purchase price and down payment ($ / %)",
      "Representative FICO score (620+)",
      "Occupancy (Primary, 2nd home, or Investment)",
      "Property type (SFR, Condo, PUD, 2–4 unit)",
      "First-time homebuyer status (97% LTV eligibility)",
      "Loan term and lock period (15–60 days)",
      "Escrow impound waiver option",
      "Property state and location",
    ],
  },
  fha: {
    label: "FHA Purchase",
    badge: "HUD / Ginnie Mae Government PPE",
    description: "Requires purchase price, down payment (min 3.5%), credit tier, and property type. FHA automatically calculates 1.75% Upfront MIP and 0.55% annual MIP for owner-occupied properties.",
    items: [
      "Purchase price and 3.5% minimum down payment",
      "Representative FICO score (580+ for 3.5% down)",
      "Owner occupancy (Primary residence required)",
      "Property type (SFR, Approved Condo, PUD, 2–4 unit)",
      "Upfront MIP financing preference (1.75% financed into loan)",
      "Loan term (30-year or 15-year)",
      "Property state and location",
    ],
  },
  rate_term: {
    label: "Rate & Term Refinance",
    badge: "Optimal Blue Refinance Pricing & Savings Engine",
    description: "Requires current property value, existing 1st mortgage balance, current interest rate, and subordinate 2nd lien status to calculate new payment, LTV, and monthly rate savings.",
    items: [
      "Estimated current property / appraised value",
      "Current 1st mortgage balance to be paid off",
      "Current interest rate (to calculate monthly savings & break-even)",
      "Subordinate financing / existing 2nd mortgage status",
      "Representative FICO score",
      "Occupancy and property type",
      "New desired loan term (30, 20, 15 years)",
      "Property state and location",
    ],
  },
  cash_out: {
    label: "Cash-Out Refinance",
    badge: "Optimal Blue Equity Monetization PPE",
    description: "Requires property value, current mortgage payoff, desired cash-out amount in pocket, and cash-out purpose to calculate new combined loan amount, cash-out LLPAs, and net proceeds.",
    items: [
      "Estimated current property / appraised value",
      "Current 1st mortgage balance to be paid off",
      "Cash-out amount needed in pocket",
      "Primary cash-out purpose (Remodel, debt payoff, etc.)",
      "Representative FICO score (Cash-out LLPAs apply)",
      "Occupancy (Max 80% LTV Primary SFR, 75% 2nd home/condo, 70% Investment)",
      "New desired loan term",
      "Property state and location",
    ],
  },
  heloc: {
    label: "Home Equity Line of Credit (HELOC)",
    badge: "Stand-Alone & Piggyback 2nd Lien PPE",
    description: "Requires property value, existing 1st mortgage balance, 1st mortgage interest rate, requested line amount, and initial draw to calculate Combined LTV (CLTV) and Blended Effective Rate.",
    items: [
      "Estimated current property value",
      "Existing 1st mortgage balance (kept in place)",
      "Existing 1st mortgage rate (to compute blended interest rate)",
      "Requested HELOC credit line amount",
      "Amount to draw immediately at closing",
      "Representative FICO score (660+)",
      "Occupancy and property type",
      "Combined LTV (CLTV) within guideline limits (max 85–90%)",
    ],
  },
};

export function propertyTypeRateAdjustment(propertyType: PropertyType): number {
  switch (propertyType) {
    case "condo":
      return 0.125;
    case "coop":
      return 0.25;
    case "two_to_four":
      return 0.375;
    case "manufactured":
      return 0.375;
    default:
      return 0;
  }
}

export function lockDaysRateAdjustment(lockDays: number): number {
  if (lockDays <= 15) return -0.062;
  if (lockDays <= 30) return 0;
  if (lockDays <= 45) return 0.062;
  return 0.125;
}

export function escrowWaiverRateAdjustment(waiveEscrow: boolean): number {
  return waiveEscrow ? 0.25 : 0;
}

export function firstTimeBuyerRateAdjustment(
  productId: LoanProductId,
  firstTimeHomebuyer: boolean,
): number {
  return productId === "conventional" && firstTimeHomebuyer ? -0.062 : 0;
}

/** 2025/2026 FHFA baseline conforming limit */
export const CONFORMING_LOAN_LIMIT = 806_500;

export function jumboRateAdjustment(loanAmount: number, productId: LoanProductId): number {
  if (productId === "fha" || productId === "heloc") return 0;
  return loanAmount > CONFORMING_LOAN_LIMIT ? 0.25 : 0;
}

export function minDownPaymentPercent(
  productId: LoanProductId,
  occupancy: Occupancy,
): number {
  if (productId === "fha") return 0.035;
  if (productId !== "conventional") return 0;
  if (occupancy === "investment") return 0.15;
  if (occupancy === "second") return 0.1;
  return 0.03;
}
