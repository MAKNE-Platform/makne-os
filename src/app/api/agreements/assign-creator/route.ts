import { NextResponse } from "next/server";
import { assignCreator } from "@/core/agreements/handlers/assignCreator";

export async function POST(req: Request) {
  // TODO: real auth
  const actorId = "brand_1";

  const { agreementId, creatorId } = await req.json();

  await assignCreator({
    agreementId,
    creatorId,
    actorId,
  });

  return NextResponse.json({ success: true });
}
