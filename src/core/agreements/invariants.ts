import { AgreementState } from "./aggregate";

/**
 * Used before sending agreement for acceptance
 */
export function isAgreementComplete(state: AgreementState): boolean {
  return (
    !!state.agreementId &&
    !!state.brandId &&
    state.creatorIds.length > 0 &&
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
  if (!state.creatorIds) {
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
// export function assertMilestoneExists(
//   state: AgreementState,
//   milestoneId: string
// ) {
//   if (!state.milestones[milestoneId]) {
//     throw new Error("MILESTONE_NOT_FOUND");
//   }
// }

// /**
//  * Guard: before sending agreement
//  */
// export function assertCanSendAgreement(
//   state: AgreementState
// ) {
//   if (!isAgreementComplete(state)) {
//     throw new Error("AGREEMENT_INCOMPLETE");
//   }
// }


export function assertCanSendAgreement(state: AgreementState) {
  const debug = {
    agreementId: !!state.agreementId,
    brandId: !!state.brandId,
    creators: state.creatorIds.length,
    deliverables: Object.keys(state.deliverables).length,
    milestones: Object.keys(state.milestones).length,
    payment: !!state.payment,
    paymentSplitOk: isPaymentFullySplit(state),
    policy: !!state.policy,
  };

  console.log("SEND_INVARIANT_DEBUG:", debug);

  if (!isAgreementComplete(state)) {
    throw new Error("AGREEMENT_INCOMPLETE");
  }
}


export function assertCanStartExecution(state: AgreementState) {
  if (state.status !== "ACTIVE") {
    throw new Error("EXECUTION_NOT_ALLOWED");
  }

  if ((state as any).executionStarted) {
    throw new Error("EXECUTION_ALREADY_STARTED");
  }
}


export function assertCanSubmitDeliverable(
  state: AgreementState,
  deliverableId: string
) {
  if (state.status !== "ACTIVE") {
    throw new Error("AGREEMENT_NOT_ACTIVE");
  }

  if (!(state as any).executionStarted) {
    throw new Error("EXECUTION_NOT_STARTED");
  }

  const d = state.deliverables[deliverableId];
  if (!d) throw new Error("DELIVERABLE_NOT_FOUND");

  if (d.status !== "PENDING") {
    throw new Error("DELIVERABLE_ALREADY_SUBMITTED");
  }
}

export function assertCanAcceptDeliverable(
  state: AgreementState,
  deliverableId: string
) {
  const d = state.deliverables[deliverableId];
  if (!d) throw new Error("DELIVERABLE_NOT_FOUND");

  if (d.status !== "SUBMITTED") {
    throw new Error("DELIVERABLE_NOT_SUBMITTED");
  }
}


export function assertCanReleasePayment(
  state: AgreementState,
  milestoneId: string,
  amount: number
) {
  const milestone = state.milestones[milestoneId];
  if (!milestone) throw new Error("MILESTONE_NOT_FOUND");

  if (milestone.status !== "COMPLETED") {
    throw new Error("MILESTONE_NOT_COMPLETED");
  }

  const allocated = state.paymentSplits[milestoneId];
  if (!allocated) {
    throw new Error("PAYMENT_SPLIT_NOT_DEFINED");
  }

  const alreadyReleased =
    state.releasedPayments[milestoneId] || 0;

  if (alreadyReleased + amount > allocated) {
    throw new Error("PAYMENT_RELEASE_EXCEEDS_ALLOCATED");
  }
}
