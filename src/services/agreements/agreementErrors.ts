/**
 * Agreement Errors
 * ----------------
 * Maps backend invariant / domain errors to
 * frontend-understandable meanings.
 *
 * This file should grow slowly and intentionally.
 */

export type AgreementErrorCode =

  | "INVALID_STATE"
  | "MISSING_DELIVERABLES"
  | "PAYMENT_MISMATCH"

  // Agreement lifecycle
  | "AGREEMENT_LOCKED"
  | "AGREEMENT_NOT_READY"
  | "AGREEMENT_ALREADY_SENT"

  // Meta
  | "INVALID_TITLE"

  // Creators
  | "CREATOR_ALREADY_ASSIGNED"

  // Deliverables
  | "INVALID_DELIVERABLE_NAME"
  | "INVALID_QUANTITY"
  | "INVALID_DUE_DATE"
  | "DELIVERABLE_NOT_FOUND"

  // Milestones
  | "INVALID_MILESTONE_NAME"
  | "NO_DELIVERABLES_LINKED"
  | "INVALID_UNLOCK_RULE"

  // Policy
  | "INVALID_REVISION_LIMIT"
  | "INVALID_CANCELLATION_WINDOW"

  // Payment
  | "INVALID_PAYMENT_AMOUNT"
  | "INVALID_CURRENCY"
  | "INVALID_RELEASE_MODE"
  | "PAYMENT_NOT_DEFINED"

  // Payment split
  | "INVALID_SPLIT_AMOUNT"
  | "PAYMENT_SPLIT_EXCEEDS_TOTAL"
  | "MILESTONE_NOT_FOUND"

  // Fallback
  | "UNKNOWN_ERROR";

/**
 * Human-readable messages.
 * UI can use these directly or override them.
 */
export const AGREEMENT_ERROR_MESSAGES: Record<
  AgreementErrorCode,
  string
> = {
  // ✅ ADD THESE (currently missing)
  INVALID_STATE:
    "This action is not allowed in the current agreement state.",

  MISSING_DELIVERABLES:
    "At least one deliverable must be added before continuing.",

  PAYMENT_MISMATCH:
    "Payment details do not align with milestones or splits.",

  // Agreement lifecycle
  AGREEMENT_LOCKED:
    "This agreement can no longer be modified.",

  AGREEMENT_NOT_READY:
    "The agreement is not ready for this action.",

  AGREEMENT_ALREADY_SENT:
    "This agreement has already been sent for acceptance.",

  // Meta
  INVALID_TITLE:
    "Title must be at least 3 characters long.",

  // Creators
  CREATOR_ALREADY_ASSIGNED:
    "This creator is already part of the agreement.",

  // Deliverables
  INVALID_DELIVERABLE_NAME:
    "Deliverable name must be at least 3 characters long.",

  INVALID_QUANTITY:
    "Deliverable quantity must be greater than zero.",

  INVALID_DUE_DATE:
    "Deliverable due date must be in the future.",

  DELIVERABLE_NOT_FOUND:
    "One or more referenced deliverables do not exist.",

  // Milestones
  INVALID_MILESTONE_NAME:
    "Milestone name must be at least 3 characters long.",

  NO_DELIVERABLES_LINKED:
    "A milestone must be linked to at least one deliverable.",

  INVALID_UNLOCK_RULE:
    "Invalid milestone unlock rule selected.",

  // Policy
  INVALID_REVISION_LIMIT:
    "Revision limit cannot be negative.",

  INVALID_CANCELLATION_WINDOW:
    "Cancellation window is invalid.",

  // Payment
  INVALID_PAYMENT_AMOUNT:
    "Payment amount must be greater than zero.",

  INVALID_CURRENCY:
    "Unsupported payment currency.",

  INVALID_RELEASE_MODE:
    "Invalid payment release mode.",

  PAYMENT_NOT_DEFINED:
    "Payment must be defined before splitting amounts.",

  // Payment split
  INVALID_SPLIT_AMOUNT:
    "Split amount must be greater than zero.",

  PAYMENT_SPLIT_EXCEEDS_TOTAL:
    "Total of payment splits exceeds the agreed amount.",

  MILESTONE_NOT_FOUND:
    "Referenced milestone does not exist.",

  // Fallback
  UNKNOWN_ERROR:
    "Something went wrong. Please try again.",
};


/**
 * Helper to normalize backend errors.
 * Safe to use in orchestrator or UI later.
 */
export function resolveAgreementError(
  error: unknown
): AgreementErrorCode {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    const message = String(
      (error as any).message
    );

    if (
      message in AGREEMENT_ERROR_MESSAGES
    ) {
      return message as AgreementErrorCode;
    }
  }

  return "UNKNOWN_ERROR";
}
