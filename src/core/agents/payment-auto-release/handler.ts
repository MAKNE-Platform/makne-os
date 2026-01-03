import { loadEvents, dispatchEvent } from "@/core/events/dispatcher";
import { reduceAgreement } from "@/core/agreements/aggregate";
import { v4 as uuid } from "uuid";

export async function runPaymentAutoReleaseAgent(
  agreementId: string
) {
  const events = await loadEvents(agreementId);
  const state = reduceAgreement(events);

  if (!state.payment) return;

  for (const milestoneId of Object.keys(state.milestones)) {
    const milestone = state.milestones[milestoneId];

    if (milestone.status !== "COMPLETED") continue;

    const allocated = state.paymentSplits[milestoneId];
    const released = state.releasedPayments[milestoneId] || 0;

    if (released >= allocated) continue;

    const amountToRelease = allocated - released;

    await dispatchEvent({
      eventId: uuid(),
      agreementId,
      type: "PAYMENT_AUTO_RELEASED",
      actorId: "system",
      actorRole: "SYSTEM",
      payload: {
        milestoneId,
        amount: amountToRelease,
      },
      timestamp: new Date().toISOString(),
      version: 1,
    });
  }
}
