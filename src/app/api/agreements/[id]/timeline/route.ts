import { NextResponse } from "next/server";
import { getAgreementTimeline } from "@/core/agreements/read";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: agreementId } = await ctx.params;

  const timeline = await getAgreementTimeline(agreementId);

  return NextResponse.json({
    agreementId,
    timeline,
  });
}
