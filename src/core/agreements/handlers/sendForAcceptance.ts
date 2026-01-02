import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";
import {
  assertAgreementNotLocked,
  assertCanSendAgreement,
} from "../invariants";

/**
 * Locks an agreement and sends it for creator acceptance
 */
export async function sendForAcceptance({
  agreementId,
  actorId,
}: {
  agreementId: string;
  actorId: string;
}) {
  // 1️⃣ Load all past events
  const events = await loadEvents(agreementId);

  // 2️⃣ Derive full agreement state
  const state = reduceAgreement(events);

  // 3️⃣ Enforce invariants
  assertAgreementNotLocked(state);
  assertCanSendAgreement(state);

  // 4️⃣ Emit lock event
  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "AGREEMENT_SENT_FOR_ACCEPTANCE",
    actorId,
    actorRole: "BRAND",
    payload: {
      sentAt: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });
}
