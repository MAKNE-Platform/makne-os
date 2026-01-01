import { z } from "zod";

export const EventTypeEnum = z.enum([
    "AGREEMENT_CREATED",
    "AGREEMENT_SHARED",
    "AGREEMENT_UPDATED",
    "AGREEMENT_ACKNOWLEDGED",
    "AGREEMENT_ACTIVATED",
    "EXECUTION_STARTED",
    "AGREEMENT_COMPLETED",
    "AGREEMENT_PARTIALLY_COMPLETED",
    "AGREEMENT_CANCELLED",

    // DELIVERABLE EVENTS
    "DELIVERABLE_CREATED",
    "DELIVERABLE_SUBMITTED",
    "DELIVERABLE_ACCEPTED",
    "DELIVERABLE_REJECTED",
    "DELIVERABLE_PARTIALLY_ACCEPTED",


    // MILESTONE EVENTS
    "MILESTONE_CREATED",
    "MILESTONE_RELEASED",
    "MILESTONE_BLOCKED",

]);

export type EventType = z.infer<typeof EventTypeEnum>;

export const BaseEventSchema = z.object({
    eventId: z.string(),
    agreementId: z.string(),
    type: EventTypeEnum,
    actorId: z.string(),
    actorRole: z.string(),
    payload: z.unknown(),
    timestamp: z.string(),
    version: z.number(),
});

export type BaseEvent = z.infer<typeof BaseEventSchema>;
