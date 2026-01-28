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
  const { id } = await context.params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const formData = await request.formData();
  const deliverableId = formData.get("deliverableId") as string;

  await connectDB();

  // ❗ Prevent deletion if used by milestones
  const used = await Milestone.findOne({
    agreementId: new mongoose.Types.ObjectId(id),
    deliverableIds: new mongoose.Types.ObjectId(deliverableId),
  });

  if (used) {
    return NextResponse.json(
      { error: "Deliverable is linked to a milestone" },
      { status: 400 }
    );
  }

  const agreement = await Agreement.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      brandId: new mongoose.Types.ObjectId(userId),
      status: "DRAFT",
    },
    {
      $pull: {
        deliverables: { _id: new mongoose.Types.ObjectId(deliverableId) },
      },
    }
  );

  if (!agreement) {
    return NextResponse.json(
      { error: "Agreement not editable" },
      { status: 403 }
    );
  }

  return NextResponse.redirect(
    new URL(`/agreements/${id}`, request.url)
  );
}
