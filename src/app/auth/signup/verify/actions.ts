"use server";

import { connectDB } from "@/lib/db/connect";
import { Otp } from "@/lib/db/models/Otp";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verifySignupCodeAction(formData: FormData) {
  const code = formData.get("code") as string;
  if (!code) throw new Error("Code required");

  await connectDB();

  const record = await Otp.findOne({ code });
  if (!record || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired code");
  }

  // cleanup OTPs
  await Otp.deleteMany({ email: record.email });

  // ✅ CORRECT: await cookies()
  const cookieStore = await cookies();

  cookieStore.set("verified_email", record.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("toast", "VERIFICATION_SUCCESS", {
    path: "/",
    maxAge: 5,
  });

  redirect("/auth/signup/set-password");
}
