"use server";

import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { AgencyProfile } from "@/lib/db/models/AgencyProfile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function onboardAgencyAction(formData: FormData) {
  const agencyName = formData.get("agencyName") as string;
  const teamSize = formData.get("teamSize") as string | null;
  const contactEmail = formData.get("contactEmail") as string;

  if (!agencyName || !contactEmail) {
    throw new Error("Required fields missing");
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  if (!userId) {
    redirect("/auth/login");
  }

  await connectDB();

  // 1️⃣ Save agency profile
  await AgencyProfile.create({
    userId: new mongoose.Types.ObjectId(userId),
    agencyName,
    teamSize,
    contactEmail,
  });

  // 2️⃣ Update user lifecycle
  await User.findByIdAndUpdate(userId, {
    role: "AGENCY",
    onboardingCompleted: true,
    isEmailVerified: true,
  });

  // 3️⃣ Update role cookie
  cookieStore.set("user_role", "AGENCY", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("toast", "SIGNUP_SUCCESS", {
    path: "/",
    maxAge: 5,
  });

  redirect("/dashboard/agency");
}
