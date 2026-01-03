import { NextResponse } from "next/server";
import { getAgreementState } from "@/core/agreements/read";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: agreementId } = await ctx.params;

  const state = await getAgreementState(agreementId);

  return NextResponse.json({
    agreementId,
    state,
  });
}
