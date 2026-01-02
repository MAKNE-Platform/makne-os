import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";
import { assertAgreementNotLocked } from "../invariants";

/**
 * Adds a deliverable to an agreement
 */
export async function addDeliverable({
  agreementId,
  name,
  platform,
  format,
  quantity,
  dueInDays,
  requiresApproval,
  actorId,
}: {
  agreementId: string;
  name: string;
  platform: string;
  format: string;
  quantity: number;
  dueInDays: number;
  requiresApproval: boolean;
  actorId: string;
}) {
  // 1️⃣ Load past events
  const events = await loadEvents(agreementId);

  // 2️⃣ Reduce current state
  const state = reduceAgreement(events);

  // 3️⃣ Enforce invariants
  assertAgreementNotLocked(state);

  if (!name || name.trim().length < 3) {
    throw new Error("INVALID_DELIVERABLE_NAME");
  }

  if (quantity <= 0) {
    throw new Error("INVALID_QUANTITY");
  }

  if (dueInDays <= 0) {
    throw new Error("INVALID_DUE_DATE");
  }

  const deliverableId = uuid();

  // 4️⃣ Emit event
  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "DELIVERABLE_CREATED",
    actorId,
    actorRole: "BRAND",
    payload: {
      deliverableId,
      name: name.trim(),
      platform,
      format,
      quantity,
      dueInDays,
      requiresApproval,
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });
}
