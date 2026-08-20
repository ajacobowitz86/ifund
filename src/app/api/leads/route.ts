import { NextResponse } from "next/server";
import {
  saveLead,
  getRecentLeads,
  type BorrowerApplicationData,
  type PricerScenarioSnapshot,
} from "@/lib/leads";

/**
 * POST /api/leads
 * Step 2: Creates a new borrower application lead with pricer calculations attached for the CRM.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      borrower: BorrowerApplicationData;
      scenario: PricerScenarioSnapshot;
    };

    if (!body || !body.borrower) {
      return NextResponse.json(
        { message: "Borrower information is required." },
        { status: 400 },
      );
    }

    const { firstName, lastName, dob, email, phone, citizenshipStatus } =
      body.borrower;

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { message: "First and last name are required." },
        { status: 400 },
      );
    }

    if (!dob?.trim()) {
      return NextResponse.json(
        { message: "Date of birth is required." },
        { status: 400 },
      );
    }

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { message: "A valid email address is required." },
        { status: 400 },
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { message: "A phone number is required." },
        { status: 400 },
      );
    }

    if (!citizenshipStatus) {
      return NextResponse.json(
        { message: "Residency status (US Citizen or Green Card) is required." },
        { status: 400 },
      );
    }

    const lead = await saveLead(body.borrower, body.scenario);

    return NextResponse.json(
      {
        success: true,
        message: "Your application was submitted successfully.",
        referenceNumber: lead.referenceNumber,
        leadId: lead.id,
        lead,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while saving your application. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/leads
 * Retrieve recent submitted leads (for CRM inspection / testing).
 */
export async function GET() {
  const leads = getRecentLeads(25);
  return NextResponse.json({
    total: leads.length,
    leads,
  });
}
