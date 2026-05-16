import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Milestone } from "@/lib/db/models/Milestone";
import { Agreement } from "@/lib/db/models/Agreement";
import { logAudit } from "@/lib/audit/logAudit";
import { User } from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";
import { syncMilestoneTask } from "@/lib/tasks/syncMilestoneTask";

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

  const creator = await User.findById(agreement.creatorId);
  if (!creator) {
    return NextResponse.json(
      { error: "Creator not found" },
      { status: 404 }
    );
  }


  // 🔒 Only allow revision when work is submitted
  if (milestone.status !== "IN_PROGRESS") {
    return NextResponse.json(
      { error: "Cannot request changes at this stage" },
      { status: 400 }
    );
  }

  const formData = await request.formData();

  const revisionFeedback =
    formData.get("revisionFeedback")?.toString().trim();

  if (!revisionFeedback) {
    return NextResponse.json(
      {
        error: "Revision feedback is required",
      },
      { status: 400 }
    );
  }

  milestone.revisionFeedback =
    revisionFeedback;

  console.log("REVISION FEEDBACK:", revisionFeedback);

  console.log(
    "MILESTONE BEFORE SAVE:",
    milestone
  );

  milestone.status = "REVISION";
  await milestone.save();

  await syncMilestoneTask({
    agreementId:
      agreement._id.toString(),

    milestoneId:
      milestone._id.toString(),

    completed: false,
  });

  const updatedMilestone =
    await Milestone.findById(milestone._id);

  console.log(
    "UPDATED MILESTONE:",
    updatedMilestone
  );

  await logAudit({
    actorType: "BRAND",
    actorId: new mongoose.Types.ObjectId(userId),
    action: "MILESTONE_REVISION_REQUESTED",
    entityType: "MILESTONE",
    entityId: milestone._id,
    metadata: {
      creatorId: agreement.creatorId.toString(),
      creatorEmail: creator.email,
      milestoneTitle: milestone.title,
      agreementId: agreement._id.toString(),
    },
  });


  await Agreement.findByIdAndUpdate(agreement._id, {
    $push: {
      activity: {
        message: `Revision requested for milestone: ${milestone.title}`,
        createdAt: new Date(),
      },
    },
  });


  revalidatePath(`/agreements/${agreement._id}`);

  // Force page reload
  const response = NextResponse.redirect(
    new URL(`/agreements/${agreement._id}?status=MILESTONE_REVISION`, request.url)
  );
  response.headers.set("Cache-Control", "no-store");

  return response;
}
