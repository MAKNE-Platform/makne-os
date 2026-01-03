import { loadEvents, dispatchEvent } from "@/core/events/dispatcher";
import { reduceAgreement } from "@/core/agreements/aggregate";
import { assertCanSubmitDeliverable } from "@/core/agreements/invariants";
import { v4 as uuid } from "uuid";

export async function submitDeliverable({
  agreementId,
  deliverableId,
  submissionUrl,
  actorId,
}: {
  agreementId: string;
  deliverableId: string;
  submissionUrl: string;
  actorId: string;
}) {
  const events = await loadEvents(agreementId);
  const state = reduceAgreement(events);

  if (!state.creatorIds.includes(actorId)) {
    throw new Error("ONLY_CREATOR_CAN_SUBMIT");
  }

  assertCanSubmitDeliverable(state, deliverableId);

  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "DELIVERABLE_SUBMITTED",
    actorId,
    actorRole: "CREATOR",
    payload: {
      deliverableId,
      submissionUrl,
    },
    timestamp: new Date().toISOString(),
    version: 1,
  });
}
