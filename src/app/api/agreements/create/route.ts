import { NextResponse } from "next/server";
import { dispatchEvent } from "@/core/events/dispatcher";
import { v4 as uuid } from "uuid";

export async function POST() {
  const agreementId = uuid();

  const event = {
    eventId: uuid(),
    agreementId,
    type: "AGREEMENT_CREATED",
    actorId: "user_123",
    actorRole: "OWNER",
    payload: {
      title: "Test Agreement",
      collaborationType: "INDIVIDUAL",
    },
    timestamp: new Date().toISOString(),
    version: 1,
  };

  await dispatchEvent(event);

  return NextResponse.json({
    agreementId,
    status: "DRAFT",
  });
}
