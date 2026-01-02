import { AgreementState } from "./aggregate";

/**
 * Used before sending agreement for acceptance
 */
export function isAgreementComplete(state: AgreementState): boolean {
  return (
    !!state.agreementId &&
    !!state.brandId &&
    !!state.creatorId &&
    Object.keys(state.deliverables).length > 0 &&
    Object.keys(state.milestones).length > 0 &&
    !!state.payment &&
    isPaymentFullySplit(state) &&
    !!state.policy
  );
}

/**
 * Payment split must exactly match total amount
 */
export function isPaymentFullySplit(
  state: AgreementState
): boolean {
  if (!state.payment) return false;

  const totalSplit = Object.values(state.paymentSplits).reduce(
    (sum, amount) => sum + amount,
    0
  );

  return totalSplit === state.payment.totalAmount;
}

/**
 * Guard: agreement must NOT be sent
 */
export function assertAgreementNotLocked(
  state: AgreementState
) {
  if (state.status === "SENT") {
    throw new Error("AGREEMENT_LOCKED");
  }
}

/**
 * Guard: creator must exist
 */
export function assertCreatorAssigned(
  state: AgreementState
) {
  if (!state.creatorId) {
    throw new Error("CREATOR_NOT_ASSIGNED");
  }
}

/**
 * Guard: deliverable must exist
 */
export function assertDeliverableExists(
  state: AgreementState,
  deliverableId: string
) {
  if (!state.deliverables[deliverableId]) {
    throw new Error("DELIVERABLE_NOT_FOUND");
  }
}

/**
 * Guard: milestone must exist
 */
export function assertMilestoneExists(
  state: AgreementState,
  milestoneId: string
) {
  if (!state.milestones[milestoneId]) {
    throw new Error("MILESTONE_NOT_FOUND");
  }
}

/**
 * Guard: before sending agreement
 */
export function assertCanSendAgreement(
  state: AgreementState
) {
  if (!isAgreementComplete(state)) {
    throw new Error("AGREEMENT_INCOMPLETE");
  }
}
