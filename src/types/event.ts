export type EventType =
  | "AGREEMENT_CREATED"
  | "AGREEMENT_SHARED"
  | "AGREEMENT_UPDATED"
  | "AGREEMENT_ACKNOWLEDGED"
  | "AGREEMENT_ACTIVATED"
  | "EXECUTION_STARTED"
  | "AGREEMENT_COMPLETED"
  | "AGREEMENT_PARTIALLY_COMPLETED"
  | "AGREEMENT_CANCELLED";

export interface BaseEvent {
  eventId: string;
  agreementId: string;
  type: EventType;
  actorId: string;
  actorRole: string;
  payload: unknown;
  timestamp: string;
  version: number;
}
