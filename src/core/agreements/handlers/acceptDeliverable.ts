import { loadEvents, dispatchEvent } from "@/core/events/dispatcher";
import { reduceAgreement } from "@/core/agreements/aggregate";
import { assertCanAcceptDeliverable } from "@/core/agreements/invariants";
import { v4 as uuid } from "uuid";

export async function acceptDeliverable({
  agreementId,
  deliverableId,
  actorId,
}: {
  agreementId: string;
  deliverableId: string;
  actorId: string;
}) {
  const events = await loadEvents(agreementId);
  const state = reduceAgreement(events);

  if (actorId !== state.brandId) {
    throw new Error("ONLY_BRAND_CAN_ACCEPT");
  }

  assertCanAcceptDeliverable(state, deliverableId);

  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "DELIVERABLE_ACCEPTED",
    actorId,
    actorRole: "BRAND",
    payload: {
      deliverableId,
    },
    timestamp: new Date().toISOString(),
    version: 1,
  });
}
