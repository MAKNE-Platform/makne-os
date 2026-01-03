import { loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "@/core/agreements/aggregate";

export async function getAgreementState(agreementId: string) {
  const events = await loadEvents(agreementId);
  const state = reduceAgreement(events);

  return state;
}

export async function getAgreementTimeline(agreementId: string) {
  const events = await loadEvents(agreementId);

  return events.map((e) => ({
    eventId: e.eventId,
    type: e.type,
    actorId: e.actorId,
    actorRole: e.actorRole,
    payload: e.payload,
    timestamp: e.timestamp,
  }));
}
