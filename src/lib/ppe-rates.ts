/**
 * PPE live product rates — fetched at most once per 24 hours.
 * Calculator uses these cached rates to compute monthly payments locally.
 */

export const PPE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export type RateDirection = "up" | "down" | "flat";

export type PpeProduct = {
  id: string;
  product: string;
  /** Nominal interest rate (annual %), from PPE board */
  rate: number;
  /** Day-over-day change in rate points */
  change: number;
  /** Loan term in months for amortization */
  termMonths: number;
  /** Approximate APR spread over note rate (points) for display */
  aprSpread: number;
  /** Whether this product is VA-eligible */
  isVa: boolean;
  /** Conventional / government / jumbo / arm / nonqm / heloc */
  category: "conventional" | "government" | "jumbo" | "arm" | "nonqm" | "heloc";
};

export type PpeRatesPayload = {
  products: PpeProduct[];
  fetchedAt: string;
  expiresAt: string;
  source: "ppe" | "ppe-cache" | "baseline";
  cacheTtlHours: number;
};

/** Baseline PPE product board used until Optimal Blue credentials are wired. */
export const BASELINE_PPE_PRODUCTS: PpeProduct[] = [
  {
    id: "conv-30",
    product: "Conventional 30-Yr",
    rate: 6.375,
    change: -0.015,
    termMonths: 360,
    aprSpread: 0.116,
    isVa: false,
    category: "conventional",
  },
  {
    id: "conv-15",
    product: "Conventional 15-Yr",
    rate: 5.75,
    change: -0.01,
    termMonths: 180,
    aprSpread: 0.142,
    isVa: false,
    category: "conventional",
  },
  {
    id: "fha-30",
    product: "FHA 30-Yr",
    rate: 6.125,
    change: 0.0,
    termMonths: 360,
    aprSpread: 0.18,
    isVa: false,
    category: "government",
  },
  {
    id: "fha-15",
    product: "FHA 15-Yr",
    rate: 5.625,
    change: -0.01,
    termMonths: 180,
    aprSpread: 0.2,
    isVa: false,
    category: "government",
  },
  {
    id: "conv-refi-30",
    product: "Rate & Term Refi 30-Yr",
    rate: 6.5,
    change: -0.01,
    termMonths: 360,
    aprSpread: 0.125,
    isVa: false,
    category: "conventional",
  },
  {
    id: "conv-refi-15",
    product: "Rate & Term Refi 15-Yr",
    rate: 5.875,
    change: -0.005,
    termMonths: 180,
    aprSpread: 0.15,
    isVa: false,
    category: "conventional",
  },
  {
    id: "conv-cashout-30",
    product: "Cash-Out Refi 30-Yr",
    rate: 6.625,
    change: 0.0,
    termMonths: 360,
    aprSpread: 0.14,
    isVa: false,
    category: "conventional",
  },
  {
    id: "conv-cashout-15",
    product: "Cash-Out Refi 15-Yr",
    rate: 6.0,
    change: 0.005,
    termMonths: 180,
    aprSpread: 0.16,
    isVa: false,
    category: "conventional",
  },
  {
    id: "heloc",
    product: "HELOC",
    rate: 7.99,
    change: 0.01,
    termMonths: 120,
    aprSpread: 0.0,
    isVa: false,
    category: "heloc",
  },
];

export type LoanProductId =
  | "conventional"
  | "fha"
  | "rate_term"
  | "cash_out"
  | "heloc";

export type Occupancy = "primary" | "second" | "investment";

export type TermOption = {
  value: number;
  label: string;
};

export type LoanProductConfig = {
  id: LoanProductId;
  label: string;
  defaultTermMonths: number;
  termOptions: TermOption[];
  points: number;
  needed: string;
  occupancyOptions: Occupancy[];
  interestOnly: boolean;
};

const PURCHASE_TERMS: TermOption[] = [
  { value: 360, label: "30-year" },
  { value: 240, label: "20-year" },
  { value: 180, label: "15-year" },
];

const HELOC_TERMS: TermOption[] = [
  { value: 120, label: "10-year draw / 20-year repay" },
];

