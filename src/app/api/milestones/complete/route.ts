import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { loadEvents, dispatchEvent } from "@/core/events/dispatcher";
import { reduceAgreement } from "@/core/agreements/aggregate";

export async function POST(req: Request) {
  const body = await req.json();

  const { agreementId, milestoneId } = body;

  // TEMP auth (same pattern you already use)
  const actorId = "brand_1";
  const actorRole = "BRAND";

  const events = await loadEvents(agreementId);
  const state = reduceAgreement(events);

  // (Optional safety check)
  if (!state.milestones?.[milestoneId]) {
    return NextResponse.json(
      { error: "MILESTONE_NOT_FOUND" },
      { status: 400 }
    );
  }

  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "MILESTONE_COMPLETED",
    actorId,
    actorRole,
    payload: {
      milestoneId,
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });

  return NextResponse.json({ status: "OK" });
}
