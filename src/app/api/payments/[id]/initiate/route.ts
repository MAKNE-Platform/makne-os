import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";

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

  console.log("📦 Connected DB:", mongoose.connection.name);
  console.log("📦 Payments collection:", Payment.collection.name);


  const paymentId = new mongoose.Types.ObjectId(id);

  // 1️⃣ Fetch payment
const payment = await Payment.findById(paymentId);

if (!payment) {
  console.log("❌ Payment not found");
  return NextResponse.json({ error: "Payment not found" }, { status: 404 });
}

console.log("✅ BEFORE:", payment.status);

payment.status = "RELEASED";
await payment.save();

console.log("✅ AFTER:", payment.status);


  // 2️⃣ Fetch agreement
  const agreement = await Agreement.findById(payment.agreementId);
  if (!agreement || agreement.brandId.toString() !== userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  // 3️⃣ Validate payment state
  if (payment.status !== "PENDING") {
    return NextResponse.json(
      { error: "Payment already processed" },
      { status: 400 }
    );
  }

  // 4️⃣ Atomic state transition


  // 5️⃣ Log activity
  await Agreement.findByIdAndUpdate(
    agreement._id,
    {
      $push: {
        activity: {
          message: "Payment released for milestone",
          createdAt: new Date(),
        },
      },
    }
  );

  const response = NextResponse.redirect(
    new URL(`/agreements/${agreement._id}?refresh=${Date.now()}`, request.url)
  );

  response.headers.set("Cache-Control", "no-store");
  return response;
}
