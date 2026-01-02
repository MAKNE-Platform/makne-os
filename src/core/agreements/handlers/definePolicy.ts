import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";
import { assertAgreementNotLocked } from "../invariants";

/**
 * Defines agreement policy (cancellation, revisions, disputes)
 */
export async function definePolicy({
  agreementId,
  cancellationAllowed,
  cancellationWindowDays,
  revisionLimit,
  disputeResolution,
  actorId,
}: {
  agreementId: string;
  cancellationAllowed: boolean;
  cancellationWindowDays?: number;
  revisionLimit: number;
  disputeResolution: "PLATFORM" | "ARBITRATION";
  actorId: string;
}) {
  // 1️⃣ Load past events
  const events = await loadEvents(agreementId);

  // 2️⃣ Reduce state
  const state = reduceAgreement(events);

  // 3️⃣ Enforce invariants
  assertAgreementNotLocked(state);

  if (revisionLimit < 0) {
    throw new Error("INVALID_REVISION_LIMIT");
  }

  if (
    cancellationAllowed &&
    (cancellationWindowDays === undefined ||
      cancellationWindowDays < 0)
  ) {
    throw new Error("INVALID_CANCELLATION_WINDOW");
  }

  // 4️⃣ Emit event
  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "POLICY_DEFINED",
    actorId,
    actorRole: "BRAND",
    payload: {
      cancellationAllowed,
      cancellationWindowDays,
      revisionLimit,
      disputeResolution,
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });
}
