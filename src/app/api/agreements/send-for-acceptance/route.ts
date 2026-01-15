import { NextResponse } from "next/server";
import { sendForAcceptance } from "@/core/agreements/handlers/sendForAcceptance";

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

  let agreementId: string | undefined;

  try {
    const body = await req.json();
    agreementId = body?.agreementId;
  } catch {
    // body was empty or invalid JSON
  }

  if (!agreementId) {
    return NextResponse.json(
      { error: "agreementId is required" },
      { status: 400 }
    );
  }

  await sendForAcceptance({
    agreementId,
    actorId,
  });

  return NextResponse.json({ success: true });
}
