import { EventType } from "@/core/events/types";

export type AgreementState =
  | "DRAFT"
  | "NEGOTIATING"
  | "ACTIVE"
  | "EXECUTING"
  | "COMPLETED"
  | "PARTIALLY_COMPLETED"
  | "CANCELLED";

export function deriveAgreementState(
  events: { type: EventType }[]
): AgreementState {
  let state: AgreementState = "DRAFT";

  for (const event of events) {
    switch (event.type) {
      case "AGREEMENT_SHARED":
        state = "NEGOTIATING";
        break;
      case "AGREEMENT_ACTIVATED":
        state = "ACTIVE";
        break;
      case "EXECUTION_STARTED":
        state = "EXECUTING";
        break;
      case "AGREEMENT_COMPLETED":
        state = "COMPLETED";
        break;
      case "AGREEMENT_PARTIALLY_COMPLETED":
        state = "PARTIALLY_COMPLETED";
        break;
      case "AGREEMENT_CANCELLED":
        state = "CANCELLED";
        break;
    }
  }

  return state;
}
