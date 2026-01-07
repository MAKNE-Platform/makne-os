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
  let participants: string[] = [];
  let createdAt = events[0].timestamp;

  for (const event of events) {
    switch (event.type as EventType) {

      /**
       * Agreement creation
       * (timestamp already handled)
       */
      case "AGREEMENT_CREATED":
        break;

      /**
       * ✅ Agreement metadata (title, description, etc.)
       */
      case "AGREEMENT_META_DEFINED":
        if (event.payload?.title) {
          title = event.payload.title;
        }
        break;

      /**
       * ✅ Party assignment (creators added to agreement)
       */
      case "AGREEMENT_PARTY_ASSIGNED": {
        const payload = event.payload;

        if (payload?.userId) {
          participants.push(payload.userId);
        }

        if (payload?.creatorId) {
          participants.push(payload.creatorId);
        }

        if (Array.isArray(payload?.userIds)) {
          participants.push(...payload.userIds);
        }

        if (Array.isArray(payload?.invitedUserIds)) {
          participants.push(...payload.invitedUserIds);
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
    participants,
  };
}
