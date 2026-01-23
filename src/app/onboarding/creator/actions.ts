"use server";

import { redirect } from "next/navigation";

export async function onboardCreatorAction(formData: FormData) {
  const niche = formData.get("niche");
  const platforms = formData.get("platforms");

  if (!niche || !platforms) {
    throw new Error("Required fields missing");
  }

  // TODO:
  // Save creator profile

  redirect("/dashboard/creator");
}
