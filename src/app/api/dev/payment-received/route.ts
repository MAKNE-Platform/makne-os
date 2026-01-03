import { NextResponse } from "next/server";
import { dispatchEvent } from "@/core/events/dispatcher";
import { v4 as uuid } from "uuid";

import { runAutoCompleteAgreementAgent } from "@/core/agents/auto-complete-agreement";


/**
 * DEV ONLY
 * --------
 * Simulates payout confirmation (creator received funds)
 */
export async function POST(req: Request) {
  const body = await req.json();

  const {
    agreementId,
    milestoneId,
    payoutRef = "dev_test_payout",
  } = body;

  if (!agreementId || !milestoneId) {
    return NextResponse.json(
      { error: "agreementId and milestoneId are required" },
      { status: 400 }
    );
  }

  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "PAYMENT_RECEIVED",
    actorId: "system:dev-payout",
    actorRole: "SYSTEM",
    payload: {
      milestoneId,
      payoutRef,
    },
    timestamp: new Date().toISOString(),
    version: 1,
  });


  await runAutoCompleteAgreementAgent(agreementId);

  return NextResponse.json({
    success: true,
    message: "PAYMENT_RECEIVED event emitted",
  });
}
