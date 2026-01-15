"use server";

import {
  getCurrentUser,
  requireAuth,
  requireRole,
} from "@/core/auth/contract";

import { createAndDefineAgreement } from "@/services/agreements/agreementOrchestrator";

export async function createAgreementAction(payload: {
  meta: any;
  creators: any[];
  deliverables: any[];
  milestones: any[];
  policy: any;
  payment: any;
  paymentSplits: any[];
}) {
  const user = await getCurrentUser();
  requireAuth(user);
  requireRole(user, "BRAND");

  const brandId = user.userId;

  return createAndDefineAgreement({
    brandId,
    ...payload,
  });
}
