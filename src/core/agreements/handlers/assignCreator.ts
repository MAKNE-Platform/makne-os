import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";
import { assertAgreementNotLocked } from "../invariants";

/**
 * Assigns a creator to an agreement (supports group collab)
 */
export async function assignCreator({
  agreementId,
  creatorId,
  actorId,
}: {
  agreementId: string;
  creatorId: string;
  actorId: string;
}) {
  // 1️⃣ Load past events
  const events = await loadEvents(agreementId);

  // 2️⃣ Reduce state
  const state = reduceAgreement(events);

  // 3️⃣ Invariants
  assertAgreementNotLocked(state);

  if (state.creatorIds.includes(creatorId)) {
    throw new Error("CREATOR_ALREADY_ASSIGNED");
  }

  // 4️⃣ Emit event
  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "AGREEMENT_PARTY_ASSIGNED",
    actorId,
    actorRole: "BRAND",
    payload: {
      role: "CREATOR",
      creatorId,
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });
}
