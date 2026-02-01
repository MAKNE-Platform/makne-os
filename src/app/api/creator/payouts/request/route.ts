import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payout } from "@/lib/db/models/Payout";
import { getCreatorBalance } from "@/lib/payments/getCreatorBalance";
import { logAudit } from "@/lib/audit/logAudit";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  const body = await request.json();
  const amount = Number(body.amount);

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid withdrawal amount" },
      { status: 400 }
    );
  }

  await connectDB();

  const creatorId = new mongoose.Types.ObjectId(userId);

  // 1️⃣ Calculate balance (source of truth)
  const balance = await getCreatorBalance(creatorId);

  if (amount > balance.availableBalance) {
    return NextResponse.json(
      {
        error: "Insufficient available balance",
        availableBalance: balance.availableBalance,
      },
      { status: 400 }
    );
  }

  // 2️⃣ Create payout request (locks funds)
  const payout = await Payout.create({
    creatorId,
    amount,
    status: "REQUESTED",
    requestedAt: new Date(),
  });


  await logAudit({
    actorType: "CREATOR",
    actorId: creatorId,
    action: "PAYOUT_REQUESTED",
    entityType: "PAYOUT",
    entityId: payout._id,
    metadata: { amount },
  });


  return NextResponse.json({
    success: true,
    message: "Payout request submitted",
    requestedAmount: amount,
    remainingBalance:
      balance.availableBalance - amount,
  });
}
