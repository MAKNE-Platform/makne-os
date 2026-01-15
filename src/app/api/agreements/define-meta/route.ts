import { NextResponse } from "next/server";
import { defineMeta } from "@/core/agreements/handlers/defineMeta";

import {
  getCurrentUser,
  requireAuth,
  requireRole,
} from "@/core/auth/contract";

export async function POST(req: Request) {
  const user = await getCurrentUser();
    requireAuth(user);
    requireRole(user, "BRAND");

  const actorId = user.userId;

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
