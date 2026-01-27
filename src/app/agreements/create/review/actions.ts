"use server";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";

export async function finalizeAgreementAction(
  action: "CREATE" | "SEND"
) {
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

  await connectDB();

  const agreement = await Agreement.findOne({
    _id: new mongoose.Types.ObjectId(agreementId),
    brandId: new mongoose.Types.ObjectId(brandId),
    status: "DRAFT",
  });

  if (!agreement) {
    redirect("/dashboard/brand");
  }

  // Optional SEND flow
  if (action === "SEND") {
    if (agreement.creatorEmail) {
      const creator = await User.findOne({
        email: agreement.creatorEmail,
        role: "CREATOR",
      });

      if (creator) {
        agreement.creatorId = creator._id;
        agreement.status = "SENT";
        agreement.activity.push({
          message: "Agreement created and sent to creator",
        });
      } else {
        throw new Error("Creator email not found");
      }
    } else {
      throw new Error("Creator email required to send agreement");
    }
  } else {
    agreement.activity.push({
      message: "Agreement created as draft",
    });
  }

  await agreement.save();

  // 🧹 Cleanup draft tracking
  cookieStore.delete("draft_agreement_id");

  redirect(`/agreements/${agreement._id}`);
}
