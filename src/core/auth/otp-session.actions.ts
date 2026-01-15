"use server";

import { cookies } from "next/headers";

const OTP_SESSION_COOKIE = "makne_otp_user";

export async function setPendingOtpUserId(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set(OTP_SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });
}

export async function clearPendingOtpUserId() {
  const cookieStore = await cookies();
  cookieStore.delete(OTP_SESSION_COOKIE);
}
