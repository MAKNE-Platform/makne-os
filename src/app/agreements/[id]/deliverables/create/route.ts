import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connect";
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

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;

  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  await connectDB();

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

  agreement.deliverables.push({
    _id: new mongoose.Types.ObjectId(),
    title,
    description: description || undefined,
  });

  await agreement.save();

  return NextResponse.redirect(
    new URL(`/agreements/${id}?status=DELIVERABLE_CREATED`, request.url)
  );
}
