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
  const titles = formData.getAll("deliverable_title") as string[];
  const descriptions = formData.getAll("deliverable_description") as string[];

  await connectDB();

  const agreement = await Agreement.findOne({
    _id: new mongoose.Types.ObjectId(id),
    brandId: new mongoose.Types.ObjectId(userId),
    status: "DRAFT",
  });

  if (!agreement || !Array.isArray(agreement.deliverables)) {
    return NextResponse.json(
      { error: "Agreement not editable" },
      { status: 403 }
    );
  }

  // 🔑 Preserve existing deliverable IDs
  const updatedDeliverables = agreement.deliverables
    .map((existing: any, index: number) => {
      const title = titles[index]?.trim();
      if (!title) return null;

      return {
        _id: existing._id, // ✅ preserve ID
        title,
        description: descriptions[index]?.trim() || undefined,
      };
    })
    .filter(Boolean);

  if (updatedDeliverables.length === 0) {
    return NextResponse.json(
      { error: "At least one deliverable is required" },
      { status: 400 }
    );
  }

  agreement.deliverables = updatedDeliverables;

  await agreement.save();

  // ✅ Redirect back to SAME agreement detail page
  return NextResponse.redirect(
    new URL(`/agreements/${id}`, request.url)
  );
}
