import { NextResponse } from "next/server";
import { addMilestone } from "@/core/agreements/handlers/addMilestone";

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
  const body = await req.json();

  // HARD NORMALIZATION (keep this)
  const deliverableIds: string[] = body.deliverableIds.map(
    (d: any) => (typeof d === "string" ? d : d.deliverableId)
  );

  const { milestoneId } = await addMilestone({
    agreementId: body.agreementId,
    name: body.name,
    unlockRule: body.unlockRule,
    deliverableIds,
    actorId,
  });

  return NextResponse.json({ milestoneId });
}
