import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";
import { logAudit } from "@/lib/audit/logAudit";
import { Milestone } from "@/lib/db/models/Milestone";


// ⏱️ TEST MODE: 5 seconds (change to 120 for production)
const RELEASE_DELAY_SECONDS = 0.1;

export async function POST(request: Request) {
  // 🔐 System auth (supports system UI form + API usage)
  const formData = await request.formData();
  const systemKeyFromForm = formData.get("systemKey");

  const systemKey =
    request.headers.get("x-makne-system-key") ||
    systemKeyFromForm;

  if (systemKey !== process.env.MAKNE_SYSTEM_KEY) {
    return NextResponse.json(
      { error: "Unauthorized system access" },
      { status: 401 }
    );
  }

  await connectDB();

  const releaseBefore = new Date(
    Date.now() - RELEASE_DELAY_SECONDS * 1000
  );

  // 1️⃣ Find eligible payments
  const paymentsToRelease = await Payment.find({
    status: "INITIATED",
    updatedAt: { $lte: releaseBefore },
  });

  if (paymentsToRelease.length === 0) {
    return NextResponse.json({
      success: true,
      released: 0,
      message: "No payments to release",
    });
  }

  let releasedCount = 0;

  for (const payment of paymentsToRelease) {
    // 2️⃣ Atomic state transition: INITIATED → RELEASED
    const updated = await Payment.findOneAndUpdate(
      {
        _id: payment._id,
        status: "INITIATED",
      },
      {
        $set: {
          status: "RELEASED",
          releasedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) continue;

    releasedCount++;

    // 3️⃣ Audit log (system action)
    await logAudit({
      actorType: "SYSTEM",
      action: "PAYMENT_RELEASED",
      entityType: "PAYMENT",
      entityId: payment._id,
      metadata: {
        amount: payment.amount,
        creatorId: payment.creatorId.toString(),
        agreementId: payment.agreementId.toString(),
      },
    });

    // 4️⃣ Agreement activity (UI timeline)
    await Agreement.findByIdAndUpdate(
      payment.agreementId,
      {
        $push: {
          activity: {
            message: "Payment auto-released to creator",
            createdAt: new Date(),
          },
        },
      }
    );

    // 5️⃣ Check if agreement should be marked COMPLETED

    const agreementId = new mongoose.Types.ObjectId(payment.agreementId);

    const milestones = await Milestone.find({ agreementId });
    const payments = await Payment.find({ agreementId });

    const allMilestonesCompleted =
      milestones.length > 0 &&
      milestones.every((m) => m.status === "COMPLETED");

    const allPaymentsReleased =
      payments.length > 0 &&
      payments.every((p) => p.status === "RELEASED");

    if (allMilestonesCompleted && allPaymentsReleased) {
      await Agreement.findByIdAndUpdate(agreementId, {
        status: "COMPLETED",
        updatedAt: new Date(),
      });

      console.log("Agreement auto-marked COMPLETED:", agreementId.toString());
    }
  }

  return NextResponse.json({
    success: true,
    released: releasedCount,
  });
}
