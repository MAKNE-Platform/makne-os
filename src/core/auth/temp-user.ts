import { v4 as uuid } from "uuid";
import { getDb } from "@/lib/db";
import { User, UserRole } from "./models";

/**
 * TEMP USER — ANONYMOUS
 * Used for:
 * - landing page CTA
 * - anonymous access
 * - pre-auth exploration
 */
export async function createAnonymousTempUser(
  role?: UserRole
): Promise<string> {
  const db = await getDb();
  const users = db.collection<User>("users");

  const userId = uuid();

  await users.insertOne({
    _id: userId,
    role,
    isTemporary: true,
    createdAt: new Date(),
  });

  return userId;
}

/**
 * TEMP USER — SIGNUP FLOW
 * Used for:
 * - email signup
 * - OTP verification
 * - password setup
 */
export async function createSignupTempUser(
  email: string
): Promise<string> {
  const db = await getDb();
  const users = db.collection<User>("users");

  const existing = await users.findOne({ email });
  if (existing) {
    throw new Error("EMAIL_ALREADY_IN_USE");
  }

  const userId = uuid();

  await users.insertOne({
    _id: userId,
    email,
    isTemporary: true,
    createdAt: new Date(),
  });

  return userId;
}
