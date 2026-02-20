"use server";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";

export async function savePoliciesAction(formData: FormData) {
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

  const paymentTerms = formData.get("paymentTerms") as string;
  const cancellationPolicy = formData.get("cancellationPolicy") as string;
  const revisionPolicy = formData.get("revisionPolicy") as string;
  const usageRights = formData.get("usageRights") as string;

  await connectDB();

  await Agreement.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(agreementId),
      brandId: new mongoose.Types.ObjectId(brandId),
      status: "DRAFT",
    },
    {
      policies: {
        paymentTerms,
        cancellationPolicy,
        revisionPolicy,
        usageRights,
      },
      $push: {
        activity: { message: "Policies defined" },
      },
    }
  );

  redirect("/agreements/create/review");
}
