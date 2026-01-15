import { v4 as uuid } from "uuid";
import { dispatchEvent } from "@/core/events/dispatcher";

export async function createAgreement({
  agreementId,
  brandId,
  actorId,
}: {
  agreementId: string;
  brandId: string;
  actorId: string;
}) {
  const event = {
    eventId: uuid(),
    agreementId,
    type: "AGREEMENT_CREATED",
    actorId,
    actorRole: "BRAND",
    payload: {
      agreementId,
      brandId,

      // ✅ FIX: identity, not role
      createdBy: actorId,
    },
    timestamp: new Date().toISOString(),
    version: 1,
  } as const; // ✅ CRITICAL

  await dispatchEvent(event);
}
