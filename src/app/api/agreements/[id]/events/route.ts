export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: agreementId } = await context.params;

  const db = await getDb();

  const events = await db
    .collection("events")
    .find({ agreementId })
    .sort({ _id: 1 }) // insertion order = truth
    .toArray();

  if (events.length === 0) {
    return NextResponse.json(
      { error: "No events found for agreement" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    agreementId,
    count: events.length,
    events,
  });
}
