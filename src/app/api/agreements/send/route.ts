import { NextResponse } from "next/server";
import { sendForAcceptance } from "@/core/agreements/handlers/sendForAcceptance";

export async function POST(req: Request) {
  // TODO: replace with real auth
  const actorId = "user_123";

  const { agreementId } = await req.json();

  await sendForAcceptance({
    agreementId,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
