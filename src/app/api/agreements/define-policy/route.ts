import { NextResponse } from "next/server";
import { definePolicy } from "@/core/agreements/handlers/definePolicy";

export async function POST(req: Request) {
  // TODO: replace with real auth
  const actorId = "user_123";

  const {
    agreementId,
    cancellationAllowed,
    cancellationWindowDays,
    revisionLimit,
    disputeResolution,
  } = await req.json();

  await definePolicy({
    agreementId,
    cancellationAllowed,
    cancellationWindowDays,
    revisionLimit,
    disputeResolution,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
