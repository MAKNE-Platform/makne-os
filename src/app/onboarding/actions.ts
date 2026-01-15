"use server";

import { getCurrentUser, requireAuth } from "@/core/auth/contract";
import { dispatchUserEvent } from "@/core/users/dispatchUserEvent";

export async function selectUserRole(role: "BRAND" | "CREATOR") {
  const user = await getCurrentUser();
  requireAuth(user);

  if (user.role) {
    throw new Error("ROLE_ALREADY_SELECTED");
  }

  await dispatchUserEvent({
    type: "USER_ROLE_SELECTED",
    userId: user.userId,
    payload: { role },
    metadata: {
      occurredAt: new Date().toISOString(),
    },
  });
}
