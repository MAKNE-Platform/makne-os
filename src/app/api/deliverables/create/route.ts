export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dispatchEvent } from "@/core/events/dispatcher";
import { v4 as uuid } from "uuid";
import { EventType } from "@/core/events/types";

import {
    getCurrentUser,
    requireAuth,
} from "@/core/auth/contract";

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

    const user = await getCurrentUser();
    requireAuth(user);

    const event = {
        eventId: uuid(),
        agreementId: body.agreementId,
        type: "DELIVERABLE_CREATED",
        actorId: user.userId,
        actorRole: user.role,
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
    } as const; 

    await dispatchEvent(event);

    return NextResponse.json({ success: true });
}
