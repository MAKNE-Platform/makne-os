import { getDb } from "@/lib/db";
import { BaseEventSchema, BaseEvent } from "./types";
import { deriveAgreementState } from "@/core/agreements/state";
import { canEmitEvent } from "@/core/guards/transition.guard";
// import { runAutoCompleteAgreementAgent } from "@/core/agents/auto-complete-agreement";
import { runAutoCompleteAgreementAgent } from "@/core/agents/auto-complete-agreement/handler";



export async function dispatchEvent(event: BaseEvent) {
  // 1. Validate event structure
  BaseEventSchema.parse(event);

  // 2. Get DB
  const db = await getDb();

  // 3. Load existing events
  const pastEvents = await db
    .collection("events")
    .find({ agreementId: event.agreementId })
    .sort({ timestamp: 1 })
    .toArray();

  // 4. Derive current agreement state
  const currentState = deriveAgreementState(
    pastEvents.map((e) => ({ type: e.type }))
  );

  // 5. Guard transition
  if (!canEmitEvent(currentState, event.type)) {
    throw new Error(
      `Invalid transition: ${event.type} from ${currentState}`
    );
  }

  console.log("WRITING EVENT:", event);

  // 6. Persist event (IMMUTABLE WRITE)
  await db.collection("events").insertOne(event);

  // 6.5 Trigger system agents (fire-and-forget)
  runAutoCompleteAgreementAgent(event.agreementId).catch((err) => {
    console.error(
      "[AUTO-COMPLETE AGENT ERROR]",
      err
    );
  });

  // 7. Return derived state
  const newState = deriveAgreementState([
    ...pastEvents.map((e) => ({ type: e.type })),
    { type: event.type },
  ]);

  // 8. Trigger system agents (POST-COMMIT)
  switch (event.type) {
    case "DELIVERABLE_ACCEPTED":
    case "DELIVERABLE_AUTO_RELEASED":
    case "MILESTONE_COMPLETED":
      await runAutoCompleteAgreementAgent(event.agreementId);
      break;
  }

  return {
    success: true,
    state: newState,
  };

}
