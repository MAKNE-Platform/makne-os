// src/lib/cookies.ts
"use server";

import { cookies } from "next/headers";

const SESSION_COOKIE = "makne_session";

/**
 * NOTE:
 * In Next.js 14+, cookies() is async.
 */

export async function setSessionCookie(
  sessionId: string
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
