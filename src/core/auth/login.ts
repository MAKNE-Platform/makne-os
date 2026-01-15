// src/core/auth/login.ts

import { getDb } from "@/lib/db";
import { compareHash } from "@/lib/crypto";
import { User } from "./models";
import { createSession } from "./session";

/**
 * Logs in an existing REAL user.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<void> {
  const db = await getDb();
  const users = db.collection<User>("users");

  // 1️⃣ Find user by email
  const user = await users.findOne({ email });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // 2️⃣ Temp users must finish signup first
  if (user.isTemporary) {
    throw new Error("USER_NOT_VERIFIED");
  }

  if (!user.passwordHash) {
    throw new Error("PASSWORD_NOT_SET");
  }

  // 3️⃣ Compare password
  const valid = await compareHash(password, user.passwordHash);
  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // 4️⃣ Create session
  await createSession(user._id);
}
