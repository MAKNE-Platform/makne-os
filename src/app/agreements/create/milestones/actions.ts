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
    redirect("/dashboard/brand");
  }

  const titles = formData.getAll("milestone_title") as string[];
  const amounts = formData.getAll("milestone_amount") as string[];

  await connectDB();

  const agreement = await Agreement.findOne({
    _id: new mongoose.Types.ObjectId(agreementId),
    brandId: new mongoose.Types.ObjectId(brandId),
    status: "DRAFT",
  }).lean();

  if (!agreement || !agreement.deliverables) {
    throw new Error("Deliverables not found");
  }

  // Remove old milestones (safe for draft)
  await Milestone.deleteMany({
    agreementId: new mongoose.Types.ObjectId(agreementId),
  });

  for (let i = 0; i < titles.length; i++) {
    if (!titles[i] || !amounts[i]) continue;

    const deliverableIds = formData
      .getAll(`milestone_${i}_deliverables`)
      .map((id) => new mongoose.Types.ObjectId(id as string));

    if (deliverableIds.length === 0) {
      throw new Error("Each milestone must be linked to at least one deliverable");
    }

    await Milestone.create({
      agreementId: new mongoose.Types.ObjectId(agreementId),
      title: titles[i],
      amount: Number(amounts[i]),
      deliverableIds,
      status: "PENDING",
    });
  }

  await Agreement.findByIdAndUpdate(agreementId, {
    $push: {
      activity: { message: "Milestones defined" },
    },
  });

  redirect("/agreements/create/policies");
}
