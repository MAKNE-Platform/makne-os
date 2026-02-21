import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { Milestone } from "@/lib/db/models/Milestone";
import { sendAgreement } from "@/lib/domain/agreements/sendAgreement";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const formData = await request.formData();
  const creatorEmail = formData.get("creatorEmail") as string;

  if (!creatorEmail) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const brandId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!brandId || role !== "BRAND") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  await connectDB();

  const creator = await User.findOne({
    email: creatorEmail,
    role: "CREATOR",
  });

  if (!creator) {
    return NextResponse.json(
      { error: "Creator not found" },
      { status: 404 }
    );
  }

  const milestones = await Milestone.find({
    agreementId: new mongoose.Types.ObjectId(id),
  });

  const agreement = await Agreement.findById(
    new mongoose.Types.ObjectId(id)
  );

  if (!agreement) {
    return NextResponse.json(
      { error: "Agreement not found" },
      { status: 404 }
    );
  }

  if (!agreement.policies?.paymentTerms) {
    return NextResponse.json(
      { error: "Define policies before sending agreement" },
      { status: 400 }
    );
  }

  if (milestones.length === 0) {
    return NextResponse.json(
      { error: "Add at least one milestone before sending" },
      { status: 400 }
    );
  }

  // ✅ SINGLE source of truth
  await sendAgreement({
    agreementId: new mongoose.Types.ObjectId(id),
    brandId: new mongoose.Types.ObjectId(brandId),
    creatorId: new mongoose.Types.ObjectId(creator._id),
    creatorEmail: creator.email,
  });

  const acceptHeader = request.headers.get("accept");

  if (acceptHeader?.includes("application/json")) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.redirect(
    new URL("/brand/dashboard", request.url)
  );
}
