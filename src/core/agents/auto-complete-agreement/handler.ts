import { v4 as uuid } from "uuid";
import { getDb } from "@/lib/db";
import { dispatchEvent } from "@/core/events/dispatcher";
import { shouldAutoCompleteAgreement } from "./evaluate";

import { projectAgreement } from "@/core/agreements/read-model";
import { projectMilestones } from "@/core/milestones/read-model";
import { projectDeliverables } from "@/core/deliverables/read-model";

export async function runAutoCompleteAgreementAgent(
    agreementId: string
) {
    const db = await getDb();


    // 1. Load all events for agreement
    const events = await db
        .collection("events")
        .find({ agreementId })
        .sort({ timestamp: 1 })
        .toArray();

    if (events.length === 0) return;

    // 2. Derive current read models
    const agreement = projectAgreement(events);
    const milestones = projectMilestones(events);
    const deliverables = projectDeliverables(events);

    // 3. Decide
    const shouldComplete = shouldAutoCompleteAgreement({
        agreement,
        milestones,
        deliverables,
    });

    if (!shouldComplete) return;

    // Idempotency guard — Do not auto-complete twice
    // this operation can be performed multiple times without changing the result 
    const alreadyCompleted = events.some(
        (e) => e.type === "AGREEMENT_AUTO_COMPLETED"
    );

    if (alreadyCompleted) {
        console.log(
            `[AUTO-COMPLETE] Agreement ${agreementId} already auto-completed. Skipping.`
        );
        return;
    }

    // 4. Emit system event via dispatcher
    await dispatchEvent({
        eventId: uuid(),
        type: "AGREEMENT_AUTO_COMPLETED",
        agreementId,
        payload: {
            reason: "ALL_MILESTONES_COMPLETED",
        },
        timestamp: new Date().toISOString(),
        version: 1,

        // this is required by BaseEvent as agents are also considered to have roles (if no role -> no permissions -> errors)
        actorId: "system:auto-complete-agent",
        actorRole: "SYSTEM",
    });
}
