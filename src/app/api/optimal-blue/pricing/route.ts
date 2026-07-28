import { NextRequest, NextResponse } from "next/server";

type LoanPurpose = "purchase" | "rate_term" | "cash_out";

type PricingRequest = {
  loanPurpose: LoanPurpose;
  purchasePrice: number | null;
  loanAmount: number;
  creditScore: number;
  propertyAddress: string;
  cashOutAmount: number;
  isVaLoan: boolean;
};

function isValidRequest(body: unknown): body is PricingRequest {
  if (!body || typeof body !== "object") return false;

  const data = body as Partial<PricingRequest>;
  return (
    (data.loanPurpose === "purchase" ||
      data.loanPurpose === "rate_term" ||
      data.loanPurpose === "cash_out") &&
    typeof data.loanAmount === "number" &&
    Number.isFinite(data.loanAmount) &&
    typeof data.creditScore === "number" &&
    Number.isFinite(data.creditScore) &&
    typeof data.propertyAddress === "string" &&
    data.propertyAddress.trim().length > 0 &&
    typeof data.isVaLoan === "boolean"
  );
}

/**
 * Stub for Optimal Blue live pricing.
 * Replace this with a real Optimal Blue API integration when credentials are available.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!isValidRequest(body)) {
      return NextResponse.json(
        { message: "Invalid pricing request. Check required loan fields." },
        { status: 400 },
      );
    }

    const productPrefix = body.isVaLoan ? "VA" : "Conventional";

    const options = [
      {
        productName: `${productPrefix} 30-Year Fixed`,
        interestRate: 6.125,
        apr: 6.241,
        monthlyPayment: Math.round((body.loanAmount * 0.00608) * 100) / 100,
      },
      {
        productName: `${productPrefix} 15-Year Fixed`,
        interestRate: 5.5,
        apr: 5.642,
        monthlyPayment: Math.round((body.loanAmount * 0.00817) * 100) / 100,
      },
      {
        productName: `${productPrefix} 5/6 ARM`,
        interestRate: 5.875,
        apr: 6.89,
        monthlyPayment: Math.round((body.loanAmount * 0.00591) * 100) / 100,
      },
    ];

    return NextResponse.json({
      options,
      meta: {
        source: "stub",
        loanPurpose: body.loanPurpose,
        propertyAddress: body.propertyAddress,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch pricing" },
      { status: 500 },
    );
  }
}
