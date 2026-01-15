import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { loadEvents, dispatchEvent } from "@/core/events/dispatcher";
import { reduceAgreement } from "@/core/agreements/aggregate";

import {
  getCurrentUser,
  requireAuth,
  requireRole,
} from "@/core/auth/contract";

export async function POST(req: Request) {
  const body = await req.json();
  const { agreementId, creatorId } = body;

  const user = await getCurrentUser();
  requireAuth(user);
  requireRole(user, "BRAND");

  const actorId = user.userId;
  const actorRole = user.role

  const events = await loadEvents(agreementId);
  const state = reduceAgreement(events);

  // Prevent duplicate assignment
  const alreadyAssigned = events.some(
    (e) =>
      e.type === "AGREEMENT_PARTY_ASSIGNED" &&
      (e.payload?.creatorId === creatorId ||
        e.payload?.userId === creatorId)
  );

  if (alreadyAssigned) {
    return NextResponse.json(
      { error: "CREATOR_ALREADY_ASSIGNED" },
      { status: 400 }
    );
  }

  await dispatchEvent({
    eventId: uuid(),
    agreementId,
    type: "AGREEMENT_PARTY_ASSIGNED",
    actorId,
    actorRole,
    payload: {
      creatorId,
    },
    timestamp: new Date().toISOString(),
    version: events.length + 1,
  });

  return NextResponse.json({ status: "OK" });
}
