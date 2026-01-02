import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";
import { assertAgreementNotLocked } from "../invariants";

/**
 * Defines agreement title, description, and category
 */
export async function defineMeta({
  agreementId,
  title,
  description,
  category,
  actorId,
}: {
  agreementId: string;
  title: string;
  description?: string;
  category: string;
  actorId: string;
}) {
  // 1️⃣ Load past events
  const events = await loadEvents(agreementId);

  // 2️⃣ Reduce state
  const state = reduceAgreement(events);

  // 3️⃣ Enforce invariants
  assertAgreementNotLocked(state);

  if (!title || title.trim().length < 3) {
    throw new Error("INVALID_TITLE");
  }

  // 4️⃣ Emit event
  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "AGREEMENT_META_DEFINED",
    actorId,
    actorRole: "BRAND",
    payload: {
      title: title.trim(),
      description,
      category,
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });
}
