// src/app/api/debug/audit-test/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { logAudit } from "@/lib/audit/logAudit";

export async function GET() {
  await connectDB();

  await logAudit({
    actorType: "SYSTEM",
    action: "AUDIT_TEST",
    entityType: "TEST",
    entityId: new mongoose.Types.ObjectId(),
  });

  return NextResponse.json({ ok: true });
}
