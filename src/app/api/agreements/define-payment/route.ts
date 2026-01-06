import { NextResponse } from "next/server";
import { definePayment } from "@/core/agreements/handlers/definePayment";

export async function POST(req: Request) {
  // TODO: replace with real auth
  const actorId = "brand_1";

  const {
    agreementId,
    currency,
    totalAmount,
    releaseMode,
    escrowRequired,
  } = await req.json();

  await definePayment({
    agreementId,
    currency,
    totalAmount,
    releaseMode,
    escrowRequired,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
