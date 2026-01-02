import { NextRequest, NextResponse } from "next/server";
import { dispatchEvent } from "@/core/events/dispatcher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await dispatchEvent(body);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
