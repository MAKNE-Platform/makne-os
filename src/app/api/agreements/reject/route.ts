import { NextResponse } from "next/server";
import { rejectAgreement } from "@/core/agreements/handlers/rejectAgreement";

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

  const { agreementId, reason } = await req.json();

  await rejectAgreement({ agreementId, actorId, reason });

  return NextResponse.json({ success: true });
}