export const LOAN_PRODUCTS: LoanProductConfig[] = [
  {
    id: "conventional",
    label: "Conventional Mortgage",
    defaultTermMonths: 360,
    termOptions: PURCHASE_TERMS,
    points: 1,
    needed:
      "Purchase price, down payment, credit score, occupancy, term, and property address.",
    occupancyOptions: ["primary", "second", "investment"],
    interestOnly: false,
  },
  {
    id: "fha",
    label: "FHA Mortgage",
    defaultTermMonths: 360,
    termOptions: PURCHASE_TERMS,
    points: 0,
    needed:
      "Purchase price, down payment (3.5% minimum), credit score, owner occupancy, term, and property address.",
    occupancyOptions: ["primary"],
    interestOnly: false,
  },
  {
    id: "rate_term",
    label: "Rate & Term Refinance",
    defaultTermMonths: 360,
    termOptions: PURCHASE_TERMS,
    points: 1,
    needed:
      "Current property value, existing loan balance, credit score, occupancy, term, and property address.",
    occupancyOptions: ["primary", "second", "investment"],
    interestOnly: false,
  },
  {
    id: "cash_out",
    label: "Cash-Out Refinance",
    defaultTermMonths: 360,
    termOptions: PURCHASE_TERMS,
    points: 1,
    needed:
      "Current property value, existing loan balance, cash-out amount, credit score, occupancy, term, and property address.",
    occupancyOptions: ["primary", "second", "investment"],
    interestOnly: false,
  },
  {
    id: "heloc",
    label: "HELOC",
    defaultTermMonths: 120,
    termOptions: HELOC_TERMS,
    points: 0,
    needed:
      "Current property value, first-mortgage balance, requested line amount, draw amount, credit score, occupancy, and property address.",
    occupancyOptions: ["primary", "second", "investment"],
    interestOnly: true,
  },
];

export const OCCUPANCY_OPTIONS: Array<{ id: Occupancy; label: string }> = [
  { id: "primary", label: "Primary residence" },
  { id: "second", label: "Second home" },
  { id: "investment", label: "Investment" },
];

export function directionFromChange(change: number): RateDirection {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "flat";
}

/**
 * Standard amortizing monthly payment (P&I).
 * ratePercent is annual nominal interest rate (e.g. 6.375).
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (!Number.isFinite(principal) || principal <= 0) return 0;
  if (!Number.isFinite(termMonths) || termMonths <= 0) return 0;

  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) {
    return roundMoney(principal / termMonths);
  }

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return roundMoney((principal * monthlyRate * factor) / (factor - 1));
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Light credit adjustment until full PPE scenario pricing is connected. */
export function creditScoreRateAdjustment(creditScore: number): number {
  if (!Number.isFinite(creditScore)) return 0.375;
  if (creditScore >= 780) return -0.125;
  if (creditScore >= 760) return -0.062;
  if (creditScore >= 740) return 0;
  if (creditScore >= 720) return 0.125;
  if (creditScore >= 700) return 0.25;
  if (creditScore >= 680) return 0.375;
  if (creditScore >= 640) return 0.5;
  return 0.75;
}

export function occupancyRateAdjustment(
  occupancy: Occupancy,
  productId: LoanProductId,
): number {
  if (productId === "fha") return 0;
  if (occupancy === "second") return 0.25;
  if (occupancy === "investment") return 0.375;
  return 0;
}

export function ltvRateAdjustment(ltv: number): number {
  if (!Number.isFinite(ltv) || ltv <= 0) return 0;
  if (ltv <= 0.6) return -0.25;
  if (ltv <= 0.7) return -0.125;
  if (ltv <= 0.8) return 0;
  if (ltv <= 0.85) return 0.125;
  if (ltv <= 0.9) return 0.375;
  return 0.625;
}

export function calculateInterestOnlyPayment(
  principal: number,
  annualRatePercent: number,
): number {
  if (!Number.isFinite(principal) || principal <= 0) return 0;
  return roundMoney((principal * annualRatePercent) / 100 / 12);
}

