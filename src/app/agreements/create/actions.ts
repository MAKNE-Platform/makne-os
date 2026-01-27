"use server";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

export async function createAgreementAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const deliverables = formData.get("deliverables") as string;
  const amount = Number(formData.get("amount"));

  if (!title) {
    throw new Error("Title required");
  }

  const cookieStore = await cookies();
  const brandId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!brandId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  await Agreement.create({
    brandId: new mongoose.Types.ObjectId(brandId),
    title,
    description,
    deliverables,
    amount,
    status: "DRAFT",
    activity: [
      {
        message: "Agreement created by brand",
      },
    ],
  });



  redirect("/agreements");
}
