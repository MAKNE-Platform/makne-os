import { NextResponse } from "next/server";
import { releasePayment } from "@/core/agreements/handlers/releasePayment";

import {
  getCurrentUser,
  requireAuth,
  requireRole,
} from "@/core/auth/contract";

export async function POST(req: Request) {
  const body = await req.json();

  const user = await getCurrentUser();
  requireAuth(user);
  requireRole(user, "BRAND");
  const actorId = user.userId;

  try {
    await releasePayment({
      agreementId: body.agreementId,
      milestoneId: body.milestoneId,
      amount: body.amount,
      actorId,
    });

    return NextResponse.json({ status: "OK" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "PAYMENT_RELEASE_FAILED" },
      { status: 400 }
    );
  }
}
