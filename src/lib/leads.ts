/**
 * Lead management and CRM payload structure.
 * Stores submitted applications with borrower contact details and complete pricer scenario math.
 */

import type { BestFitQuote, LoanProductId, Occupancy, PropertyType, SubordinateFinancing, CashOutPurpose } from "@/lib/ppe-rates";

export type CitizenshipStatus = "us_citizen" | "green_card" | "other";

export type BorrowerApplicationData = {
  firstName: string;
  lastName: string;
  dob: string; // MM/DD/YYYY or YYYY-MM-DD
  email: string;
  phone: string;
  citizenshipStatus: CitizenshipStatus;
  preferredContact?: "phone" | "email" | "text";
  additionalNotes?: string;
};

export type PricerScenarioSnapshot = {
  productId: LoanProductId;
  productName: string;
  boardName: string;
  interestRate: number;
  apr: number;
  monthlyPayment: number;
  monthlyInsurance: number;
  totalMonthly: number;
  estimatedTaxMonthly?: number;
  estimatedInsMonthly?: number;
  totalWithPiti?: number;
  propertyValue: number;
  purchasePrice?: number;
  downPayment?: number;
  loanAmount: number;
  ltv: number;
  cltv?: number | null;
  creditScore: number;
  termMonths: number;
  occupancy: Occupancy;
  propertyType: PropertyType;
  lockDays: number;
  propertyAddress: string;
  firstTimeHomebuyer?: boolean;
  waiveEscrow?: boolean;
  financeUpfrontMip?: boolean;
  currentBalance?: number;
  currentRate?: number;
  monthlySavings?: number | null;
  subordinateFinancing?: SubordinateFinancing;
  cashOutAmount?: number;
  cashOutPurpose?: CashOutPurpose;
  netCashOut?: number | null;
  helocLine?: number;
  helocDraw?: number;
  firstLienRate?: number;
  blendedRate?: number | null;
  metrics?: Array<{ label: string; value: string; hint?: string }>;
};

export type LeadSubmission = {
  id: string;
  referenceNumber: string;
  createdAt: string;
  source: "web_portal_pricer";
  status: "new" | "reviewing" | "contacted" | "approved";
  borrower: BorrowerApplicationData & { fullName: string };
  scenario: PricerScenarioSnapshot;
};

declare global {
  var __ifundLeadsStore: LeadSubmission[] | undefined;
}

function getStore(): LeadSubmission[] {
  if (!globalThis.__ifundLeadsStore) {
    globalThis.__ifundLeadsStore = [];
  }
  return globalThis.__ifundLeadsStore;
}

export function generateLeadReference(): string {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `IF-2026-${randomPart}`;
}

export async function saveLead(
  borrower: BorrowerApplicationData,
  scenario: PricerScenarioSnapshot,
): Promise<LeadSubmission> {
  const referenceNumber = generateLeadReference();
  const lead: LeadSubmission = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    referenceNumber,
    createdAt: new Date().toISOString(),
    source: "web_portal_pricer",
    status: "new",
    borrower: {
      ...borrower,
      fullName: `${borrower.firstName.trim()} ${borrower.lastName.trim()}`,
    },
    scenario,
  };

  const store = getStore();
  store.unshift(lead);

  // If external CRM webhook URL is configured, forward lead asynchronously
  const crmWebhookUrl = process.env.CRM_LEAD_WEBHOOK_URL;
  if (crmWebhookUrl) {
    try {
      void fetch(crmWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch {
      // Non-blocking CRM webhook dispatch
    }
  }

  return lead;
}

export function getRecentLeads(limit = 20): LeadSubmission[] {
  return getStore().slice(0, limit);
}
