import { NextRequest, NextResponse } from "next/server";
import { generateDeliverables } from "@/services/ai/deliverables.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await generateDeliverables(
      body.title
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate deliverables",
      },
      { status: 500 }
    );
  }
}