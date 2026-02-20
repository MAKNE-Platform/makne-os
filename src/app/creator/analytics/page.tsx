import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { Payment } from "@/lib/db/models/Payment";
import { Milestone } from "@/lib/db/models/Milestone";

import AnalyticsClient from "./AnalyticsClient";

export default async function CreatorAnalyticsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") redirect("/auth/login");

  await connectDB();

  const creatorObjectId = new mongoose.Types.ObjectId(userId);

  /* ================= FETCH DATA ================= */

  const agreements = await Agreement.find({
    creatorId: creatorObjectId,
  }).lean();

  const payments = await Payment.find({
    creatorId: creatorObjectId,
  }).lean();

  const agreementIds = agreements.map((a) => a._id);

  const milestones =
    agreementIds.length > 0
      ? await Milestone.find({
          agreementId: { $in: agreementIds },
        }).lean()
      : [];

  /* ================= METRICS ================= */

  const totalAgreements = agreements.length;

  const completedAgreements = agreements.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const activeAgreements = agreements.filter(
    (a) => a.status === "ACTIVE"
  ).length;

  const completionRate =
    totalAgreements > 0
      ? Math.round((completedAgreements / totalAgreements) * 100)
      : 0;

  const releasedPayments = payments.filter(
    (p) => p.status === "RELEASED"
  );

  const pendingPayments = payments.filter(
    (p) =>
      p.status === "PENDING" || p.status === "INITIATED"
  );

  const totalEarnings = releasedPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const pendingEarnings = pendingPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const avgDealValue =
    totalAgreements > 0
      ? Math.round(
          agreements.reduce(
            (sum, a) => sum + (a.amount ?? 0),
            0
          ) / totalAgreements
        )
      : 0;

  /* ================= LAST 6 MONTHS EARNINGS ================= */

  const now = new Date();
  const earningsChart: { label: string; value: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const label = d.toLocaleString("default", {
      month: "short",
    });

    const monthlyTotal = releasedPayments
      .filter((p) => {
        const date = new Date(p.updatedAt);
        return (
          date.getMonth() === d.getMonth() &&
          date.getFullYear() === d.getFullYear()
        );
      })
      .reduce((sum, p) => sum + p.amount, 0);

    earningsChart.push({
      label,
      value: monthlyTotal,
    });
  }

  /* ================= LAST 6 MONTHS DELIVERABLES ================= */

  const deliverablesChart: {
    label: string;
    value: number;
  }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const label = d.toLocaleString("default", {
      month: "short",
    });

    const count = milestones.filter((m) => {
      if (!m.approvedAt) return false;

      const date = new Date(m.approvedAt);
      return (
        date.getMonth() === d.getMonth() &&
        date.getFullYear() === d.getFullYear()
      );
    }).length;

    deliverablesChart.push({
      label,
      value: count,
    });
  }

  return (
    <AnalyticsClient
      metrics={{
        totalEarnings,
        pendingEarnings,
        completionRate,
        avgDealValue,
        totalAgreements,
        activeAgreements,
        completedAgreements,
      }}
      earningsChart={earningsChart}
      deliverablesChart={deliverablesChart}
    />
  );
}