import { getDb } from "@/lib/db";
import { hashValue } from "@/lib/crypto";
import { User } from "./models";
import { isOtpVerified } from "./otp";
import { createSession, setSessionCookie } from "./session";

export async function signupUser(
  userId: string,
  email: string,
  password: string
): Promise<string> {
  const db = await getDb();
  const users = db.collection<User>("users");

  const user = await users.findOne({ _id: userId });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (!user.isTemporary) throw new Error("USER_ALREADY_REGISTERED");

  const otpVerified = await isOtpVerified(userId);
  if (!otpVerified) throw new Error("OTP_NOT_VERIFIED");

  const existing = await users.findOne({ email });
  if (existing) throw new Error("EMAIL_ALREADY_IN_USE");

  const passwordHash = await hashValue(password);

  await users.updateOne(
    { _id: userId },
    {
      $set: {
        email,
        passwordHash,
        isTemporary: false,
      },
    }
  );

  // ✅ core returns sessionId ONLY
  const sessionId = await createSession(userId);
  return sessionId;
}

