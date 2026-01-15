import { NextResponse } from "next/server";
import { acceptAgreement } from "@/core/agreements/handlers/acceptAgreement";

import {
  getCurrentUser,
  requireAuth,
  requireRole,
} from "@/core/auth/contract";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  requireAuth(user);
  requireRole(user, "CREATOR");

  const actorId = user.userId;

  const { agreementId } = await req.json();

  await acceptAgreement({ agreementId, actorId });

  return NextResponse.json({ success: true });
}
