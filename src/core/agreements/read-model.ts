import { EventType } from "@/core/events/types";
import { deriveAgreementState, AgreementState } from "./state";

export interface AgreementSummary {
  agreementId: string;
  title: string;
  state: AgreementState;
  createdAt: string;
  participants: string[];
}

export function projectAgreement(events: any[]): AgreementSummary {
  const agreementId = events[0].agreementId;

  let title = "Untitled Agreement";
  let participants: string[] = [];
  let createdAt = events[0].timestamp;

  for (const event of events) {
    switch (event.type as EventType) {
      case "AGREEMENT_CREATED":
        title = event.payload?.title ?? title;
        break;

      case "AGREEMENT_SHARED":
        participants = [
          ...participants,
          ...(event.payload?.invitedUserIds ?? []),
        ];
        break;

      // 🔹 Auto-complete event
      // No local projection needed here.
      // State transition is handled by deriveAgreementState.
      case "AGREEMENT_AUTO_COMPLETED":
        break;
    }
  }

  return {
    agreementId,
    title,
    state: deriveAgreementState(
      events.map((e) => ({ type: e.type }))
    ),
    createdAt,
    participants,
  };
}
