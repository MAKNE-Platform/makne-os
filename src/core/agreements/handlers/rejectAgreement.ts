import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";

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

  if (state.status !== "SENT") {
    throw new Error("AGREEMENT_NOT_PENDING_ACCEPTANCE");
  }

  if (state.creatorId !== actorId) {
    throw new Error("ONLY_CREATOR_CAN_REJECT");
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
