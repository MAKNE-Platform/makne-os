import { EventType } from "@/core/events/types";

export type AgreementState =
  | "DRAFT"
  | "NEGOTIATING"
  | "ACTIVE"
  | "EXECUTING"
  | "COMPLETED"
  | "PARTIALLY_COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export function deriveAgreementState(
  events: { type: EventType }[]
): AgreementState {
  let state: AgreementState = "DRAFT";
  let hasCreatorAssigned = false;
  let hasCreatorAccepted = false;

  for (const event of events) {
    switch (event.type) {

      // ✅ Single, authoritative rejection event
      case "AGREEMENT_REJECTED_BY_CREATOR":
        return "REJECTED";

      case "AGREEMENT_CREATED":
        state = "DRAFT";
        break;

      case "AGREEMENT_PARTY_ASSIGNED":
        hasCreatorAssigned = true;
        if (state === "DRAFT") {
          state = "NEGOTIATING";
        }
        break;

      /**
       * 🔹 Legacy explicit activation path (kept intentionally)
       */
      case "AGREEMENT_ACKNOWLEDGED":
        state = "ACTIVE";
        break;

      /**
       * 🔹 Creator acceptance path
       */
      case "AGREEMENT_ACCEPTED_BY_CREATOR":
        hasCreatorAccepted = true;
        break;

      case "EXECUTION_STARTED":
        state = "EXECUTING";
        break;

      case "AGREEMENT_AUTO_COMPLETED":
        return "COMPLETED";

      case "AGREEMENT_COMPLETED":
        state = "COMPLETED";
        break;

      case "AGREEMENT_CANCELLED":
        state = "CANCELLED";
        break;
    }
  }

  /**
   * 🔒 Safety: if no creator was ever assigned, remain DRAFT
   */
  if (!hasCreatorAssigned) {
    return "DRAFT";
  }

  /**
   * ✅ Activation via acceptance
   */
  if (
    state === "NEGOTIATING" &&
    hasCreatorAccepted
  ) {
    return "ACTIVE";
  }

  return state;
}
