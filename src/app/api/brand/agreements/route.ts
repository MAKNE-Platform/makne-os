import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { projectAgreement } from "@/core/agreements/read-model";
import { EventType } from "@/core/events/types";

export async function GET() {
  // TEMP auth (consistent with creation API)
  const brandId = "brand_1";

  const db = await getDb();
  const eventsCollection = db.collection("events");

  // 1️⃣ Fetch all events related to this brand’s agreements
  // We first find agreements CREATED by this brand
  const createdEvents = await eventsCollection
    .find({
      type: "AGREEMENT_CREATED",
      "payload.brandId": brandId,
    })
    .toArray();

  const agreementIds = createdEvents.map(
    (event) => event.agreementId
  );

  if (agreementIds.length === 0) {
    return NextResponse.json([]);
  }

  // 2️⃣ Fetch ALL events for those agreements
  const allEvents = await eventsCollection
    .find({
      agreementId: { $in: agreementIds },
    })
    .sort({ timestamp: 1 }) // critical for deterministic projection
    .toArray();

  // 3️⃣ Group events by agreementId
  const eventsByAgreement = new Map<string, any[]>();

  for (const event of allEvents) {
    if (!eventsByAgreement.has(event.agreementId)) {
      eventsByAgreement.set(event.agreementId, []);
    }
    eventsByAgreement.get(event.agreementId)!.push(event);
  }

  // 4️⃣ Project agreements using EXISTING read model
  const agreements = Array.from(eventsByAgreement.values()).map(
    (events) => projectAgreement(events)
  );

  return NextResponse.json(agreements);
}
