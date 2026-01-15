import { NextResponse } from "next/server";
import { startExecution } from "@/core/agreements/handlers/startExecution";
import {
  getCurrentUser,
  requireAuth,
  requireRole,
} from "@/core/auth/contract";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  requireAuth(user);
  requireRole(user, "BRAND");

  const body = await req.json();
  const { agreementId } = body;

  await startExecution({
    agreementId,
    actorId: user.userId,
    actorRole: user.role,
  });

  return NextResponse.json({ success: true });
}
