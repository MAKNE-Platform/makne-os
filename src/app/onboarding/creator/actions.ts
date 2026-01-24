"use server";

import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import mongoose from "mongoose";


export async function onboardCreatorAction(formData: FormData) {
  const niche = formData.get("niche") as string;
  const platforms = formData.get("platforms") as string;
  const portfolio = formData.get("portfolio") as string | null;

  if (!niche || !platforms) {
    throw new Error("Required fields missing");
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  if (!userId) {
    redirect("/auth/login");
  }

  await connectDB();

  // 1️⃣ Save creator profile
  const profile = await CreatorProfile.create({
    userId: new mongoose.Types.ObjectId(userId),
    niche,
    platforms,
    portfolio,
  });

  console.log("CREATOR PROFILE SAVED:", profile._id);


  // 2️⃣ Update user lifecycle
  await User.findByIdAndUpdate(userId, {
    role: "CREATOR",
    onboardingCompleted: true,
    isEmailVerified: true,
  });

  // 3️⃣ Set role cookie (authorization relies on this)
  cookieStore.set("user_role", "CREATOR", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard/creator");
}
