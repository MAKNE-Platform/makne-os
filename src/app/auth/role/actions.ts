"use server";

import { redirect } from "next/navigation";

export async function selectRoleAction(role: string) {
  if (!role) {
    throw new Error("Role is required");
  }

  // TODO:
  // 1. Validate role
  // 2. Attach role to user
  // 3. Lock role (cannot be changed)
  // 4. Create role-specific profile stub

  console.log("Role selected:", role);

  // Next: role-specific onboarding
  redirect(`/onboarding/${role.toLowerCase()}`);
}
