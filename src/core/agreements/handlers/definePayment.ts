import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";
import { assertAgreementNotLocked } from "../invariants";

/**
 * Defines payment details for an agreement
 */
export async function definePayment({
  agreementId,
  currency,
  totalAmount,
  releaseMode,
  escrowRequired,
  actorId,
}: {
  agreementId: string;
  currency: "INR" | "USD";
  totalAmount: number;
  releaseMode: "MANUAL" | "AUTO";
  escrowRequired: boolean;
  actorId: string;
}) {
  // 1️⃣ Load past events
  const events = await loadEvents(agreementId);

  // 2️⃣ Reduce current state
  const state = reduceAgreement(events);

  // 3️⃣ Enforce invariants
  assertAgreementNotLocked(state);

  if (totalAmount <= 0) {
    throw new Error("INVALID_PAYMENT_AMOUNT");
  }

  if (!["INR", "USD"].includes(currency)) {
    throw new Error("INVALID_CURRENCY");
  }

  if (!["MANUAL", "AUTO"].includes(releaseMode)) {
    throw new Error("INVALID_RELEASE_MODE");
  }

  // 4️⃣ Emit event
  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "PAYMENT_DEFINED",
    actorId,
    actorRole: "BRAND",
    payload: {
      currency,
      totalAmount,
      releaseMode,
      escrowRequired,
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });
}
