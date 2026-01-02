import { NextResponse } from "next/server";
import { rejectAgreement } from "@/core/agreements/handlers/rejectAgreement";

export async function POST(req: Request) {
  // TODO: real auth
  const actorId = "creator_456";

  const { agreementId, reason } = await req.json();

  await rejectAgreement({ agreementId, actorId, reason });

  return NextResponse.json({ success: true });
}
