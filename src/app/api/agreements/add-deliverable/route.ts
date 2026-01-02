import { NextResponse } from "next/server";
import { addDeliverable } from "@/core/agreements/handlers/addDeliverables";

export async function POST(req: Request) {
  // TODO: replace with real auth
  const actorId = "user_123";

  const {
    agreementId,
    name,
    platform,
    format,
    quantity,
    dueInDays,
    requiresApproval,
  } = await req.json();

  await addDeliverable({
    agreementId,
    name,
    platform,
    format,
    quantity,
    dueInDays,
    requiresApproval,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
