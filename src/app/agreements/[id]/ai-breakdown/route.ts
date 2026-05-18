import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";

import { generateCreatorAgreementSummary } from "@/services/ai/creator-agreement-summary.service";
import { Milestone } from "@/lib/db/models/Milestone";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const cookieStore = await cookies();

  const userId =
    cookieStore.get("auth_session")?.value;

  const role =
    cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const agreement = await Agreement.findOne({
    _id: new mongoose.Types.ObjectId(id),
    creatorId: new mongoose.Types.ObjectId(userId),
  });

  if (!agreement) {
    return NextResponse.json(
      { error: "Agreement not found" },
      { status: 404 }
    );
  }

  // RETURN EXISTING SUMMARY
  if (agreement.creatorAiSummary) {
    return NextResponse.json({
      summary:
        agreement.creatorAiSummary,
    });
  }

  // GENERATE NEW
  const aiData =
    await generateCreatorAgreementSummary({
      title: agreement.title,

      description:
        agreement.description,

      deliverables:
        agreement.deliverables || [],

      policies:
        agreement.policies || {},
    });


  const milestones =
    await Milestone.find({
      agreementId: agreement._id,
    });

  const milestoneTasks =
    milestones.map((m: any) => ({

      title:
        `Complete milestone: ${m.title}`,

      type: "MILESTONE",

      completed:
        m.status === "COMPLETED",

      autoTrack: true,

      sourceType: "MILESTONE",

      sourceId:
        m._id.toString(),
    }));

  agreement.creatorAiSummary =
    aiData.summary;

  agreement.creatorTasks =
    milestoneTasks;

  agreement.creatorAiTasks =
    aiData.tasks;

  try {
    await agreement.save();
  } catch (error: any) {
    console.error("Agreement save failed:", error);
    return NextResponse.json(
      { error: "Failed to save agreement AI breakdown" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    summary: aiData.summary,
    tasks: aiData.tasks,
  });
}