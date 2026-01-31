import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";

const RELEASE_DELAY_MINUTES = 2;

export async function POST(request: Request) {
  // 🔐 System auth
  const systemKey = request.headers.get("x-makne-system-key");
  if (systemKey !== process.env.MAKNE_SYSTEM_KEY) {
    return NextResponse.json(
      { error: "Unauthorized system access" },
      { status: 401 }
    );
  }

  await connectDB();

  const releaseBefore = new Date(
    Date.now() - RELEASE_DELAY_MINUTES * 60 * 1000
  );

  // 1️⃣ Find releasable payments
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
    // Atomic release
    const updated = await Payment.findOneAndUpdate(
      {
        _id: payment._id,
        status: "INITIATED",
      },
      {
        $set: {
          status: "RELEASED",
          updatedAt: new Date(),
        },
      }
    );

    if (updated) {
      releasedCount++;

      // Log activity
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
    }
  }

  return NextResponse.json({
    success: true,
    released: releasedCount,
  });
}
