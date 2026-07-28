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
  /** Conventional / government / jumbo / arm / nonqm */
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
    id: "va-30",
    product: "VA 30-Yr",
    rate: 5.99,
    change: -0.02,
    termMonths: 360,
    aprSpread: 0.11,
    isVa: true,
    category: "government",
  },
  {
    id: "va-15",
    product: "VA 15-Yr",
    rate: 5.625,
    change: -0.015,
    termMonths: 180,
    aprSpread: 0.13,
    isVa: true,
    category: "government",
  },
  {
    id: "usda-30",
    product: "USDA 30-Yr",
    rate: 6.05,
    change: 0.005,
    termMonths: 360,
    aprSpread: 0.15,
    isVa: false,
    category: "government",
  },
  {
    id: "jumbo-30",
    product: "Jumbo 30-Yr",
    rate: 6.49,
    change: 0.01,
    termMonths: 360,
    aprSpread: 0.12,
    isVa: false,
    category: "jumbo",
  },
  {
    id: "arm-5-6",
    product: "5/6 ARM",
    rate: 5.875,
    change: -0.025,
    termMonths: 360,
    aprSpread: 1.015,
    isVa: false,
    category: "arm",
  },
  {
    id: "arm-7-6",
    product: "7/6 ARM",
    rate: 5.99,
    change: -0.015,
    termMonths: 360,
    aprSpread: 0.9,
    isVa: false,
    category: "arm",
  },
  {
    id: "arm-10-6",
    product: "10/6 ARM",
    rate: 6.125,
    change: 0.0,
    termMonths: 360,
    aprSpread: 0.75,
    isVa: false,
    category: "arm",
  },
  {
    id: "bank-stmt-30",
    product: "Bank Statement 30-Yr",
    rate: 7.125,
    change: 0.02,
    termMonths: 360,
    aprSpread: 0.2,
    isVa: false,
    category: "nonqm",
  },
  {
    id: "nonqm-30",
    product: "Non-QM 30-Yr",
    rate: 7.375,
    change: 0.015,
    termMonths: 360,
    aprSpread: 0.22,
    isVa: false,
    category: "nonqm",
  },
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
  if (creditScore >= 760) return 0;
  if (creditScore >= 740) return 0.125;
  if (creditScore >= 700) return 0.25;
  if (creditScore >= 660) return 0.5;
  return 0.75;
}

export type CalculatorOption = {
  productName: string;
  interestRate: number;
  apr: number;
  monthlyPayment: number;
  termMonths: number;
};

/**
 * Build personalized options from the cached PPE board + loan inputs.
 * No PPE POST — monthly payments are calculated locally from board rates.
 */
export function buildCalculatorOptions(input: {
  products: PpeProduct[];
  loanAmount: number;
  creditScore: number;
  isVaLoan: boolean;
}): CalculatorOption[] {
  const adjustment = creditScoreRateAdjustment(input.creditScore);

  const filtered = input.products.filter((product) => {
    if (input.isVaLoan) return product.isVa;
    // Non-VA path: skip VA-only products; keep mainstream fixed/ARM/gov
    return !product.isVa && product.category !== "heloc";
  });

  const pool =
    filtered.length > 0
      ? filtered
      : input.products.filter((p) => p.category === "conventional").slice(0, 3);

  return pool.slice(0, 6).map((product) => {
    const interestRate = roundRate(product.rate + adjustment);
    const apr = roundRate(interestRate + product.aprSpread);
    const monthlyPayment = calculateMonthlyPayment(
      input.loanAmount,
      interestRate,
      product.termMonths,
    );

    return {
      productName: product.product,
      interestRate,
      apr,
      monthlyPayment,
      termMonths: product.termMonths,
    };
  });
}

function roundRate(value: number): number {
  return Math.round(value * 1000) / 1000;
}
