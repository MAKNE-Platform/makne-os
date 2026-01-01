export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { projectDeliverables } from "@/core/deliverables/read-model";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const db = await getDb();

  const events = await db
    .collection("events")
    .find({ agreementId: id })
    .sort({ timestamp: 1 })
    .toArray();

  return NextResponse.json(
    projectDeliverables(events)
  );
}
