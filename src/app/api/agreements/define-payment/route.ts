import { NextResponse } from "next/server";
import { definePayment } from "@/core/agreements/handlers/definePayment";

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
    currency,
    totalAmount,
    releaseMode,
    escrowRequired,
  } = await req.json();

  await definePayment({
    agreementId,
    currency,
    totalAmount,
    releaseMode,
    escrowRequired,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
