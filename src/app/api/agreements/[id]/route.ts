export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { deriveAgreementState } from "@/core/agreements/state";
import { EventType } from "@/core/events/types";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ IMPORTANT: await params
  const { id } = await context.params;

  console.log("AGREEMENT ID FROM URL:", id);

  const db = await getDb();

  const events = await db
    .collection("events")
    .find({ agreementId: id })
    .sort({ timestamp: 1 })
    .toArray();

  if (!events.length) {
    return NextResponse.json(
      { error: "Agreement not found" },
      { status: 404 }
    );
  }

  let title = "Untitled Agreement";
  let participants: string[] = [];
  const createdAt = events[0].timestamp;

  for (const event of events) {
    switch (event.type as EventType) {
      case "AGREEMENT_CREATED":
        title = event.payload?.title ?? title;
        break;

      case "AGREEMENT_SHARED":
        participants.push(
          ...(event.payload?.invitedUserIds ?? [])
        );
        break;
    }
  }

  return NextResponse.json({
    agreementId: id,
    title,
    state: deriveAgreementState(
      events.map((e) => ({ type: e.type }))
    ),
    createdAt,
    participants,
    events
  });
}
