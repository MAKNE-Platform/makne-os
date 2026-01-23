"use server";

import { redirect } from "next/navigation";

export async function onboardBrandAction(formData: FormData) {
  const brandName = formData.get("brandName");
  const industry = formData.get("industry");

  if (!brandName || !industry) {
    throw new Error("Required fields missing");
  }

  // TODO:
  // Save brand profile

  redirect("/dashboard/brand");
}
