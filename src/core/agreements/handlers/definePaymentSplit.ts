import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";
import { assertAgreementNotLocked } from "../invariants";

/**
 * Defines payment split for a milestone
 */
export async function definePaymentSplit({
  agreementId,
  milestoneId,
  amount,
  actorId,
}: {
  agreementId: string;
  milestoneId: string;
  amount: number;
  actorId: string;
}) {
  // 1️⃣ Load past events
  const events = await loadEvents(agreementId);

  // 2️⃣ Reduce state
  const state = reduceAgreement(events);

  // 3️⃣ Invariants
  assertAgreementNotLocked(state);

  if (!state.payment) {
    throw new Error("PAYMENT_NOT_DEFINED");
  }

  if (!state.milestones[milestoneId]) {
    throw new Error("MILESTONE_NOT_FOUND");
  }

  if (amount <= 0) {
    throw new Error("INVALID_SPLIT_AMOUNT");
  }

  // ❗ Prevent duplicate split for the same milestone
  if (state.paymentSplits[milestoneId]) {
    throw new Error("PAYMENT_SPLIT_ALREADY_DEFINED");
  }

  const existingTotal = Object.values(
    state.paymentSplits
  ).reduce((sum, v) => sum + v, 0);

  if (existingTotal + amount > state.payment.totalAmount) {
    throw new Error("PAYMENT_SPLIT_EXCEEDS_TOTAL");
  }

  // 4️⃣ Emit event
  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "PAYMENT_SPLIT_DEFINED",
    actorId,
    actorRole: "BRAND",
    payload: {
      milestoneId,
      amount,
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });
}
