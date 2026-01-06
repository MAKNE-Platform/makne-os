import { NextResponse } from "next/server";
import { definePaymentSplit } from "@/core/agreements/handlers/definePaymentSplit";

export async function POST(req: Request) {
  // TODO: replace with real auth
  const actorId = "brand_1";

  const { agreementId, milestoneId, amount } =
    await req.json();

  await definePaymentSplit({
    agreementId,
    milestoneId,
    amount,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
