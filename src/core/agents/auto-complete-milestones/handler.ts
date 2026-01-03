import { v4 as uuid } from "uuid";
import { getDb } from "@/lib/db";
import { dispatchEvent } from "@/core/events/dispatcher";

import { projectMilestonesById } from "@/core/milestones/read-model";
import { projectDeliverablesById } from "@/core/deliverables/read-model";

export async function runAutoCompleteMilestonesAgent(
  agreementId: string
) {
  const db = await getDb();

  // 1️⃣ Load events
  const events = await db
    .collection("events")
    .find({ agreementId })
    .sort({ timestamp: 1 })
    .toArray();

  if (events.length === 0) return;

  // 2️⃣ Build projections (BY ID)
  const milestones = projectMilestonesById(events);
  const deliverables = projectDeliverablesById(events);

  // 3️⃣ For each milestone
  for (const milestone of Object.values(milestones)) {
    // ⛔ Idempotency: already completed
    const alreadyCompleted = events.some(
      (e) =>
        e.type === "MILESTONE_COMPLETED" &&
        e.payload?.milestoneId === milestone.milestoneId
    );

    if (alreadyCompleted) continue;

    // ⛔ Blocked milestones should not auto-complete
    if (milestone.state === "BLOCKED") continue;

    // 4️⃣ Check all deliverables accepted
    const allAccepted =
      milestone.deliverableIds.length > 0 &&
      milestone.deliverableIds.every(
        (id) => deliverables[id]?.state === "ACCEPTED"
      );

    if (!allAccepted) continue;

    // 5️⃣ Emit milestone completion
    await dispatchEvent({
      eventId: uuid(),
      agreementId,
      type: "MILESTONE_COMPLETED",
      actorId: "system:auto-complete-milestones",
      actorRole: "SYSTEM",
      payload: {
        milestoneId: milestone.milestoneId,
        reason: "ALL_DELIVERABLES_ACCEPTED",
      },
      timestamp: new Date().toISOString(),
      version: 1,
    });
  }
}
