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
      createdBy: "BRAND",
    },
    timestamp: new Date().toISOString(),
    version: 1,
  };

  await dispatchEvent(event);
}


import { reduceAgreement } from "../aggregate";
import {
  assertAgreementNotLocked,
  assertCanSendAgreement,
} from "../invariants";

export async function sendForAcceptance(events: any[]) {
  const state = reduceAgreement(events);

  assertAgreementNotLocked(state);
  assertCanSendAgreement(state);

  // emit AGREEMENT_SENT_FOR_ACCEPTANCE
}
