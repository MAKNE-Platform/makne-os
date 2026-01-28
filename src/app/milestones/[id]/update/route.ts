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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.redirect(new URL("/agreements", request.url));
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const amount = Number(formData.get("amount"));
  const deliverableIds = formData
    .getAll("deliverableIds[]")
    .map((id) => new mongoose.Types.ObjectId(id as string));

  if (!title || !amount || deliverableIds.length === 0) {
    return NextResponse.json(
      { error: "Invalid milestone data" },
      { status: 400 }
    );
  }

  await connectDB();

  const milestone = await Milestone.findById(id);
  if (!milestone) {
    return NextResponse.redirect(new URL("/agreements", request.url));
  }

  const agreement = await Agreement.findOne({
    _id: milestone.agreementId,
    brandId: new mongoose.Types.ObjectId(userId),
    status: "DRAFT",
  });

  if (!agreement) {
    return NextResponse.json(
      { error: "Agreement not editable" },
      { status: 403 }
    );
  }

  milestone.title = title;
  milestone.amount = amount;
  milestone.deliverableIds = deliverableIds;

  await milestone.save();

  return NextResponse.redirect(
    new URL(`/agreements/${agreement._id}`, request.url)
  );
}
