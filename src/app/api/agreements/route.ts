import { NextResponse } from "next/server";
import { dispatchEvent } from "@/core/events/dispatcher";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  // TEMP auth (as discussed)
  const actorId = "brand_1";
  const actorRole = "BRAND";

  const body = await req.json();

  const agreementId = uuid();

  const event = {
    eventId: uuid(),
    agreementId,
    type: "AGREEMENT_CREATED",
    actorId,
    actorRole,
    payload: {
      agreementId,
      brandId: actorId,
      createdBy: "BRAND",
      collaborationType: body.collaborationType ?? "INDIVIDUAL",
      acceptanceRule: body.acceptanceRule ?? "ALL_CREATORS",
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
