"use server";

import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";

export async function createAgreementMetaAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const creatorEmail = formData.get("creatorEmail") as string | null;

  if (!title) {
    throw new Error("Title is required");
  }

  const cookieStore = await cookies();
  const brandId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!brandId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  const agreement = await Agreement.create({
    brandId: new mongoose.Types.ObjectId(brandId),
    title,
    description,
    creatorEmail: creatorEmail || undefined,
    status: "DRAFT",
    activity: [
      { message: "Agreement draft created" },
    ],
  });

  // 🔐 Track draft agreement across steps
  cookieStore.set("draft_agreement_id", agreement._id.toString(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  // ➡️ Move to next step
  redirect("/agreements/create/deliverables");
}
