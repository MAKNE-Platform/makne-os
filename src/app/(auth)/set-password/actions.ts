"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signupUser } from "@/core/auth/signup";
import { createSession } from "@/core/auth/session";

const SESSION_COOKIE = "makne_session";

export async function finalizeSignupAction(formData: FormData) {
  const userId = formData.get("userId") as string;
  const password = formData.get("password") as string;

  if (!userId || !password) {
    throw new Error("INVALID_INPUT");
  }

  // 1️⃣ Finalize user (OTP already verified)
  await signupUser(userId, undefined as any, password);
  // NOTE: email already exists on temp user

  // 2️⃣ Create session
  const sessionId = await createSession(userId);

  // 3️⃣ Set cookie at HTTP boundary
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  // 4️⃣ Auth is COMPLETE
  redirect("/onboarding");
}
