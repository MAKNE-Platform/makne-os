import { EventType } from "@/core/events/types";

export interface DeliverableView {
  deliverableId: string;
  title: string;
  description: string;
  state: "PENDING" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "PARTIALLY_ACCEPTED";
  assignedTo: string[];
  submission?: {
    url: string;
    note?: string;
  };
}

export function projectDeliverables(events: any[]): DeliverableView[] {
  const map = new Map<string, DeliverableView>();

  for (const event of events) {
    switch (event.type as EventType) {
      case "DELIVERABLE_CREATED": {
        const p = event.payload;
        map.set(p.deliverableId, {
          deliverableId: p.deliverableId,
          title: p.title,
          description: p.description,
          assignedTo: p.assignedTo,
          state: "PENDING",
        });
        break;
      }

      case "DELIVERABLE_SUBMITTED": {
        const d = map.get(event.payload.deliverableId);
        if (!d) break;
        d.state = "SUBMITTED";
        d.submission = {
          url: event.payload.submissionUrl,
          note: event.payload.note,
        };
        break;
      }

      case "DELIVERABLE_ACCEPTED":
        map.get(event.payload.deliverableId)!.state = "ACCEPTED";
        break;

      case "DELIVERABLE_REJECTED":
        map.get(event.payload.deliverableId)!.state = "REJECTED";
        break;

      case "DELIVERABLE_PARTIALLY_ACCEPTED":
        map.get(event.payload.deliverableId)!.state = "PARTIALLY_ACCEPTED";
        break;
    }
  }

  return Array.from(map.values());
}


export function projectDeliverablesById(
  events: any[]
): Record<string, DeliverableView> {
  const list = projectDeliverables(events);
  const byId: Record<string, DeliverableView> = {};

  for (const d of list) {
    byId[d.deliverableId] = d;
  }

  return byId;
}
