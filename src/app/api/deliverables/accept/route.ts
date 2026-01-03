import { NextResponse } from "next/server";
import { acceptDeliverable } from "@/core/agreements/handlers/acceptDeliverable";

export async function POST(req: Request) {
  const body = await req.json();

  await acceptDeliverable({
    agreementId: body.agreementId,
    deliverableId: body.deliverableId,
    actorId: body.actorId, // brand
  });

  return NextResponse.json({ success: true });
}
