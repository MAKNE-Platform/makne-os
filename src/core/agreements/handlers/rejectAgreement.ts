import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";
import { deriveAgreementState } from "../state";
import { assertAgreementNotLocked } from "../invariants";

export async function rejectAgreement({
  agreementId,
  actorId,
  reason,
}: {
  agreementId: string;
  actorId: string;
  reason: string;
}) {
  const events = await loadEvents(agreementId);
  const state = reduceAgreement(events);

  const agreementState = deriveAgreementState(
    events.map(e => ({ type: e.type }))
  );

  assertAgreementNotLocked(state);

  if (agreementState !== "NEGOTIATING") {
    throw new Error("AGREEMENT_NOT_NEGOTIATING");
  }

  if (!state.creatorIds.includes(actorId)) {
    throw new Error("CREATOR_NOT_ASSIGNED");
  }

  if (state.acceptedByCreators.includes(actorId)) {
    throw new Error("CREATOR_ALREADY_ACCEPTED");
  }

  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "AGREEMENT_REJECTED_BY_CREATOR",
    actorId,
    actorRole: "CREATOR",
    payload: {
      reason,
      rejectedAt: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });
}
