import { getDb } from "@/lib/db";
import { hashValue, compareHash } from "@/lib/crypto";
import { OtpToken } from "./models";
import { getPendingOtpUserId } from "./otp-session";

const OTP_TTL_MINUTES = 5;
const MAX_ATTEMPTS = 5;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Request a new OTP for a user.
 * - Deletes any existing OTP
 * - Stores hashed OTP
 * - Sends OTP via email (mock for now)
 */
export async function requestOtp(
  userId: string,
  email: string
): Promise<void> {
  const db = await getDb();
  const otps = db.collection<OtpToken>("otp_tokens");

  // Invalidate previous OTPs
  await otps.deleteMany({ userId });

  const code = generateOtp();
  const codeHash = await hashValue(code);

  await otps.insertOne({
    userId,
    codeHash,
    attempts: 0,
    verified: false,
    expiresAt: new Date(
      Date.now() + OTP_TTL_MINUTES * 60 * 1000
    ),
  });

  // 🔔 SEND OTP (mock for now)
  console.log(`OTP for ${email}: ${code}`);
}


/**
 * Verify OTP for a user.
 * Throws on failure.
 */
export async function verifyOtp(code: string): Promise<string> {
  const pendingUserId = await getPendingOtpUserId();

  if (!pendingUserId) {
    throw new Error("OTP_SESSION_EXPIRED");
  }

  const db = await getDb();
  const otps = db.collection<OtpToken>("otp_tokens");

  const record = await otps.findOne({ userId: pendingUserId });

  if (!record) throw new Error("OTP_NOT_FOUND");
  if (record.expiresAt < new Date()) throw new Error("OTP_EXPIRED");

  const isValid = await compareHash(code, record.codeHash);

  if (!isValid) throw new Error("OTP_INVALID");

  await otps.updateOne(
    { userId: pendingUserId },
    { $set: { verified: true } }
  );

  // ✅ return userId — clearing cookie happens in server action
  return pendingUserId;
}

export async function isOtpVerified(
  userId: string
): Promise<boolean> {
  const db = await getDb();
  const otps = db.collection<OtpToken>("otp_tokens");

  const record = await otps.findOne({ userId });
  return Boolean(record?.verified);
}
