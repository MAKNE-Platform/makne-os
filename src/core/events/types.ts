import { z } from "zod";

/**
 * All supported event types
 */
export const EventTypeEnum = z.enum([
    "AGREEMENT_CREATED",
    "AGREEMENT_PARTY_ASSIGNED",
    "AGREEMENT_META_DEFINED",
    "AGREEMENT_SENT_FOR_ACCEPTANCE",
    "AGREEMENT_UPDATED",
    "AGREEMENT_ACKNOWLEDGED",
    "AGREEMENT_ACTIVATED",
    "EXECUTION_STARTED",
    "AGREEMENT_COMPLETED",
    "AGREEMENT_PARTIALLY_COMPLETED",
    "AGREEMENT_CANCELLED",
    "AGREEMENT_AUTO_COMPLETED",

    "AGREEMENT_REJECTED_BY_CREATOR",
    "AGREEMENT_ACCEPTED_BY_CREATOR",

    // DELIVERABLE EVENTS
    "DELIVERABLE_CREATED",
    "DELIVERABLE_SUBMITTED",
    "DELIVERABLE_ACCEPTED",
    "DELIVERABLE_REJECTED",
    "DELIVERABLE_PARTIALLY_ACCEPTED",
    "DELIVERABLE_AUTO_RELEASED",

    // MILESTONE EVENTS
    "MILESTONE_CREATED",
    "MILESTONE_RELEASED",
    "MILESTONE_BLOCKED",
    "MILESTONE_COMPLETED",

    // PAYMENT EVENTS
    "PAYMENT_DEFINED",
    "PAYMENT_SPLIT_DEFINED",
    "POLICY_DEFINED",
]);

export type EventType = z.infer<typeof EventTypeEnum>;

/**
 * Payload schemas for events we want to strictly validate
 * (others are left flexible for backward compatibility)
 */
const PaymentDefinedPayloadSchema = z.object({
    currency: z.enum(["INR", "USD"]),
    totalAmount: z.number().positive(),
    releaseMode: z.enum(["MANUAL", "AUTO"]),
    escrowRequired: z.boolean(),
});

const PaymentSplitDefinedPayloadSchema = z.object({
    milestoneId: z.string(),
    amount: z.number().positive(),
});

const PolicyDefinedPayloadSchema = z.object({
    cancellationAllowed: z.boolean(),
    cancellationWindowDays: z.number().int().nonnegative().optional(),
    revisionLimit: z.number().int().nonnegative(),
    disputeResolution: z.enum(["PLATFORM", "ARBITRATION"]),
});

const AgreementAcceptedPayloadSchema = z.object({
    acceptedAt: z.string(),
});

const AgreementRejectedPayloadSchema = z.object({
    reason: z.string().min(3),
    rejectedAt: z.string(),
});



/**
 * Base event schema (backward compatible)
 */
export const BaseEventSchema = z
    .object({
        eventId: z.string(),
        agreementId: z.string(),
        type: EventTypeEnum,
        actorId: z.string(),
        actorRole: z.string(),
        payload: z.unknown(),
        timestamp: z.string(),
        version: z.number(),
    })
    .superRefine((event, ctx) => {
        /**
         * Event-specific payload validation
         * (incremental hardening approach)
         */
        if (event.type === "PAYMENT_DEFINED") {
            const result = PaymentDefinedPayloadSchema.safeParse(event.payload);
            if (!result.success) {
                ctx.addIssue({
                    path: ["payload"],
                    message: "Invalid payload for PAYMENT_DEFINED",
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        if (event.type === "PAYMENT_SPLIT_DEFINED") {
            const result =
                PaymentSplitDefinedPayloadSchema.safeParse(event.payload);
            if (!result.success) {
                ctx.addIssue({
                    path: ["payload"],
                    message: "Invalid payload for PAYMENT_SPLIT_DEFINED",
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        if (event.type === "POLICY_DEFINED") {
            const result =
                PolicyDefinedPayloadSchema.safeParse(event.payload);
            if (!result.success) {
                ctx.addIssue({
                    path: ["payload"],
                    message: "Invalid payload for POLICY_DEFINED",
                    code: z.ZodIssueCode.custom,
                });
            }
        }


        if (event.type === "AGREEMENT_ACCEPTED_BY_CREATOR") {
            const result =
                AgreementAcceptedPayloadSchema.safeParse(event.payload);

            if (!result.success) {
                ctx.addIssue({
                    path: ["payload"],
                    message: "Invalid payload for AGREEMENT_ACCEPTED_BY_CREATOR",
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        if (event.type === "AGREEMENT_REJECTED_BY_CREATOR") {
            const result =
                AgreementRejectedPayloadSchema.safeParse(event.payload);

            if (!result.success) {
                ctx.addIssue({
                    path: ["payload"],
                    message: "Invalid payload for AGREEMENT_REJECTED_BY_CREATOR",
                    code: z.ZodIssueCode.custom,
                });
            }
        }



    });

export type BaseEvent = z.infer<typeof BaseEventSchema>;
