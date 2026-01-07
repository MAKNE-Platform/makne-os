import { getDb } from "@/lib/db";
import { BaseEventSchema, BaseEvent } from "./types";
// import { runAutoCompleteAgreementAgent } from "@/core/agents/auto-complete-agreement";
import { runAutoCompleteAgreementAgent } from "@/core/agents/auto-complete-agreement/handler";
import { runPaymentAutoReleaseAgent } from "../agents/payment-auto-release/handler";
import { runAutoCompleteMilestonesAgent } from "../agents/auto-complete-milestones/handler";

export async function loadEvents(agreementId: string) {
  const db = await getDb();

  return db
    .collection("events")
    .find({ agreementId })  
    .sort({ version: 1 })    
    .toArray();
}



export async function dispatchEvent(event: BaseEvent) {
  // 1. Validate event structure
  BaseEventSchema.parse(event);

  // 2. Get DB
  const db = await getDb();

  // 6. Persist event (IMMUTABLE WRITE)
  await db.collection("events").insertOne(event);

  // 6.5 Trigger system agents (fire-and-forget)
  runAutoCompleteAgreementAgent(event.agreementId).catch((err) => {
    console.error(
      "[AUTO-COMPLETE AGENT ERROR]",
      err
    );
  });


  // 8. Trigger system agents (POST-COMMIT)
  switch (event.type) {
    case "DELIVERABLE_ACCEPTED":
      // 1️⃣ Complete milestones if possible
      await runAutoCompleteMilestonesAgent(event.agreementId);

      // 2️⃣ Then see if agreement can complete
      await runAutoCompleteAgreementAgent(event.agreementId);

      break;
    case "DELIVERABLE_AUTO_RELEASED":
    case "MILESTONE_COMPLETED":
      // 1️⃣ Release money (if applicable)
      await runPaymentAutoReleaseAgent(event.agreementId);

      // 2️⃣ Check if agreement can auto-complete
      await runAutoCompleteAgreementAgent(event.agreementId);
      break;
  }

  return {
    success: true,
  };

}
