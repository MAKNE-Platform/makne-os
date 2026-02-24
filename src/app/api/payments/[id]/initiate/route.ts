import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";
import { logAudit } from "@/lib/audit/logAudit";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid payment id" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
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

  // 2️⃣ Fetch agreement & verify ownership
  const agreement = await Agreement.findById(payment.agreementId);
  if (!agreement || agreement.brandId.toString() !== userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  // Helper: redirect back safely
  const redirectBack = () => {
    const response = NextResponse.redirect(
      new URL(
        `/agreements/${agreement._id}?status=PAYMENT_INITIATED`,
        request.url
      )
    );
    response.headers.set("Cache-Control", "no-store");
    return response;
  };

  // 3️⃣ Idempotency: if already initiated or released → just redirect
  if (payment.status !== "PENDING") {
    return redirectBack();
  }

  // 4️⃣ Atomic state transition: PENDING → INITIATED
  await Payment.findOneAndUpdate(
    {
      _id: paymentId,
      status: "PENDING",
    },
    {
      $set: {
        status: "INITIATED",
        updatedAt: new Date(),
      },
    }
  );

  await logAudit({
    actorType: "BRAND",
    actorId: new mongoose.Types.ObjectId(userId),
    action: "PAYMENT_INITIATED",
    entityType: "PAYMENT",
    entityId: payment._id,
    metadata: {
      amount: payment.amount,
      agreementId: payment.agreementId.toString(),
      creatorId: payment.creatorId.toString(),
      brandId: payment.brandId.toString(),
    },
  });



  // 5️⃣ Log activity
  await Agreement.findByIdAndUpdate(
    agreement._id,
    {
      $push: {
        activity: {
          message: "Payment initiated for milestone",
          createdAt: new Date(),
        },
      },
    }
  );

  return redirectBack();
}
