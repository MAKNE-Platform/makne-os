"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Milestone } from "@/lib/db/models/Milestone";
import { Agreement } from "@/lib/db/models/Agreement";

export async function createMilestoneAction(
  agreementId: string,
  formData: FormData
) {
  const title = formData.get("title") as string;
  const amount = Number(formData.get("amount"));
  const description = formData.get("description") as string;

  if (!title || !amount) {
    throw new Error("Title and amount required");
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  const agreement = await Agreement.findOne({
    _id: new mongoose.Types.ObjectId(agreementId),
    brandId: new mongoose.Types.ObjectId(userId),
    status: "ACTIVE",
  });

  if (!agreement) {
    throw new Error("Agreement not active or unauthorized");
  }

  await Milestone.create({
    agreementId: agreement._id,
    title,
    description,
    amount,
  });

  redirect(`/agreements/${agreementId}`);
}
