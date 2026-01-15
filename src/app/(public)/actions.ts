"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createTempUser } from "@/core/auth/temp-user";
import { createSession } from "@/core/auth/session";

const SESSION_COOKIE = "makne_session";

export async function startAsBrand() {
  const user = await createTempUser("BRAND");

  const sessionId = await createSession(user.userId);

  // ✅ cookies() is ASYNC in Next.js 14
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect("/dashboard");
}

export async function startAsCreator() {
  const user = await createTempUser("CREATOR");

  const sessionId = await createSession(user.userId);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect("/dashboard");
}
