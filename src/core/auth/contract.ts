import { getDb } from "@/lib/db";
import { readSessionCookie } from "./session";

export type UserRole = "BRAND" | "CREATOR";

export interface AuthUser {
  userId: string;
  role?: UserRole;
  isTemporary: boolean;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const sessionId = await readSessionCookie();
  if (sessionId === null) return null;

  const db = await getDb();

  const session = await db
    .collection<{ _id: string; userId: string }>("sessions")
    .findOne({ _id: sessionId });

  if (!session) return null;

  const user = await db
    .collection<{ _id: string; isTemporary: boolean }>("users")
    .findOne({ _id: session.userId });

  if (!user) return null;

  return {
    userId: user._id,
    isTemporary: user.isTemporary,
  };
}

export function requireAuth(
  user: AuthUser | null
): asserts user is AuthUser {
  if (user === null) {
    throw new Error("UNAUTHENTICATED");
  }
}

export function requireRole<R extends UserRole>(
  user: AuthUser,
  role: R
): asserts user is AuthUser & { role: R } {
  if (user.role !== role) {
    throw new Error("UNAUTHORIZED");
  }
}
