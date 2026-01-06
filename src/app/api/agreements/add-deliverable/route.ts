import { NextResponse } from "next/server";
import { addDeliverable } from "@/core/agreements/handlers/addDeliverable";

export async function POST(req: Request) {
  const actorId = "brand_1"; 
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
