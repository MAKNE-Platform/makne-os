export type AgreementStatus =
  | "DRAFT"
  | "DEFINED"
  | "SENT"
  | "ACTIVE"
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


      default:
        break;
    }
  }

  return state;
}
