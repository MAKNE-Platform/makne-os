import { NextResponse } from "next/server";
import { definePaymentSplit } from "@/core/agreements/handlers/definePaymentSplit";

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

  const { agreementId, milestoneId, amount } =
    await req.json();

  await definePaymentSplit({
    agreementId,
    milestoneId,
    amount,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