export function maxLtvFor(productId: LoanProductId, occupancy: Occupancy): number {
  if (productId === "fha") return 0.965;
  if (productId === "cash_out") {
    if (occupancy === "investment") return 0.7;
    if (occupancy === "second") return 0.75;
    return 0.8;
  }
  if (productId === "heloc") {
    if (occupancy === "investment") return 0.75;
    if (occupancy === "second") return 0.8;
    return 0.9;
  }
  if (occupancy === "investment") return 0.85;
  if (occupancy === "second") return 0.9;
  return 0.97;
}

function sourceIdFor(productId: LoanProductId, termMonths: number): string {
  const fifteen = termMonths <= 180;
  switch (productId) {
    case "conventional":
      return fifteen ? "conv-15" : "conv-30";
    case "fha":
      return fifteen ? "fha-15" : "fha-30";
    case "rate_term":
      return fifteen ? "conv-refi-15" : "conv-refi-30";
    case "cash_out":
      return fifteen ? "conv-cashout-15" : "conv-cashout-30";
    case "heloc":
      return "heloc";
  }
}

function fhaAnnualMip(ltv: number, termMonths: number): number {
  const fifteen = termMonths <= 180;
  if (fifteen) return ltv > 0.9 ? 0.004 : 0.0015;
  return ltv > 0.9 ? 0.0055 : 0.005;
}

function conventionalPmiAnnual(ltv: number, creditScore: number): number {
  if (ltv <= 0.8) return 0;
  let annual = 0.32;
  if (ltv > 0.95) annual = 0.9;
  else if (ltv > 0.9) annual = 0.62;
  else if (ltv > 0.85) annual = 0.48;
  if (creditScore < 700) annual += 0.2;
  else if (creditScore < 740) annual += 0.1;
  else if (creditScore >= 760) annual -= 0.05;
  return Math.max(annual, 0.18);
}

