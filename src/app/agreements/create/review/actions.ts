"use server";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";
import { notifyFromAudit } from "@/lib/notifications/notifyFromAudit";

async function finalizeAgreement(mode: "CREATE" | "SEND") {
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
  });

  const brandUser = await User.findById(brandId).lean<{ email: string }>();

  if (!agreement) {
    redirect("/dashboard/brand");
  }

  if (mode === "SEND") {
    if (!agreement.creatorEmail) {
      throw new Error("Creator email required to send agreement");
    }

    const creator = await User.findOne({
      email: agreement.creatorEmail,
      role: "CREATOR",
    });

    if (!creator) {
      throw new Error("Creator not found");
    }

    agreement.creatorId = creator._id;
    agreement.status = "SENT";
    agreement.activity.push({
      message: "Agreement created and sent to creator",
    });

    await notifyFromAudit({
      action: "AGREEMENT_SENT",
      actorType: "BRAND",
      entityType: "AGREEMENT",
      entityId: agreement._id,
      metadata: {
        creatorId: creator._id.toString(),
        creatorEmail: agreement.creatorEmail,
        agreementTitle: agreement.title,
        brandName: brandUser?.email?.split("@")[0] ?? "Brand",
      },
    });


  } else {
    agreement.activity.push({
      message: "Agreement created as draft",
    });
  }

  await agreement.save();

  cookieStore.delete("draft_agreement_id");

  redirect(`/agreements/${agreement._id}`);
}

// ✅ EXPORTED SERVER ACTIONS
export async function createAgreementAction() {
  await finalizeAgreement("CREATE");
}

export async function createAndSendAgreementAction() {
  await finalizeAgreement("SEND");
}
