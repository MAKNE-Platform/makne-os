import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const formData = await request.formData();

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  await connectDB();

  await Agreement.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      brandId: new mongoose.Types.ObjectId(userId),
      status: "DRAFT",
    },
    {
      policies: {
        paymentTerms: formData.get("paymentTerms"),
        cancellationPolicy: formData.get("cancellationPolicy"),
        revisionPolicy: formData.get("revisionPolicy"),
        usageRights: formData.get("usageRights"),
      },
    }
  );

  return NextResponse.redirect(
    new URL(`/agreements/${id}?status=POLICIES_SAVED`, request.url)
  );
}
