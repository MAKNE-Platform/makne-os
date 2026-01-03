// app/api/dev/auto-complete-agreement/route.ts
import { NextResponse } from "next/server";
import { runAutoCompleteAgreementAgent } from "@/core/agents/auto-complete-agreement";

export async function POST(req: Request) {
  const { agreementId } = await req.json();

  await runAutoCompleteAgreementAgent(agreementId);

  return NextResponse.json({ success: true });
}
