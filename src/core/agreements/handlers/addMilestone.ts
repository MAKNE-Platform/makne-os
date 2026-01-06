import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";
import { assertAgreementNotLocked } from "../invariants";

/**
 * Adds a milestone to an agreement
 */
export async function addMilestone({
  agreementId,
  name,
  deliverableIds,
  unlockRule,
  actorId,
}: {
  agreementId: string;
  name: string;
  deliverableIds: string[];
  unlockRule: "ALL_COMPLETED" | "ANY_COMPLETED";
  actorId: string;
}) {
  // 1️⃣ Load past events
  const events = await loadEvents(agreementId);

  // 2️⃣ Reduce current state
  const state = reduceAgreement(events);

  // 3️⃣ Enforce invariants
  assertAgreementNotLocked(state);

  if (!name || name.trim().length < 3) {
    throw new Error("INVALID_MILESTONE_NAME");
  }

  if (!deliverableIds || deliverableIds.length === 0) {
    throw new Error("NO_DELIVERABLES_LINKED");
  }

  // Ensure deliverables exist
  for (const id of deliverableIds) {
    if (!state.deliverables[id]) {
      throw new Error(`DELIVERABLE_NOT_FOUND: ${id}`);
    }
  }

  if (!["ALL_COMPLETED", "ANY_COMPLETED"].includes(unlockRule)) {
    throw new Error("INVALID_UNLOCK_RULE");
  }

  const milestoneId = uuid();

  // emit event
  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "MILESTONE_CREATED",
    actorId,
    actorRole: "BRAND",
    payload: {
      milestoneId,
      name: name.trim(),
      deliverableIds,
      unlockRule,
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });

  // ✅ ADD THIS
  return { milestoneId };

}
