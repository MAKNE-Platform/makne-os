import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Milestone } from "@/lib/db/models/Milestone";
import { Agreement } from "@/lib/db/models/Agreement";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid milestone id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  await connectDB();

  const milestone = await Milestone.findById(id);
  if (!milestone) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
  }

  const agreement = await Agreement.findById(milestone.agreementId);
  if (!agreement || agreement.brandId.toString() !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // 🔒 Only allow revision when work is submitted
  if (milestone.status !== "IN_PROGRESS") {
    return NextResponse.json(
      { error: "Cannot request changes at this stage" },
      { status: 400 }
    );
  }

  milestone.status = "REVISION";
  await milestone.save();

  await Agreement.findByIdAndUpdate(agreement._id, {
    $push: {
      activity: {
        message: `Changes requested for milestone: ${milestone.title}`,
        createdAt: new Date(),
      },
    },
  });

  // 🔥 Force page reload
  const response = NextResponse.redirect(
    new URL(`/agreements/${agreement._id}?refresh=${Date.now()}`, request.url)
  );
  response.headers.set("Cache-Control", "no-store");

  return response;
}
