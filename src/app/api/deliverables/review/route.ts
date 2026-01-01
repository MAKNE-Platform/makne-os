export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dispatchEvent } from "@/core/events/dispatcher";
import { v4 as uuid } from "uuid";
import { runAutoReleaseAgent } from "@/core/agents/autoRelease.agent";


export async function POST(req: Request) {
    const body = await req.json();

    const decision = body.decision as EventType;

    if (
        ![
            "DELIVERABLE_ACCEPTED",
            "DELIVERABLE_REJECTED",
            "DELIVERABLE_PARTIALLY_ACCEPTED",
        ].includes(decision)
    ) {
        throw new Error("Invalid deliverable decision");
    }


    const event = {
        eventId: uuid(),
        agreementId: body.agreementId,
        type: body.decision, // ACCEPTED | REJECTED | PARTIALLY_ACCEPTED
        actorId: "reviewer_123",
        actorRole: "REVIEWER",
        payload: {
            deliverableId: body.deliverableId,
            reason: body.reason ?? null,
        },
        timestamp: new Date().toISOString(),
        version: 1,
    };

    await dispatchEvent(event);
    
    // SYSTEM AGENT TRIGGER
    await runAutoReleaseAgent(body.agreementId);


    return NextResponse.json({ success: true });
}
