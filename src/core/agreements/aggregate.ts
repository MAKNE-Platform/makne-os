export type AgreementStatus =
  | "DRAFT"
  | "DEFINED"
  | "SENT"
  | "ACTIVE"
  | "PENDING"
  | "REJECTED";

export interface AgreementState {
  agreementId: string | null;
  brandId: string | null;

  creatorIds: string[];
  status: AgreementStatus;

  collaborationType: "INDIVIDUAL" | "GROUP";
  acceptanceRule: "ALL_CREATORS";
  acceptedByCreators: string[];


  meta?: {
    title: string;
    description?: string;
    category: string;
  };

  deliverables: Record<string, any>;
  milestones: Record<string, any>;

  payment?: {
    currency: string;
    totalAmount: number;
    releaseMode: string;
    escrowRequired: boolean;
  };

  paymentSplits: Record<string, number>;

  policy?: {
    cancellationAllowed: boolean;
    cancellationWindowDays?: number;
    revisionLimit: number;
    disputeResolution: string;
  };


  releasedPayments: Record<string, number>;

}

const initialState: AgreementState = {
  agreementId: null,
  brandId: null,
  creatorIds: [],

  collaborationType: "INDIVIDUAL",
  acceptanceRule: "ALL_CREATORS",
  acceptedByCreators: [],

  status: "DRAFT",

  deliverables: {},
  milestones: {},
  paymentSplits: {},


  releasedPayments: {},

};

// REDUCER 

export function reduceAgreement(events: any[]): AgreementState {
  let state: AgreementState = { ...initialState };

  for (const event of events) {
    switch (event.type) {
      case "AGREEMENT_CREATED": {
        state.agreementId = event.payload.agreementId;
        state.brandId = event.payload.brandId;

        state.collaborationType = event.payload.collaborationType;
        state.acceptanceRule = event.payload.acceptanceRule;

        state.status = "DRAFT";
        break;
      }

      case "AGREEMENT_PARTY_ASSIGNED": {
        if (event.payload.role === "CREATOR") {
          if (!state.creatorIds.includes(event.payload.creatorId)) {
            state.creatorIds.push(event.payload.creatorId);
          }
        }
        break;
      }


      case "AGREEMENT_META_DEFINED": {
        state.meta = {
          title: event.payload.title,
          description: event.payload.description,
          category: event.payload.category,
        };
        state.status = "DEFINED";
        break;
      }

      case "DELIVERABLE_CREATED": {
        state.deliverables[event.payload.deliverableId] = {
          ...event.payload,
          status: "PENDING",
        };
        break;
      }

      case "MILESTONE_CREATED": {
        state.milestones[event.payload.milestoneId] = {
          ...event.payload,
        };
        break;
      }

      case "PAYMENT_DEFINED": {
        state.payment = {
          currency: event.payload.currency,
          totalAmount: event.payload.totalAmount,
          releaseMode: event.payload.releaseMode,
          escrowRequired: event.payload.escrowRequired,
        };
        break;
      }

      case "PAYMENT_SPLIT_DEFINED": {
        state.paymentSplits[event.payload.milestoneId] =
          event.payload.amount;
        break;
      }

      case "POLICY_DEFINED": {
        state.policy = {
          cancellationAllowed: event.payload.cancellationAllowed,
          cancellationWindowDays:
            event.payload.cancellationWindowDays,
          revisionLimit: event.payload.revisionLimit,
          disputeResolution: event.payload.disputeResolution,
        };
        break;
      }

      case "AGREEMENT_SENT_FOR_ACCEPTANCE": {
        state.status = "SENT";
        break;
      }

      case "AGREEMENT_ACCEPTED_BY_CREATOR": {
        if (!state.acceptedByCreators.includes(event.actorId)) {
          state.acceptedByCreators.push(event.actorId);
        }

        if (
          state.acceptanceRule === "ALL_CREATORS" &&
          state.acceptedByCreators.length ===
          (state.collaborationType === "GROUP"
            ? state.creatorIds.length
            : 1)
        ) {
          state.status = "ACTIVE";
        }

        break;
      }


      case "AGREEMENT_REJECTED_BY_CREATOR": {
        state.status = "REJECTED";
        break;
      }

      case "EXECUTION_STARTED": {
        // execution phase begins
        state.status = "ACTIVE"; // stays ACTIVE
        (state as any).executionStarted = true;
        break;
      }


      case "DELIVERABLE_SUBMITTED": {
        const d = state.deliverables[event.payload.deliverableId];
        if (d) {
          d.status = "SUBMITTED";
          d.submissionUrl = event.payload.submissionUrl;
          d.submittedAt = event.timestamp;
          d.submittedBy = event.actorId;
        }
        break;
      }

      case "DELIVERABLE_ACCEPTED": {
        const d = state.deliverables[event.payload.deliverableId];
        if (d) {
          d.status = "ACCEPTED";
          d.acceptedAt = event.timestamp;
        }
        break;
      }

      case "DELIVERABLE_REJECTED": {
        const d = state.deliverables[event.payload.deliverableId];
        if (d) {
          d.status = "REJECTED";
          d.rejectionReason = event.payload.reason;
        }
        break;
      }


      case "PAYMENT_RELEASED":
        
      case "PAYMENT_AUTO_RELEASED": {
        const { milestoneId, amount } = event.payload;

        state.releasedPayments[milestoneId] =
          (state.releasedPayments[milestoneId] || 0) + amount;

        break;
      }



      default:
        break;
    }
  }

  return state;
}
