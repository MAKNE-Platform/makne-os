import { NextResponse } from "next/server";
import { assignCreator } from "@/core/agreements/handlers/assignCreator";

export async function POST(req: Request) {
  // TODO: replace with real auth
  const actorId = "user_123";

  const { agreementId, creatorId } = await req.json();

  await assignCreator({
    agreementId,
    creatorId,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
