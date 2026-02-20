"use server";

import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function onboardBrandAction(formData: FormData) {
  const brandName = formData.get("brandName") as string;
  const industry = formData.get("industry") as string;
  const location = formData.get("location") as string | null;

  if (!brandName || !industry) {
    throw new Error("Required fields missing");
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  if (!userId) {
    redirect("/auth/login");
  }

  await connectDB();

  // 1️⃣ Save brand profile
  await BrandProfile.create({
    userId: new mongoose.Types.ObjectId(userId),
    brandName,
    industry,
    location,
  });

  // 2️⃣ Update user lifecycle
  await User.findByIdAndUpdate(userId, {
    role: "BRAND",
    onboardingCompleted: true,
    isEmailVerified: true,
  });

  // 3️⃣ Update role cookie
  cookieStore.set("user_role", "BRAND", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/brand/dashboard");
}
