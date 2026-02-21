import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { getCreatorBalance } from "@/lib/payments/getCreatorBalance";
import type { PaymentDocument } from "@/lib/db/models/Payment";
import EarningsClient from "@/app/creator/earnings/EarningsClient";

export default async function CreatorEarningsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    redirect("/auth/login");
  }

  await connectDB();
  const creatorId = new mongoose.Types.ObjectId(userId);

  const balance = await getCreatorBalance(creatorId);

  const payments = await Payment.find({
    creatorId,
    status: "RELEASED",
  }).lean<PaymentDocument[]>();

  const totalEarnings = payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  /* ===== Chart Data ===== */

  const monthlyMap = new Map<string, number>();

  payments.forEach((p: any) => {
    const date = new Date(p.createdAt);
    const monthKey = date.toLocaleString("default", { month: "short" });

    monthlyMap.set(
      monthKey,
      (monthlyMap.get(monthKey) ?? 0) + (p.amount ?? 0)
    );
  });

  const earningsChart = Array.from(monthlyMap.entries()).map(
    ([label, value]) => ({
      label,
      value,
    })
  );

  return (
    <EarningsClient
      balance={balance}
      payments={payments}
      totalEarnings={totalEarnings}
      earningsChart={earningsChart}
    />
  );
}