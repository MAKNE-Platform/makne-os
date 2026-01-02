import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { dispatchEvent } from "@/core/events/dispatcher";

export async function POST() {
  // TODO: replace with real auth
  const actorId = "user_123";
  const actorRole = "BRAND";

  const agreementId = uuid();

  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "AGREEMENT_CREATED",
    actorId,
    actorRole,
    payload: {
      agreementId,
      brandId: actorId,
      createdBy: "BRAND",
    },
    timestamp: new Date().toISOString(),
    version: 1,
  });

  return NextResponse.json({
    agreementId,
    status: "DRAFT",
  });
}
