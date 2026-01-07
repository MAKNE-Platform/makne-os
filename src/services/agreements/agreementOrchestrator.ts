import {
  resolveAgreementError,
  AgreementErrorCode,
} from "./agreementErrors";


import {
  CreateAgreementCommand,
  DefineMetaCommand,
  AssignCreatorCommand,
  AddDeliverableCommand,
  AddMilestoneCommand,
  DefinePolicyCommand,
  DefinePaymentCommand,
  DefinePaymentSplitCommand,
} from "@/contracts/agreement-definition.v1";

import {
  createAgreement,
  defineMeta,
  assignCreator,
  addDeliverable,
  addMilestone,
  definePolicy,
  definePayment,
  definePaymentSplit,
  sendForAcceptance,
} from "./agreementCommands";

/**
 * This orchestrator executes the agreement definition flow
 * exactly in the order enforced by the backend.
 *
 * It does not contain UI logic and does not try to recover
 * from invariant failures. If something breaks, it stops.
 */
export async function createAndDefineAgreement(params: {
  brandId: string;

  meta: Omit<DefineMetaCommand, "agreementId">;

  creators: Array<Omit<AssignCreatorCommand, "agreementId">>;

  deliverables: Array<Omit<AddDeliverableCommand, "agreementId">>;

  milestones: Array<
    Omit<AddMilestoneCommand, "agreementId" | "deliverableIds"> & {
      deliverableIndexes: number[];
    }
  >;

  policy: Omit<DefinePolicyCommand, "agreementId">;

  payment: Omit<DefinePaymentCommand, "agreementId">;

  paymentSplits: Array<
    Omit<DefinePaymentSplitCommand, "agreementId" | "milestoneId"> & {
      milestoneIndex: number;
    }
  >;
}) {
  /**
   * 1. Create the agreement shell
   */
  const { agreementId } = await createAgreement({
    brandId: params.brandId,
  });

  /**
   * 2. Define meta information
   */
  await defineMeta({
    agreementId,
    ...params.meta,
  });

  /**
   * 3. Assign creators
   */
  for (const creator of params.creators) {
    await assignCreator({
      agreementId,
      ...creator,
    });
  }

  /**
   * 4. Add deliverables and remember their IDs
   */
  const deliverableIds: string[] = [];

  for (const deliverable of params.deliverables) {
    const { deliverableId } = await addDeliverable({
      agreementId,
      ...deliverable,
    });

    deliverableIds.push(deliverableId);
  }

  /**
   * 5. Add milestones using previously created deliverables
   */
  const milestoneIds: string[] = [];

  for (const milestone of params.milestones) {
    const resolvedDeliverableIds = milestone.deliverableIndexes.map(
      (index) => {
        const id = deliverableIds[index];

        if (!id) {
          throw new Error(
            `INTERNAL_ERROR: Deliverable index ${index} does not resolve to a valid deliverableId`
          );
        }

        return id;
      }
    );

    const { milestoneId } = await addMilestone({
      agreementId,
      name: milestone.name,
      unlockRule: milestone.unlockRule,
      deliverableIds: resolvedDeliverableIds,
    });

    milestoneIds.push(milestoneId);
  }


  /**
   * 6. Define agreement policy
   */
  await definePolicy({
    agreementId,
    ...params.policy,
  });

  /**
   * 7. Define payment
   */
  await definePayment({
    agreementId,
    ...params.payment,
  });

  /**
   * 8. Define payment splits per milestone
   */
  for (const split of params.paymentSplits) {
    const milestoneId = milestoneIds[split.milestoneIndex];

    await definePaymentSplit({
      agreementId,
      milestoneId,
      amount: split.amount,
    });
  }


  return { agreementId };
}
