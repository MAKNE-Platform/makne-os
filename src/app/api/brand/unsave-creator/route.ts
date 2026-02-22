import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { SavedCreator } from "@/lib/db/models/SavedCreator";

export async function POST(request: Request) {
  const { creatorId } = await request.json();

  const cookieStore = await cookies();
  const brandId = cookieStore.get("auth_session")?.value;

  if (!brandId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  await SavedCreator.findOneAndDelete({
    brandId: new mongoose.Types.ObjectId(brandId),
    creatorId: new mongoose.Types.ObjectId(creatorId),
  });

  return NextResponse.json({ success: true });
}