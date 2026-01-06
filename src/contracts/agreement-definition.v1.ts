/**
 * Agreement Definition Contract v1
 * --------------------------------
 * Mirrors backend command handlers exactly.
 * DO NOT modify without backend changes.
 */

/* ---------------------------------- */
/* Create Agreement */
/* ---------------------------------- */

export interface CreateAgreementCommand {
  brandId: string;
}

/* ---------------------------------- */
/* Define Meta */
/* ---------------------------------- */

export interface DefineMetaCommand {
  agreementId: string;
  title: string;            // min length: 3
  description?: string;
  category: string;
}

/* ---------------------------------- */
/* Assign Creator */
/* ---------------------------------- */

export interface AssignCreatorCommand {
  agreementId: string;
  creatorId: string;
}

/* ---------------------------------- */
/* Deliverables */
/* ---------------------------------- */

export interface AddDeliverableCommand {
  agreementId: string;
  name: string;             // min length: 3
  platform: string;
  format: string;
  quantity: number;         // > 0
  dueInDays: number;        // > 0
  requiresApproval: boolean;
}

/* ---------------------------------- */
/* Milestones */
/* ---------------------------------- */

export type MilestoneUnlockRule =
  | "ALL_COMPLETED"
  | "ANY_COMPLETED";

export interface AddMilestoneCommand {
  agreementId: string;
  name: string;
  deliverableIds: string[]; // must exist
  unlockRule: MilestoneUnlockRule;
}

/* ---------------------------------- */
/* Policy */
/* ---------------------------------- */

export type DisputeResolution =
  | "PLATFORM"
  | "ARBITRATION";

export interface DefinePolicyCommand {
  agreementId: string;
  cancellationAllowed: boolean;
  cancellationWindowDays?: number;
  revisionLimit: number;    // >= 0
  disputeResolution: DisputeResolution;
}

/* ---------------------------------- */
/* Payment */
/* ---------------------------------- */

export type Currency = "INR" | "USD";
export type PaymentReleaseMode = "MANUAL" | "AUTO";

export interface DefinePaymentCommand {
  agreementId: string;
  currency: Currency;
  totalAmount: number;      // > 0
  releaseMode: PaymentReleaseMode;
  escrowRequired: boolean;
}

/* ---------------------------------- */
/* Payment Split */
/* ---------------------------------- */

export interface DefinePaymentSplitCommand {
  agreementId: string;
  milestoneId: string;      // must exist
  amount: number;           // > 0
}

/* ---------------------------------- */
/* Send for Acceptance */
/* ---------------------------------- */

export interface SendForAcceptanceCommand {
  agreementId: string;
}

/* ---------------------------------- */
/* Strict Execution Order */
/* ---------------------------------- */

export const AGREEMENT_DEFINITION_ORDER = [
  "CreateAgreement",
  "DefineMeta",
  "AssignCreator",
  "AddDeliverable",
  "AddMilestone",
  "DefinePolicy",
  "DefinePayment",
  "DefinePaymentSplit",
  "SendForAcceptance",
] as const;

export type AgreementDefinitionStep =
  typeof AGREEMENT_DEFINITION_ORDER[number];
