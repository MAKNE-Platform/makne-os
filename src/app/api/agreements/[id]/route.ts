export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { deriveAgreementState } from "@/core/agreements/state";
import { EventType } from "@/core/events/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ MUST await params in your Next.js version
  const { id: agreementId } = await context.params;

  const db = await getDb();

  // 1. Load all events
  const events = await db
    .collection("events")
    .find({ agreementId })
    .sort({ _id: 1 })
    .toArray();

  if (events.length === 0) {
    return NextResponse.json(
      { error: "Agreement not found" },
      { status: 404 }
    );
  }

  // 2. Derive agreement metadata
  let title = "Untitled Agreement";
  let participants: string[] = [];
  const createdAt = events[0].timestamp;

  for (const event of events) {
    switch (event.type as EventType) {
      case "AGREEMENT_CREATED":
        title = event.payload?.title ?? title;
        break;
    }
  }

  // 3. Derive agreement state
  const state = deriveAgreementState(
    events.map((e) => ({ type: e.type }))
  );

  // 4. Return response
  return NextResponse.json({
    agreementId,
    title,
    state,
    createdAt,
    participants,
    events,
  });
}
