import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "CREATOR") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { portfolio } = body;

    if (!Array.isArray(portfolio)) {
      return NextResponse.json(
        { error: "Invalid portfolio data" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await CreatorProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { portfolio },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PORTFOLIO_SAVE_ERROR", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
