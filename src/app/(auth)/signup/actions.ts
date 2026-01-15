"use server";

import { redirect } from "next/navigation";
import { createSignupTempUser } from "@/core/auth/temp-user";
import { requestOtp } from "@/core/auth/otp";
import { setPendingOtpUserId } from "@/core/auth/otp-session";

export async function createTempUserAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("INVALID_EMAIL");
  }

  // 1️⃣ Create temp user
  const userId = await createSignupTempUser(email);

  // 2️⃣ Bind OTP session to this user
  await setPendingOtpUserId(userId);

  // 3️⃣ Generate + send OTP (mock = console.log)
  await requestOtp(userId, email);

  // 4️⃣ Move to OTP screen
  redirect("/verify-otp");
}
