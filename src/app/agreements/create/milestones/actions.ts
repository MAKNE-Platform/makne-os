"use server";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { Milestone } from "@/lib/db/models/Milestone";

export async function saveMilestonesAction(formData: FormData) {
  const cookieStore = await cookies();
  const brandId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;
  const agreementId = cookieStore.get("draft_agreement_id")?.value;

  if (!brandId || role !== "BRAND") {
    redirect("/auth/login");
  }

  if (!agreementId) {
    redirect("/brand/dashboard");
  }

  const titles = formData.getAll("milestone_title") as string[];
  const amounts = formData.getAll("milestone_amount") as string[];

  await connectDB();

  const agreement = (await Agreement.findOne({
    _id: new mongoose.Types.ObjectId(agreementId),
    brandId: new mongoose.Types.ObjectId(brandId),
    status: "DRAFT",
  }).lean()) as unknown as { deliverables?: unknown[] } | null;

  if (!agreement || !Array.isArray(agreement.deliverables)) {
    redirect("/agreements/create/deliverables");
  }

  // 🔁 Clear previous draft milestones
  await Milestone.deleteMany({
    agreementId: new mongoose.Types.ObjectId(agreementId),
  });

  let createdCount = 0;

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i]?.trim();
    const amount = Number(amounts[i]);

    if (!title || !amount || Number.isNaN(amount)) continue;

    const deliverableIds = formData
      .getAll(`milestone_${i}_deliverables`)
      .map((id) => new mongoose.Types.ObjectId(id as string));

    // ⛔ Do not crash draft flow — just skip invalid milestone
    if (deliverableIds.length === 0) continue;

    await Milestone.create({
      agreementId: new mongoose.Types.ObjectId(agreementId),
      title,
      amount,
      deliverableIds,
      status: "PENDING",
    });

    createdCount++;
  }

  // 📝 Log activity only once (avoid spam)
  if (createdCount > 0) {
    await Agreement.findByIdAndUpdate(agreementId, {
      $push: {
        activity: { message: "Milestones updated" },
      },
    });
  }

  // Calculate total milestone amount
  const totalAmountAgg = await Milestone.aggregate([
    {
      $match: {
        agreementId: new mongoose.Types.ObjectId(agreementId),
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalAmount = totalAmountAgg[0]?.total ?? 0;

  // Save total amount into Agreement
  await Agreement.findByIdAndUpdate(agreementId, {
    amount: totalAmount,
  });

  redirect("/agreements/create/policies");
}
