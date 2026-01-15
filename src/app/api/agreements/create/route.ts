import { NextResponse } from "next/server";
import { dispatchEvent } from "@/core/events/dispatcher";
import { v4 as uuid } from "uuid";

import {
  getCurrentUser,
  requireAuth,
  requireRole,
} from "@/core/auth/contract";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  requireAuth(user);
  requireRole(user, "BRAND");

  const actorId = user.userId;
  const actorRole = user.role;

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

      // ✅ FIX: who created it (user id), not role
      createdBy: actorId,

      collaborationType:
        body.collaborationType ?? "INDIVIDUAL",
      acceptanceRule:
        body.acceptanceRule ?? "ALL_CREATORS",
    },
    timestamp: new Date().toISOString(),
    version: 1,
  } as const; // ✅ CRITICAL

  console.log("CREATE_EVENT_PAYLOAD", event.payload);

  await dispatchEvent(event);

  return NextResponse.json({
    agreementId,
    status: "DRAFT",
  });
}
