export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dispatchEvent } from "@/core/events/dispatcher";
import { v4 as uuid } from "uuid";
import { runAutoReleaseAgent } from "@/core/agents/autoRelease.agent";

import {
  getCurrentUser,
  requireAuth,
} from "@/core/auth/contract";

/**
 * Reviewer intent (INPUT)
 */
type DeliverableDecision =
  | "ACCEPT"
  | "REJECT"
  | "PARTIAL";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  requireAuth(user);

  const body = await req.json();

  const decision = body.decision as DeliverableDecision;

  if (
    decision !== "ACCEPT" &&
    decision !== "REJECT" &&
    decision !== "PARTIAL"
  ) {
    return NextResponse.json(
      { error: "Invalid deliverable decision" },
      { status: 400 }
    );
  }

  /**
   * Map decision → domain event (FACT)
   */
  const eventType =
    decision === "ACCEPT"
      ? "DELIVERABLE_ACCEPTED"
      : decision === "REJECT"
      ? "DELIVERABLE_REJECTED"
      : "DELIVERABLE_PARTIALLY_ACCEPTED";

  const event = {
    eventId: uuid(),
    agreementId: body.agreementId,
    type: eventType,
    actorId: user.userId,
    actorRole: user.role,
    payload: {
      deliverableId: body.deliverableId,
      reason: body.reason ?? null,
    },
    timestamp: new Date().toISOString(),
    version: 1,
  } as const; // ✅ CRITICAL

  await dispatchEvent(event);

  // 🔁 SYSTEM AGENT TRIGGER
  await runAutoReleaseAgent(body.agreementId);

  return NextResponse.json({ success: true });
}
