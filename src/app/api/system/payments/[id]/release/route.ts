import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";

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

  return NextResponse.json({
    success: true,
    message: "Payment released successfully",
  });
}
