import { cookies } from "next/headers";

const OTP_SESSION_COOKIE = "makne_otp_user";

/**
 * Bind current OTP flow to a user.
 * Called when OTP is requested.
 */
export async function setPendingOtpUserId(
  userId: string
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(OTP_SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 60, // 5 minutes
  });
}

/**
 * Read userId bound to current OTP flow.
 * Called during OTP verification.
 */
export async function getPendingOtpUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(OTP_SESSION_COOKIE);

  if (!cookie) return null;
  return cookie.value;
}
