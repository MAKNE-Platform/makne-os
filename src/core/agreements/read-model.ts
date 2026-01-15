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
  if (!events || events.length === 0) {
    throw new Error("NO_EVENTS_FOR_AGREEMENT");
  }

  const agreementId = events[0].agreementId;

  let title = "Untitled Agreement";
  const createdAt = events[0].timestamp;

  // Use Set to avoid duplicate participants
  const participants = new Set<string>();

  for (const event of events) {
    switch (event.type as EventType) {
      /**
       * Agreement creation
       */
      case "AGREEMENT_CREATED":
        break;

      /**
       * Agreement metadata
       */
      case "AGREEMENT_META_DEFINED":
        if (event.payload?.title) {
          title = event.payload.title;
        }
        break;

      /**
       * Party assignment
       */
      case "AGREEMENT_PARTY_ASSIGNED": {
        const payload = event.payload;

        if (payload?.creatorId) {
          participants.add(payload.creatorId);
        }

        if (payload?.userId) {
          participants.add(payload.userId);
        }

        if (Array.isArray(payload?.userIds)) {
          payload.userIds.forEach((id: string) =>
            participants.add(id)
          );
        }

        if (Array.isArray(payload?.invitedUserIds)) {
          payload.invitedUserIds.forEach((id: string) =>
            participants.add(id)
          );
        }

        break;
      }

      /**
       * State handled centrally
       */
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
    participants: Array.from(participants),
  };
}


