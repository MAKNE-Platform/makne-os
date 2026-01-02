import { NextResponse } from "next/server";
import { addMilestone } from "@/core/agreements/handlers/addMilestone";

export async function POST(req: Request) {
  // TODO: replace with real auth
  const actorId = "user_123";

  const {
    agreementId,
    name,
    deliverableIds,
    unlockRule,
  } = await req.json();

  await addMilestone({
    agreementId,
    name,
    deliverableIds,
    unlockRule,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
