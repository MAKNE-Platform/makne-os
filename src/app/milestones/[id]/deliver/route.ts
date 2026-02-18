import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Milestone } from "@/lib/db/models/Milestone";
import { Agreement } from "@/lib/db/models/Agreement";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { logAudit } from "@/lib/audit/logAudit";
import { User } from "@/lib/db/models/User";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid milestone id" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const formData = await request.formData();
  const note = formData.get("note") as string | null;
  const linksRaw = formData.get("links") as string | null;
  const files = formData.getAll("files") as File[];

  await connectDB();

  const milestone = await Milestone.findById(
    new mongoose.Types.ObjectId(id)
  );

  if (!milestone) {
    return NextResponse.json(
      { error: "Milestone not found" },
      { status: 404 }
    );
  }

  if (!["PENDING", "REVISION"].includes(milestone.status)) {
    return NextResponse.json(
      { error: "Milestone not open for submission" },
      { status: 400 }
    );
  }

  const agreement = await Agreement.findById(milestone.agreementId);
  const brand = await User.findById(agreement.brandId);


  if (
    !agreement ||
    agreement.creatorId?.toString() !== userId
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  if (agreement.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Agreement not active" },
      { status: 400 }
    );
  }

  const links =
    linksRaw
      ?.split(",")
      .map((l) => l.trim())
      .filter(Boolean) || [];

  const uploadDir = path.join(
    process.cwd(),
    "uploads",
    milestone._id.toString()
  );

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storedFiles = [];

  for (const file of files) {
    if (!file || !file.name || file.size === 0) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, file.name);

    fs.writeFileSync(filePath, buffer);

    storedFiles.push({
      name: file.name,
      url: `/api/files/${milestone._id}/${file.name}`,
    });
  }

  // ✅ Save submission
  milestone.submission = {
    note: note || undefined,
    files: storedFiles,
    links,
    submittedAt: new Date(),
  };

  milestone.status = "IN_PROGRESS";
  await milestone.save();


  const creatorUser = await User.findById(agreement.creatorId).lean<{
    email: string;
  }>();

  // 🧾 AUDIT LOG (KEY ADDITION)
  await logAudit({
    actorType: "CREATOR",
    actorId: new mongoose.Types.ObjectId(userId),
    action: "DELIVERABLE_SUBMITTED",
    entityType: "MILESTONE",
    entityId: milestone._id,
    metadata: {
      brandId: agreement.brandId.toString(),
      agreementId: agreement._id.toString(),
      creatorName: creatorUser?.email?.split("@")[0] ?? "Creator",
      milestoneTitle: milestone.title,
      amount: milestone.amount,

      note: note || null,
      links,

      creatorEmail: brand.email,
    }

  });

  // 📝 Activity log (existing)
  await Agreement.findByIdAndUpdate(
    milestone.agreementId,
    {
      $push: {
        activity: {
          message: `Work submitted for milestone: ${milestone.title}`,
          createdAt: new Date(),
        },
      },
    }
  );

  revalidatePath(`/agreements/${milestone.agreementId}`);

  return NextResponse.json({ success: true });
}
