/**
 * Agreement Commands
 * ------------------
 * Thin wrappers around agreement-related API routes.
 * DO NOT add orchestration or state here.
 */

import { apiRequest } from "@/lib/apiClient";
import {
  CreateAgreementCommand,
  DefineMetaCommand,
  AssignCreatorCommand,
  AddDeliverableCommand,
  AddMilestoneCommand,
  DefinePolicyCommand,
  DefinePaymentCommand,
  DefinePaymentSplitCommand,
  SendForAcceptanceCommand,
} from "@/contracts/agreement-definition.v1";

/* ---------------------------------- */
/* Create Agreement */
/* ---------------------------------- */

export function createAgreement(payload: CreateAgreementCommand) {
  return apiRequest<{ agreementId: string }>(
    "/api/agreements/create",
    {
      method: "POST",
      body: payload,
    }
  );
}

/* ---------------------------------- */
/* Define Meta */
/* ---------------------------------- */

export function defineMeta(payload: DefineMetaCommand) {
  return apiRequest<void>(
    "/api/agreements/define-meta",
    {
      method: "POST",
      body: payload,
    }
  );
}

/* ---------------------------------- */
/* Assign Creator */
/* ---------------------------------- */

export function assignCreator(payload: AssignCreatorCommand) {
  return apiRequest<void>(
    "/api/agreements/assign-creator",
    {
      method: "POST",
      body: payload,
    }
  );
}

/* ---------------------------------- */
/* Deliverables */
/* ---------------------------------- */

export async function addDeliverable(
  command: AddDeliverableCommand
): Promise<{ deliverableId: string }> {
  const res = await apiRequest<{ deliverableId: string }>(
    "/api/agreements/add-deliverable",
    {
      method: "POST",
      body: command,
    }
  );

  return { deliverableId: res.deliverableId };
}


/* ---------------------------------- */
/* Milestones */
/* ---------------------------------- */

export function addMilestone(payload: AddMilestoneCommand) {
  return apiRequest<{ milestoneId: string }>(
    "/api/agreements/add-milestone",
    {
      method: "POST",
      body: payload,
    }
  );
}

/* ---------------------------------- */
/* Policy */
/* ---------------------------------- */

export function definePolicy(payload: DefinePolicyCommand) {
  return apiRequest<void>(
    "/api/agreements/define-policy",
    {
      method: "POST",
      body: payload,
    }
  );
}

/* ---------------------------------- */
/* Payment */
/* ---------------------------------- */

export function definePayment(payload: DefinePaymentCommand) {
  return apiRequest<void>(
    "/api/agreements/define-payment",
    {
      method: "POST",
      body: payload,
    }
  );
}

/* ---------------------------------- */
/* Payment Split */
/* ---------------------------------- */

export function definePaymentSplit(payload: DefinePaymentSplitCommand) {
  return apiRequest<void>(
    "/api/agreements/define-payment-split",
    {
      method: "POST",
      body: payload,
    }
  );
}

/* ---------------------------------- */
/* Send for Acceptance */
/* ---------------------------------- */

export function sendForAcceptance(
  payload: SendForAcceptanceCommand
) {
  return apiRequest<void>(
    "/api/agreements/send-for-acceptance",
    {
      method: "POST",
      body: payload,
    }
  );
}
