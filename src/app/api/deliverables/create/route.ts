export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dispatchEvent } from "@/core/events/dispatcher";
import { v4 as uuid } from "uuid";
import { EventType } from "@/core/events/types";

export async function POST(req: Request) {
    let body;

    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid or missing JSON body" }),
            { status: 400 }
        );
    }


    const event = {
        eventId: uuid(),
        agreementId: body.agreementId,
        type: "DELIVERABLE_CREATED" as EventType,
        actorId: "user_123",
        actorRole: "OWNER",
        payload: {
            deliverableId: uuid(),
            title: body.title,
            description: body.description,
            assignedTo: body.assignedTo,
            dueDate: body.dueDate,
            acceptanceCriteria: body.acceptanceCriteria,
        },
        timestamp: new Date().toISOString(),
        version: 1,
    };

    await dispatchEvent(event);

    return NextResponse.json({ success: true });
}
