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
      case "AGREEMENT_CREATED":
        state = "DRAFT";
        break;

      case "AGREEMENT_ACKNOWLEDGED":
        state = "ACTIVE";
        break;

      case "EXECUTION_STARTED":
        state = "EXECUTING";
        break;

      case "AGREEMENT_AUTO_COMPLETED":
        return "COMPLETED";
        
      case "AGREEMENT_COMPLETED":
        state = "COMPLETED";
        break;

    }
  }

  return state;
}
