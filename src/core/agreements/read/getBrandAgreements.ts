import { getDb } from "@/lib/db";
import { projectAgreement } from "@/core/agreements/read-model";

export async function getBrandAgreements(brandId: string) {
  const db = await getDb();
  const eventsCollection = db.collection("events");

  // 1️⃣ Find agreements created by this brand
  const createdEvents = await eventsCollection
    .find({
      type: "AGREEMENT_CREATED",
      "payload.brandId": brandId,
    })
    .toArray();

  const agreementIds = createdEvents.map(e => e.agreementId);

  if (agreementIds.length === 0) {
    return [];
  }

  // 2️⃣ Fetch all events for those agreements
  const allEvents = await eventsCollection
    .find({
      agreementId: { $in: agreementIds },
    })
    .sort({ timestamp: 1 })
    .toArray();

  // 3️⃣ Group by agreementId
  const grouped = new Map<string, any[]>();

  for (const event of allEvents) {
    if (!grouped.has(event.agreementId)) {
      grouped.set(event.agreementId, []);
    }
    grouped.get(event.agreementId)!.push(event);
  }

  // 4️⃣ Project
  return Array.from(grouped.values()).map(events =>
    projectAgreement(events)
  );
}
