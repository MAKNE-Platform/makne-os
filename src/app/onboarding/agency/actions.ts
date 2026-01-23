"use server";

import { redirect } from "next/navigation";

export async function onboardAgencyAction(formData: FormData) {
  const agencyName = formData.get("agencyName");
  const contactEmail = formData.get("contactEmail");

  if (!agencyName || !contactEmail) {
    throw new Error("Required fields missing");
  }

  // TODO:
  // Save agency profile

  redirect("/dashboard/agency");
}
