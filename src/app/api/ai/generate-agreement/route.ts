import { NextRequest, NextResponse } from "next/server";
import { generateAgreement } from "@/services/ai/agreement.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const agreement = await generateAgreement(body);

    return NextResponse.json(agreement);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate agreement" },
      { status: 500 }
    );
  }
}