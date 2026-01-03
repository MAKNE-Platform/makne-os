import { dispatchEvent } from "@/core/events/dispatcher";
import { loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "@/core/agreements/aggregate";
import { assertCanStartExecution } from "@/core/agreements/invariants";
import { v4 as uuid } from "uuid";

export async function startExecution({
  agreementId,
  actorId,
  actorRole,
}: {
  agreementId: string;
  actorId: string;
  actorRole: "BRAND" | "SYSTEM";
}) {
  const pastEvents = await loadEvents(agreementId);
  const state = reduceAgreement(pastEvents);

  assertCanStartExecution(state);

  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "EXECUTION_STARTED",
    actorId,
    actorRole,
    payload: {},
    timestamp: new Date().toISOString(),
    version: 1,
  });
}
