import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { SavedCreator } from "@/lib/db/models/SavedCreator";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const brandId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!brandId || role !== "BRAND") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { creatorId } = await req.json();

  if (!mongoose.Types.ObjectId.isValid(creatorId)) {
    return NextResponse.json({ error: "Invalid creator" }, { status: 400 });
  }

  await connectDB();

  try {
    await SavedCreator.create({
      brandId: new mongoose.Types.ObjectId(brandId),
      creatorId: new mongoose.Types.ObjectId(creatorId),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: true }); // ignore duplicate
  }
}