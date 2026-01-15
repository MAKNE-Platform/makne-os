"use server";

import { redirect } from "next/navigation";
import { verifyOtp } from "@/core/auth/otp";

export async function verifyOtpAction(formData: FormData) {
  const code = formData.get("otp") as string;

  if (!code) {
    throw new Error("INVALID_INPUT");
  }

  // 🔐 Server resolves the correct userId
  const userId = await verifyOtp(code);

  // ✅ OTP verified, move to password setup
  redirect(`/set-password?uid=${userId}`);
}
