import { NextResponse } from "next/server";
import { releasePayment } from "@/core/agreements/handlers/releasePayment";

export async function POST(req: Request) {
  const body = await req.json();

  await releasePayment({
    agreementId: body.agreementId,
    milestoneId: body.milestoneId,
    amount: body.amount,
    actorId: body.actorId,
  });

  return NextResponse.json({ success: true });
}
