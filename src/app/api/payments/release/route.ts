import { NextResponse } from "next/server";
import { releasePayment } from "@/core/agreements/handlers/releasePayment";

export async function POST(req: Request) {
  const body = await req.json();

  // TEMP auth (consistent with your setup)
  const actorId = "brand_1";

  try {
    await releasePayment({
      agreementId: body.agreementId,
      milestoneId: body.milestoneId,
      amount: body.amount,
      actorId,
    });

    return NextResponse.json({ status: "OK" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "PAYMENT_RELEASE_FAILED" },
      { status: 400 }
    );
  }
}
