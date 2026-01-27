import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const formData = await request.formData();
  const action = formData.get("action") as "ACCEPT" | "REJECT";

  if (!action) {
    return NextResponse.json({ error: "Action required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  await connectDB();

  const agreement = await Agreement.findOne({
    _id: new mongoose.Types.ObjectId(id),
    creatorId: new mongoose.Types.ObjectId(userId),
    status: "SENT",
  });

  if (!agreement) {
    return NextResponse.json(
      { error: "Agreement not found or not actionable" },
      { status: 404 }
    );
  }

  // ✅ ensure activity array exists
  if (!agreement.activity) {
    agreement.activity = [];
  }

  if (action === "ACCEPT") {
    agreement.status = "ACTIVE";
    agreement.activity.push({
      message: "Agreement accepted by creator",
    });
  } else {
    agreement.status = "REJECTED";
    agreement.activity.push({
      message: "Agreement rejected by creator",
    });
  }

  await agreement.save();



  return NextResponse.redirect(
    new URL("/dashboard/creator", request.url)
  );
}
