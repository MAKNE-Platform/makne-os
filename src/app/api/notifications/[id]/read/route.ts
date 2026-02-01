import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Notification } from "@/lib/db/models/Notification";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid notification id" },
      { status: 400 }
    );
  }

  await connectDB();

  const result = await Notification.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
      role: "CREATOR",
      read: false,
    },
    {
      $set: { read: true },
    },
    { new: true }
  );

  // Idempotent: already read is fine
  return NextResponse.json({
    success: true,
    alreadyRead: !result,
  });
}
