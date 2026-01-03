import { getDb } from "@/lib/db";
import { dispatchEvent } from "@/core/events/dispatcher";
import { EventType } from "@/core/events/types";
import { projectMilestones } from "@/core/milestones/read-model";
import { v4 as uuid } from "uuid";

// ✅ ADD THIS IMPORT
import { runAutoCompleteAgreementAgent } 
  from "@/core/agents/auto-complete-agreement";

/**
 * Auto Release Agent
 * ------------------
 * Emits PAYMENT_RELEASED when a milestone is COMPLETED
 */
export async function runAutoReleaseAgent(agreementId: string) {
  const db = await getDb();

  // 1. Load all events for agreement
  const events = await db
    .collection("events")
    .find({ agreementId })
    .sort({ timestamp: 1 })
    .toArray();

  // 2. Project milestones
  const milestones = projectMilestones(events);

  for (const milestone of milestones) {
    // Only act on completed milestones
    if (milestone.status !== "COMPLETED") continue;

    // Idempotency: skip if payment already released
    const paymentAlreadyReleased = events.some(
      (e) =>
        e.type === "PAYMENT_RELEASED" &&
        e.payload?.milestoneId === milestone.milestoneId
    );

    if (paymentAlreadyReleased) continue;

    // 3. Emit PAYMENT_RELEASED
    await dispatchEvent({
      eventId: uuid(),
      agreementId,
      type: "PAYMENT_RELEASED" as EventType,
      actorId: "system:auto-release",
      actorRole: "SYSTEM",
      payload: {
        milestoneId: milestone.milestoneId,
        amount: milestone.amount,
      },
      timestamp: new Date().toISOString(),
      version: 1,
    });
  }

  
}
