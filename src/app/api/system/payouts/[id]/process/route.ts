import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payout } from "@/lib/db/models/Payout";
import { logAudit } from "@/lib/audit/logAudit";

type Action = "PROCESS" | "COMPLETE" | "FAIL";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 🔐 System auth
  const systemKey = request.headers.get("x-makne-system-key");
  if (systemKey !== process.env.MAKNE_SYSTEM_KEY) {
    return NextResponse.json(
      { error: "Unauthorized system access" },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid payout id" },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const action: Action = body.action;

  if (!["PROCESS", "COMPLETE", "FAIL"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  }

  await connectDB();

  const payout = await Payout.findById(id);
  if (!payout) {
    return NextResponse.json(
      { error: "Payout not found" },
      { status: 404 }
    );
  }

  /* ---------------- STATE MACHINE ---------------- */

  if (action === "PROCESS") {
    if (payout.status !== "REQUESTED") {
      return NextResponse.json({ success: true });
    }

    payout.status = "PROCESSING";
    await payout.save();

    await logAudit({
      actorType: "SYSTEM",
      action: "PAYOUT_PROCESSING",
      entityType: "PAYOUT",
      entityId: payout._id,
      metadata: {
        creatorId: payout.creatorId.toString(),
        amount: payout.amount,
      },
    });
  }

  if (action === "COMPLETE") {
    if (payout.status !== "PROCESSING") {
      return NextResponse.json(
        { error: "Payout not in processing state" },
        { status: 400 }
      );
    }

    payout.status = "COMPLETED";
    payout.processedAt = new Date();
    await payout.save();

    await logAudit({
      actorType: "SYSTEM",
      action: "PAYOUT_COMPLETED",
      entityType: "PAYOUT",
      entityId: payout._id,
      metadata: {
        creatorId: payout.creatorId.toString(),
        amount: payout.amount,
      },
    });
  }

  if (action === "FAIL") {
    if (payout.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Completed payout cannot be failed" },
        { status: 400 }
      );
    }

    payout.status = "FAILED";
    await payout.save();

    await logAudit({
      actorType: "SYSTEM",
      action: "PAYOUT_FAILED",
      entityType: "PAYOUT",
      entityId: payout._id,
      metadata: {
        creatorId: payout.creatorId.toString(),
        amount: payout.amount,
      },
    });
  }

  return NextResponse.json({
    success: true,
    payoutId: payout._id.toString(),
    status: payout.status,
  });
}
