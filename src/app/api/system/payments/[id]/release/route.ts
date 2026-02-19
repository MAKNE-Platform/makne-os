import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";
import { Milestone } from "@/lib/db/models/Milestone";
import { logAudit } from "@/lib/audit/logAudit";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // 🔐 System auth
  const systemKey = request.headers.get("x-makne-system-key");
  if (systemKey !== process.env.MAKNE_SYSTEM_KEY) {
    return NextResponse.json(
      { error: "Unauthorized system access" },
      { status: 401 }
    );
  }

  console.log("SYSTEM RELEASE ROUTE HIT:", id);


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid payment id" },
      { status: 400 }
    );
  }

  await connectDB();

  const paymentId = new mongoose.Types.ObjectId(id);

  // 1️⃣ Fetch payment
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  // 2️⃣ Idempotency
  if (payment.status === "RELEASED") {
    return NextResponse.json({
      success: true,
      message: "Payment already released",
    });
  }

  if (payment.status !== "INITIATED") {
    return NextResponse.json(
      { error: "Payment not in releasable state" },
      { status: 400 }
    );
  }

  // 3️⃣ Atomic release
  await Payment.findOneAndUpdate(
    {
      _id: paymentId,
      status: "INITIATED",
    },
    {
      $set: {
        status: "RELEASED",
        updatedAt: new Date(),
      },
    }
  );

  console.log("AUDIT LOG TRIGGERED");
  await logAudit({
    actorType: "SYSTEM",
    action: "PAYMENT_RELEASED",
    entityType: "PAYMENT",
    entityId: paymentId,
  });


  // 4️⃣ Log agreement activity
  await Agreement.findByIdAndUpdate(
    payment.agreementId,
    {
      $push: {
        activity: {
          message: "Payment released to creator",
          createdAt: new Date(),
        },
      },
    }
  );

  // 5️⃣ Check if agreement should be marked as COMPLETED

  const agreementId = payment.agreementId;

  // Fetch all milestones for this agreement
  const milestones = await Milestone.find({ agreementId });

  // Fetch all payments for this agreement
  const payments = await Payment.find({ agreementId });

  const allMilestonesCompleted =
    milestones.length > 0 &&
    milestones.every((m) => m.status === "COMPLETED");

  const allPaymentsReleased =
    payments.length > 0 &&
    payments.every((p) => p.status === "RELEASED");

  console.log("Milestones:", milestones.map(m => m.status));
  console.log("Payments:", payments.map(p => p.status));

  console.log("All milestones completed:", allMilestonesCompleted);
  console.log("All payments released:", allPaymentsReleased);


  if (allMilestonesCompleted && allPaymentsReleased) {
    await Agreement.findByIdAndUpdate(agreementId, {
      status: "COMPLETED",
      updatedAt: new Date(),
    });

    console.log("Agreement marked as COMPLETED");
  }


  return NextResponse.json({
    success: true,
    message: "Payment released successfully",
  });
}
