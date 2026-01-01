export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { projectAgreement } from "@/core/agreements/read-model";

export async function GET() {
  const db = await getDb();

  const events = await db
    .collection("events")
    .find({})
    .sort({ timestamp: 1 })
    .toArray();

  const grouped: Record<string, any[]> = {};

  for (const event of events) {
    grouped[event.agreementId] ||= [];
    grouped[event.agreementId].push(event);
  }

  const agreements = Object.values(grouped).map(projectAgreement);

  return NextResponse.json(agreements);
}
