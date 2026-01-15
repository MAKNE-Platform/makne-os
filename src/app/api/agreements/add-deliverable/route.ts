import { NextResponse } from "next/server";
import { addDeliverable } from "@/core/agreements/handlers/addDeliverable";

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

  const deliverableId = await addDeliverable({
    agreementId: body.agreementId,
    name: body.name,
    platform: body.platform,
    format: body.format,
    quantity: body.quantity,
    dueInDays: body.dueInDays,
    requiresApproval: body.requiresApproval,
    actorId,
  });

  return NextResponse.json({
    deliverableId,
  });
}
