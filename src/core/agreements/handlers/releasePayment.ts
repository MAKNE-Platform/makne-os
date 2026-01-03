import { loadEvents, dispatchEvent } from "@/core/events/dispatcher";
import { reduceAgreement } from "@/core/agreements/aggregate";
import { assertCanReleasePayment } from "@/core/agreements/invariants";
import { v4 as uuid } from "uuid";

export async function releasePayment({
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
  const events = await loadEvents(agreementId);
  const state = reduceAgreement(events);

  if (actorId !== state.brandId) {
    throw new Error("ONLY_BRAND_CAN_RELEASE_PAYMENT");
  }

  assertCanReleasePayment(state, milestoneId, amount);

  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "PAYMENT_RELEASED",
    actorId,
    actorRole: "BRAND",
    payload: {
      milestoneId,
      amount,
    },
    timestamp: new Date().toISOString(),
    version: 1,
  });
}
