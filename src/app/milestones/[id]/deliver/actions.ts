import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Milestone } from "@/lib/db/models/Milestone";
import { Agreement } from "@/lib/db/models/Agreement";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const formData = await request.formData();
  const note = formData.get("note") as string;
  const linksRaw = formData.get("links") as string;
  const files = formData.getAll("files") as File[];

  const links = linksRaw
    ? linksRaw.split(",").map((l) => l.trim())
    : [];

  await connectDB();

  const milestone = await Milestone.findOne({
    _id: new mongoose.Types.ObjectId(context.params.id),
    status: "PENDING",
  });

  if (!milestone) {
    return NextResponse.json({ error: "Invalid milestone" }, { status: 400 });
  }

  const agreement = await Agreement.findOne({
    _id: milestone.agreementId,
    status: "ACTIVE",
  });

  if (!agreement) {
    return NextResponse.json(
      { error: "Agreement not accepted yet" },
      { status: 403 }
    );
  }


  if (!milestone) {
    return NextResponse.json({ error: "Invalid milestone" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const uploadedFiles = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    uploadedFiles.push({
      name: file.name,
      url: `/uploads/${fileName}`,
      type: file.type,
      size: file.size,
    });
  }

  milestone.status = "IN_PROGRESS";
  milestone.submission = {
    note,
    files: uploadedFiles,
    links,
  };

  await milestone.save();

  await Agreement.findByIdAndUpdate(milestone.agreementId, {
    $push: {
      activity: { message: "Milestone delivered with files" },
    },
  });

  return NextResponse.redirect(
    new URL(`/agreements/${milestone.agreementId}`, request.url)
  );
}
