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

  const safePayments = payments.map((p) => ({
    _id: p._id.toString(),
    agreementId: p.agreementId?.toString(),
    milestoneId: p.milestoneId?.toString(),
    brandId: p.brandId?.toString(),
    creatorId: p.creatorId?.toString(),
    amount: p.amount,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <EarningsClient
      balance={{
        availableBalance: balance.availableBalance,
        lockedAmount: balance.lockedAmount,
        paidOut: balance.paidOut,
      }}
      payments={safePayments}
      totalEarnings={totalEarnings}
      earningsChart={earningsChart}
    />
  );
}