function usd(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function pct(value: number): string {
  const percent = Math.round(value * 1000) / 10;
  return `${Number.isInteger(percent) ? percent.toFixed(0) : percent.toFixed(1)}%`;
}

function formatTerm(termMonths: number): string {
  if (termMonths < 36) return `${termMonths} mo`;
  const years = termMonths / 12;
  return Number.isInteger(years) ? `${years} yr` : `${years.toFixed(1)} yr`;
}

export type QuoteMetric = {
  label: string;
  value: string;
  hint?: string;
};

export type BestFitQuote = {
  productId: LoanProductId;
  productName: string;
  interestRate: number;
  apr: number;
  monthlyPayment: number;
  monthlyInsurance: number;
  totalMonthly: number;
  paymentNote: string;
  termMonths: number;
  loanAmount: number;
  propertyValue: number;
  ltv: number;
  cltv: number | null;
  maxLoanAmount: number;
  points: number;
  pointsCost: number;
  cashToClose: number;
  interestOnly: boolean;
  metrics: QuoteMetric[];
};

export function buildBestFitQuote(input: {
  products: PpeProduct[];
  productId: LoanProductId;
  purchasePrice: number;
  propertyValue: number;
  downPayment: number;
  currentBalance: number;
  cashOutAmount: number;
  helocLine: number;
  helocDraw: number;
  creditScore: number;
  termMonths: number;
  occupancy: Occupancy;
}): BestFitQuote | null {
  const config = LOAN_PRODUCTS.find((item) => item.id === input.productId);
  if (!config) return null;

  const termMonths = input.termMonths > 0 ? input.termMonths : config.defaultTermMonths;
  const sourceId = sourceIdFor(config.id, termMonths);
  const source =
    input.products.find((item) => item.id === sourceId) ??
    input.products.find((item) => item.id === "conv-30") ??
    input.products[0];

  if (!source) return null;

  const occupancy = config.occupancyOptions.includes(input.occupancy)
    ? input.occupancy
    : config.occupancyOptions[0];
  const maxLtv = maxLtvFor(config.id, occupancy);

  const purchasePrice = Math.max(0, input.purchasePrice);
  const propertyValue = Math.max(
    0,
    config.id === "conventional" || config.id === "fha"
      ? purchasePrice
      : input.propertyValue,
  );

  let loanAmount = 0;
  let upfrontMip = 0;
  let cashOutAmount: number | null = null;
  let helocLine: number | null = null;
  let helocDraw: number | null = null;
  let cltv: number | null = null;

  if (config.id === "conventional" || config.id === "fha") {
    const down = Math.min(Math.max(0, input.downPayment), purchasePrice);
    const baseLoan = Math.max(0, purchasePrice - down);
    if (config.id === "fha") {
      upfrontMip = roundMoney(baseLoan * 0.0175);
      loanAmount = roundMoney(baseLoan + upfrontMip);
    } else {
      loanAmount = roundMoney(baseLoan);
    }
  } else if (config.id === "rate_term") {
    loanAmount = roundMoney(Math.max(0, input.currentBalance));
  } else if (config.id === "cash_out") {
    cashOutAmount = roundMoney(Math.max(0, input.cashOutAmount));
    loanAmount = roundMoney(Math.max(0, input.currentBalance) + cashOutAmount);
  } else {
    helocLine = roundMoney(Math.max(0, input.helocLine));
    helocDraw = roundMoney(Math.min(Math.max(0, input.helocDraw), helocLine));
    loanAmount = helocLine;
    cltv =
      propertyValue > 0
        ? (Math.max(0, input.currentBalance) + helocLine) / propertyValue
        : 0;
  }

  const ltvBase =
    config.id === "fha"
      ? Math.max(0, purchasePrice - Math.min(Math.max(0, input.downPayment), purchasePrice))
      : loanAmount;
  const ltv = propertyValue > 0 ? ltvBase / propertyValue : 0;
  const ratioForPricing = cltv ?? ltv;
  const extraSpread = config.id === "conventional" ? 0.08 : 0;
  const ltvAdj = config.id === "fha" ? 0 : ltvRateAdjustment(ratioForPricing);

  const interestRate = roundRate(
    source.rate +
      extraSpread +
      creditScoreRateAdjustment(input.creditScore) +
      occupancyRateAdjustment(occupancy, config.id) +
      ltvAdj,
  );
  const apr = roundRate(interestRate + source.aprSpread);

  const principalAndInterest = config.interestOnly
    ? calculateInterestOnlyPayment(helocDraw ?? 0, interestRate)
    : calculateMonthlyPayment(loanAmount, interestRate, termMonths);

  let monthlyInsurance = 0;
  let pmiAnnual = 0;
  if (config.id === "fha") {
    monthlyInsurance = roundMoney(
      (loanAmount * fhaAnnualMip(ltv, termMonths)) / 12,
    );
  } else if (config.id === "conventional") {
    pmiAnnual = conventionalPmiAnnual(ltv, input.creditScore);
    monthlyInsurance = roundMoney((loanAmount * pmiAnnual) / 12);
  }

  const monthlyPayment = principalAndInterest;
  const totalMonthly = roundMoney(principalAndInterest + monthlyInsurance);
  const pointsCost = roundMoney((loanAmount * config.points) / 100);
  const closingCosts = roundMoney(loanAmount * 0.003);
  const maxLoanAmount = roundMoney(propertyValue * maxLtv);

  let cashToClose = 0;
  if (config.id === "conventional" || config.id === "fha") {
    const down = Math.min(Math.max(0, input.downPayment), purchasePrice);
    cashToClose = roundMoney(down + pointsCost + closingCosts);
  } else if (config.id === "cash_out") {
    cashToClose = roundMoney((cashOutAmount ?? 0) - pointsCost - closingCosts);
  } else {
    cashToClose = roundMoney(pointsCost + closingCosts);
  }

  const paymentNote =
    config.id === "heloc"
      ? "Interest only on amount drawn"
      : monthlyInsurance > 0
        ? config.id === "fha"
          ? "Principal, interest & MIP"
          : "Principal, interest & PMI"
        : "Principal & interest";

  const metrics = metricsForProduct({
    config,
    loanAmount,
    ltv,
    cltv,
    maxLoanAmount,
    termMonths,
    points: config.points,
    pointsCost,
    cashToClose,
    upfrontMip,
    monthlyInsurance,
    pmiAnnual,
    cashOutAmount,
    helocLine,
    helocDraw,
    currentBalance: input.currentBalance,
  });

  return {
    productId: config.id,
    productName: config.label,
    interestRate,
    apr,
    monthlyPayment,
    monthlyInsurance,
    totalMonthly,
    paymentNote,
    termMonths,
    loanAmount,
    propertyValue,
    ltv,
    cltv,
    maxLoanAmount,
    points: config.points,
    pointsCost,
    cashToClose,
    interestOnly: config.interestOnly,
    metrics,
  };
}

function metricsForProduct(input: {
  config: LoanProductConfig;
  loanAmount: number;
  ltv: number;
  cltv: number | null;
  maxLoanAmount: number;
  termMonths: number;
  points: number;
  pointsCost: number;
  cashToClose: number;
  upfrontMip: number;
  monthlyInsurance: number;
  pmiAnnual: number;
  cashOutAmount: number | null;
  helocLine: number | null;
  helocDraw: number | null;
  currentBalance: number;
}): QuoteMetric[] {
  const { config } = input;

  if (config.id === "fha") {
    return [
      { label: "Loan amount", value: usd(input.loanAmount), hint: "Includes UFMIP" },
      { label: "LTV", value: pct(input.ltv), hint: `Max ${usd(input.maxLoanAmount)}` },
      { label: "Term", value: formatTerm(input.termMonths) },
      { label: "UFMIP", value: usd(input.upfrontMip), hint: "1.75% financed" },
      { label: "Monthly MIP", value: usd(input.monthlyInsurance) },
      { label: "Cash to close", value: usd(input.cashToClose) },
    ];
  }

  if (config.id === "conventional") {
    return [
      { label: "Loan amount", value: usd(input.loanAmount) },
      { label: "LTV", value: pct(input.ltv), hint: `Max ${usd(input.maxLoanAmount)}` },
      { label: "Term", value: formatTerm(input.termMonths) },
      { label: "Points", value: input.points.toFixed(2), hint: usd(input.pointsCost) },
      {
        label: "PMI",
        value: input.monthlyInsurance > 0 ? usd(input.monthlyInsurance) : "None",
        hint: input.pmiAnnual > 0 ? `${(input.pmiAnnual * 100).toFixed(2)}% / yr` : "LTV ≤ 80%",
      },
      { label: "Cash to close", value: usd(input.cashToClose) },
    ];
  }

  if (config.id === "rate_term") {
    return [
      { label: "Loan amount", value: usd(input.loanAmount) },
      { label: "LTV", value: pct(input.ltv), hint: `Max ${usd(input.maxLoanAmount)}` },
      { label: "Term", value: formatTerm(input.termMonths) },
      { label: "Points", value: input.points.toFixed(2), hint: usd(input.pointsCost) },
      { label: "Closing costs", value: usd(input.cashToClose) },
      { label: "Payoff", value: usd(input.currentBalance), hint: "Current balance" },
    ];
  }

  if (config.id === "cash_out") {
    return [
      { label: "Loan amount", value: usd(input.loanAmount) },
      { label: "LTV", value: pct(input.ltv), hint: `Max ${usd(input.maxLoanAmount)}` },
      { label: "Term", value: formatTerm(input.termMonths) },
      { label: "Cash out", value: usd(input.cashOutAmount ?? 0) },
      { label: "Points", value: input.points.toFixed(2), hint: usd(input.pointsCost) },
      {
        label: "Net cash out",
        value: usd(input.cashToClose),
        hint: "After points & costs",
      },
    ];
  }

  const available = Math.max(0, (input.helocLine ?? 0) - (input.helocDraw ?? 0));
  return [
    { label: "HELOC line", value: usd(input.helocLine ?? 0) },
    {
      label: "CLTV",
      value: pct(input.cltv ?? 0),
      hint: `Max ${usd(input.maxLoanAmount)}`,
    },
    { label: "Draw now", value: usd(input.helocDraw ?? 0) },
    { label: "Pay type", value: "Interest only", hint: "On amount drawn" },
    { label: "Available", value: usd(available), hint: "Remaining line" },
    { label: "First lien", value: usd(input.currentBalance) },
  ];
}

function roundRate(value: number): number {
  return Math.round(value * 1000) / 1000;
}
