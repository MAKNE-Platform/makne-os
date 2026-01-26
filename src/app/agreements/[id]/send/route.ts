import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ FIX HERE

  const formData = await request.formData();
  const creatorEmail = formData.get("creatorEmail") as string;

  if (!creatorEmail) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const brandId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!brandId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  await connectDB();

  const creator = await User.findOne({
    email: creatorEmail,
    role: "CREATOR",
  });

  if (!creator) {
    return NextResponse.json(
      { error: "Creator not found" },
      { status: 404 }
    );
  }

  await Agreement.findByIdAndUpdate(id, {
    creatorId: new mongoose.Types.ObjectId(creator._id),
    creatorEmail,
    status: "SENT",
  });

  return NextResponse.redirect(new URL("/agreements", request.url));
}
