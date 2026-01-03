import { v4 as uuid } from "uuid";
import { dispatchEvent, loadEvents } from "@/core/events/dispatcher";
import { reduceAgreement } from "../aggregate";

export async function acceptAgreement({
    agreementId,
    actorId,
}: {
    agreementId: string;
    actorId: string;
}) {
    const events = await loadEvents(agreementId);
    const state = reduceAgreement(events);

    if (state.status !== "SENT") {
        throw new Error("AGREEMENT_NOT_PENDING_ACCEPTANCE");
    }

    if (!state.creatorIds.includes(actorId)) {
        throw new Error("ONLY_CREATOR_CAN_ACCEPT");
    }


    await dispatchEvent({
        eventId: uuid(),
        agreementId,
        type: "AGREEMENT_ACCEPTED_BY_CREATOR",
        actorId,
        actorRole: "CREATOR",
        payload: {
            acceptedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
        version: events.length + 1,
    });
}
