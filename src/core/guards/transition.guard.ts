import { EventType } from "@/core/events/types";

const agreementStateTransitions: Record<string, EventType[]> = {
  DRAFT: ["AGREEMENT_SHARED"],
  NEGOTIATING: ["AGREEMENT_UPDATED", "AGREEMENT_ACKNOWLEDGED"],
  ACTIVE: ["EXECUTION_STARTED", "AGREEMENT_CANCELLED"],
  EXECUTING: [
    "AGREEMENT_COMPLETED",
    "AGREEMENT_PARTIALLY_COMPLETED",
    "AGREEMENT_CANCELLED",
  ],
};

// Events that do NOT change agreement state
const executionEvents: EventType[] = [
  // Deliverables
  "DELIVERABLE_CREATED",
  "DELIVERABLE_SUBMITTED",
  "DELIVERABLE_ACCEPTED",
  "DELIVERABLE_REJECTED",
  "DELIVERABLE_PARTIALLY_ACCEPTED",

  // Milestones
  "MILESTONE_CREATED",
  "MILESTONE_RELEASED",
  "MILESTONE_BLOCKED",
];


export function canEmitEvent(
  currentState: string,
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

