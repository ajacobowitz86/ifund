/**
 * Optimal Blue / Morty PPE scenario inputs used to price a loan.
 * These are loan and property attributes only — no borrower identity.
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
  | "coop"
  | "two_to_four"
  | "manufactured";

export type LockDays = 15 | 30 | 45 | 60;

export const PROPERTY_TYPE_OPTIONS: Array<{
  id: PropertyType;
  label: string;
  obValue: string;
}> = [
  { id: "sfr", label: "Single-family", obValue: "SFR" },
  { id: "pud", label: "Townhouse / PUD", obValue: "PUD" },
  { id: "condo", label: "Condo", obValue: "Condo" },
  { id: "coop", label: "Co-op", obValue: "Coop" },
  { id: "two_to_four", label: "2–4 unit", obValue: "2-4Unit" },
  { id: "manufactured", label: "Manufactured", obValue: "Manufactured" },
];

export const LOCK_DAY_OPTIONS: Array<{ value: LockDays; label: string }> = [
  { value: 15, label: "15-day lock" },
  { value: 30, label: "30-day lock" },
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
  { minCredit: number; minDownPrimary: number; maxDti: number }
> = {
  conventional: { minCredit: 620, minDownPrimary: 0.03, maxDti: 0.5 },
  fha: { minCredit: 550, minDownPrimary: 0.035, maxDti: 0.57 },
  rate_term: { minCredit: 620, minDownPrimary: 0, maxDti: 0.5 },
  cash_out: { minCredit: 620, minDownPrimary: 0, maxDti: 0.5 },
  heloc: { minCredit: 620, minDownPrimary: 0, maxDti: 0.5 },
};

export function allowedPropertyTypes(productId: LoanProductId): PropertyType[] {
  if (productId === "fha") {
    return ["sfr", "pud", "condo", "two_to_four", "manufactured"];
  }
  return PROPERTY_TYPE_OPTIONS.map((item) => item.id);
}

/**
 * Fields Optimal Blue needs to search product & pricing for each loan type.
 * Identity fields (name, SSN, DOB, email, phone, street address) are excluded.
 */
export const PPE_REQUIRED_FIELDS: Record<
  LoanProductId,
  { label: string; items: string[] }
> = {
  conventional: {
    label: "Conventional purchase",
    items: [
      "Purchase price and down payment (loan amount / LTV)",
      "Representative FICO (620+)",
      "Occupancy (primary, second home, or investment)",
      "Property type and unit count",
      "Property state and ZIP (LLPAs — not a personal address)",
      "Term and lock period",
      "Escrow / impound waiver",
      "First-time homebuyer (for 97% LTV eligibility)",
    ],
  },
  fha: {
    label: "FHA purchase",
    items: [
      "Purchase price and down payment (3.5% minimum)",
      "Representative FICO (550+)",
      "Owner occupancy",
      "Property type and 1–4 units (co-ops are not FHA-eligible)",
      "Property state and ZIP",
      "Term and lock period",
      "Whether FHA upfront MIP is financed",
    ],
  },
  rate_term: {
    label: "Rate & term refinance",
    items: [
      "Current property / appraised value",
      "Existing first-lien unpaid principal balance",
      "Representative FICO",
      "Occupancy, property type, and units",
      "Property state and ZIP",
      "Term and lock period",
      "Escrow / impound waiver",
    ],
  },
  cash_out: {
    label: "Cash-out refinance",
    items: [
      "Current property / appraised value",
      "Existing first-lien unpaid principal balance",
      "Cash-out amount (new loan = payoff + cash out)",
      "Representative FICO",
      "Occupancy, property type, and units",
      "Property state and ZIP",
      "Term and lock period",
    ],
  },
  heloc: {
    label: "HELOC",
    items: [
      "Current property value",
      "First-lien balance (for combined LTV)",
      "Requested HELOC line and amount to draw now",
      "Representative FICO (620+)",
      "Occupancy, property type, and units",
      "Property state and ZIP",
      "Second-lien / HELOC structure",
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
      return 0.25;
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

export function unitsRateAdjustment(units: number): number {
  if (units >= 4) return 0.375;
  if (units >= 3) return 0.25;
  if (units >= 2) return 0.125;
  return 0;
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

/** 2025 FHFA baseline conforming limit — used until county-level OB limits are wired. */
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
