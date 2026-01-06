import { NextResponse } from "next/server";
import { defineMeta } from "@/core/agreements/handlers/defineMeta";

export async function POST(req: Request) {
  // TODO: replace with real auth
  const actorId = "brand_1";

  const { agreementId, title, description, category } =
    await req.json();

  await defineMeta({
    agreementId,
    title,
    description,
    category,
    actorId,
  });

  return NextResponse.json({
    success: true,
  });
}
