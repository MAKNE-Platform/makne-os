import { NextResponse } from "next/server";
import { definePolicy } from "@/core/agreements/handlers/definePolicy";

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

  const {
    agreementId,
    cancellationAllowed,
    cancellationWindowDays,
    revisionLimit,
    disputeResolution,
  } = await req.json();

  await definePolicy({
    agreementId,
    cancellationAllowed,
    cancellationWindowDays,
    revisionLimit,
    disputeResolution,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
