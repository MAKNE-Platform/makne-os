import { getDb } from "@/lib/db";
import { dispatchEvent } from "@/core/events/dispatcher";
import { EventType } from "@/core/events/types";
import { projectMilestones } from "@/core/milestones/read-model";
import { v4 as uuid } from "uuid";

/**
 * Auto Release Agent
 * ------------------
 * Emits MILESTONE_RELEASED when conditions are met
 */
export async function runAutoReleaseAgent(
  agreementId: string
) {
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
    // Already released → skip (idempotent)
    const alreadyReleased = events.some(
      (e) =>
        e.type === "MILESTONE_RELEASED" &&
        e.payload?.milestoneId === milestone.milestoneId
    );

    if (alreadyReleased) continue;

    // Only release when derived state is RELEASED
    if (milestone.state !== "RELEASED") continue;

    // 3. Emit system event
    await dispatchEvent({
      eventId: uuid(),
      agreementId,
      type: "MILESTONE_RELEASED" as EventType,
      actorId: "system",
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
