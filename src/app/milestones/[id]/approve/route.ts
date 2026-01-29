import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { Milestone } from "@/lib/db/models/Milestone";
import { Agreement } from "@/lib/db/models/Agreement";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  await connectDB();

  const milestone = await Milestone.findById(id);
  if (!milestone || milestone.status !== "IN_PROGRESS") {
    return NextResponse.json({ error: "Milestone not approvable" }, { status: 403 });
  }

  const agreement = await Agreement.findOne({
    _id: milestone.agreementId,
    brandId: new mongoose.Types.ObjectId(userId),
    status: "ACTIVE",
  });

  if (!agreement) {
    return NextResponse.json({ error: "Agreement not active" }, { status: 403 });
  }

  milestone.status = "COMPLETED";
  await milestone.save();

  agreement.activity.push({
    message: `Milestone "${milestone.title}" approved by brand`,
  });

  await agreement.save();

  return NextResponse.redirect(
    new URL(`/agreements/${agreement._id}`, request.url)
  );
}
