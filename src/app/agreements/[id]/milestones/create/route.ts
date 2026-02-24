import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { Milestone } from "@/lib/db/models/Milestone";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ FIX: await params
  const { id } = await context.params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  await connectDB();

  // ✅ FIXED: use awaited id
  const agreement = await Agreement.findOne({
    _id: new mongoose.Types.ObjectId(id),
    brandId: new mongoose.Types.ObjectId(userId),
    status: "DRAFT",
  });

  if (!agreement) {
    return NextResponse.json(
      { error: "Agreement not editable" },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const amount = Number(formData.get("amount"));
  const deliverableIds = formData
    .getAll("deliverableIds[]")
    .map((d) => new mongoose.Types.ObjectId(d as string));

  if (!title || !amount || deliverableIds.length === 0) {
    return NextResponse.json(
      { error: "Invalid milestone data" },
      { status: 400 }
    );
  }

  await Milestone.create({
    agreementId: agreement._id,
    title,
    amount,
    deliverableIds,
    status: "PENDING",
  });

  return NextResponse.redirect(
    new URL(`/agreements/${id}?status=MILESTONE_CREATED`, request.url)
  );
}
