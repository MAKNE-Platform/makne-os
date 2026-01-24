"use server";

import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.passwordHash) {
    throw new Error("Password not set");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const cookieStore = await cookies();

  cookieStore.set("auth_session", user._id.toString(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  // ⚠️ ROLE-AWARE REDIRECT
  if (!user.role) {
    redirect("/auth/role");
  }

  cookieStore.set("user_role", user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect(`/dashboard/${user.role.toLowerCase()}`);
}
