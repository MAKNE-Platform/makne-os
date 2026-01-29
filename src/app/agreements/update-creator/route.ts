import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const formData = await request.formData();
  const agreementId = formData.get("agreementId") as string;
  const creatorEmail = formData.get("creatorEmail") as string;

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!mongoose.Types.ObjectId.isValid(agreementId)) {
    return NextResponse.json({ error: "Invalid agreement" }, { status: 400 });
  }

  await connectDB();

  await Agreement.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(agreementId),
      brandId: new mongoose.Types.ObjectId(userId),
      status: "DRAFT",
    },
    { creatorEmail }
  );

  return NextResponse.redirect(
    new URL("/agreements/create/review", request.url)
  );
}
