import { NextResponse } from "next/server";
import { startExecution } from "@/core/agreements/handlers/startExecution";

export async function POST(req: Request) {
  const body = await req.json();
  const { agreementId } = body;

  // TEMP: simulate brand/system actor
  await startExecution({
    agreementId,
    actorId: "brand_1",
    actorRole: "BRAND",
  });

  return NextResponse.json({ success: true });
}
