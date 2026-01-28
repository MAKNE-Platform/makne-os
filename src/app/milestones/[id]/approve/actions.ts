"use server";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Milestone } from "@/lib/db/models/Milestone";
import { Agreement } from "@/lib/db/models/Agreement";

export async function approveMilestoneAction(milestoneId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  const milestone = await Milestone.findOne({
    _id: new mongoose.Types.ObjectId(milestoneId),
    status: "IN_PROGRESS",
  });

  if (!milestone) {
    throw new Error("Milestone not approvable");
  }

  milestone.status = "COMPLETED";
  await milestone.save();

  await Agreement.findByIdAndUpdate(milestone.agreementId, {
    $push: {
      activity: { message: "Milestone approved by brand" },
    },
  });

  redirect(`/agreements/${milestone.agreementId}`);
}
