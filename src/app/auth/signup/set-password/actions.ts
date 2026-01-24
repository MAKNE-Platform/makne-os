"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { redirect } from "next/navigation";

export async function setPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const cookieStore = await cookies();
  const email = cookieStore.get("verified_email")?.value;

  if (!email) {
    throw new Error("No verified email found");
  }

  await connectDB();

  const hash = await bcrypt.hash(password, 10);

  // 🔑 CREATE USER
  const user = await User.create({
    email,
    passwordHash: hash,
    isEmailVerified: true,
  });

  // CREATE SESSION 
  cookieStore.set("auth_session", user._id.toString(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  // cleanup temp cookie
  cookieStore.delete("verified_email");

  redirect("/auth/role");
}
