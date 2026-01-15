import { v4 as uuid } from "uuid";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { Session } from "./models";

const SESSION_TTL_DAYS = 7;
const SESSION_COOKIE = "makne_session";

/**
 * Creates a session in DB and RETURNS sessionId.
 */
export async function createSession(
  userId: string
): Promise<string> {
  const db = await getDb();
  const sessions = db.collection<Session>("sessions");

  const sessionId = uuid();
  const now = new Date();

  await sessions.insertOne({
    _id: sessionId,
    userId,
    createdAt: now,
    expiresAt: new Date(
      now.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
    ),
  });

  return sessionId;
}

/**
 * Sets session cookie (App Router compliant).
 */
export async function setSessionCookie(
  sessionId: string
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

/**
 * Reads sessionId from cookie.
 */
export async function readSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);

  if (!cookie) return null;
  return cookie.value;
}
