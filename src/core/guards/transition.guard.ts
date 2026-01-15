import { EventType } from "@/core/events/types";
import { AgreementState } from "@/core/agreements/state";

const agreementStateTransitions: Record<
  AgreementState,
  EventType[]
> = {
  DRAFT: [
    "AGREEMENT_UPDATED",
    "AGREEMENT_ACKNOWLEDGED",
  ],

  NEGOTIATING: [
    "AGREEMENT_UPDATED",
    "AGREEMENT_ACKNOWLEDGED",
  ],

  ACTIVE: [
    "EXECUTION_STARTED",
    "AGREEMENT_CANCELLED",
  ],

  EXECUTING: [
    "AGREEMENT_COMPLETED",
    "AGREEMENT_PARTIALLY_COMPLETED",
    "AGREEMENT_CANCELLED",
    "AGREEMENT_AUTO_COMPLETED",
  ],

  PARTIALLY_COMPLETED: [
    "AGREEMENT_COMPLETED",
    "AGREEMENT_CANCELLED",
    "AGREEMENT_AUTO_COMPLETED",
  ],

  COMPLETED: [],

  CANCELLED: [],

  // ✅ ADD THIS
  REJECTED: [],
};

// Events that do NOT change agreement state
const executionEvents: EventType[] = [
  // Deliverables
  "DELIVERABLE_CREATED",
  "DELIVERABLE_SUBMITTED",
  "DELIVERABLE_ACCEPTED",
  "DELIVERABLE_REJECTED",
  "DELIVERABLE_PARTIALLY_ACCEPTED",
  "DELIVERABLE_AUTO_RELEASED",

  // Milestones
  "MILESTONE_CREATED",
  "MILESTONE_COMPLETED",
  "MILESTONE_RELEASED",
  "MILESTONE_BLOCKED",

  // System
  "AGREEMENT_AUTO_COMPLETED",
];

export function canEmitEvent(
  currentState: AgreementState,
  eventType: EventType
): boolean {
  if (eventType === "AGREEMENT_CREATED") return true;

  if (currentState === "CANCELLED") return false;

  if (executionEvents.includes(eventType)) return true;

  return (
    agreementStateTransitions[currentState]?.includes(eventType) ??
    false
  );
}
