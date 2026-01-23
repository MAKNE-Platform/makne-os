"use server";

import { connectDB } from "@/lib/db/connect";
import { Otp } from "@/lib/db/models/Otp";
import { generateOtp, otpExpiry } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/email/sendOtpEmail";
import { redirect } from "next/navigation";

export async function createTempUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) throw new Error("Email required");

  await connectDB();

  const code = generateOtp();

  await Otp.deleteMany({ email }); // cleanup old OTPs

  await Otp.create({
    email,
    code,
    expiresAt: otpExpiry(),
  });

  await sendOtpEmail(email, code);

  redirect("/auth/signup/verify");
}
