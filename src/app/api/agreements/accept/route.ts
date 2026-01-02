import { NextResponse } from "next/server";
import { acceptAgreement } from "@/core/agreements/handlers/acceptAgreement";

export async function POST(req: Request) {
  // TODO: real auth
  const actorId = "creator_456";

  const { agreementId } = await req.json();

  await acceptAgreement({ agreementId, actorId });

  return NextResponse.json({ success: true });
}
