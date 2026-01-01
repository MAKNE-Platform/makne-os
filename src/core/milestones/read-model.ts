import { EventType } from "@/core/events/types";

export interface MilestoneView {
  milestoneId: string;
  title: string;
  amount: number;
  state: "PENDING" | "RELEASED" | "BLOCKED";
  deliverableIds: string[];
}

export function projectMilestones(events: any[]): MilestoneView[] {
  const map = new Map<string, MilestoneView>();
  const deliverableState = new Map<string, string>();

  for (const event of events) {
    // Track deliverable acceptance state
    if (
      event.type === "DELIVERABLE_ACCEPTED" ||
      event.type === "DELIVERABLE_REJECTED"
    ) {
      if (event.payload?.deliverableId) {
        deliverableState.set(
          event.payload.deliverableId,
          event.type
        );
      }
    }

    // Create milestone safely
    if (event.type === "MILESTONE_CREATED") {
      const payload = event.payload ?? {};

      map.set(payload.milestoneId, {
        milestoneId: payload.milestoneId,
        title: payload.title ?? "Untitled Milestone",
        amount: payload.amount ?? 0,
        deliverableIds: Array.isArray(payload.deliverableIds)
          ? payload.deliverableIds
          : [],
        state: "PENDING",
      });
    }
  }

  // Derive milestone state
  for (const milestone of map.values()) {
    if (milestone.deliverableIds.length === 0) {
      milestone.state = "PENDING";
      continue;
    }

    const states = milestone.deliverableIds.map((id) =>
      deliverableState.get(id)
    );

    if (states.every((s) => s === "DELIVERABLE_ACCEPTED")) {
      milestone.state = "RELEASED";
    } else if (states.some((s) => s === "DELIVERABLE_REJECTED")) {
      milestone.state = "BLOCKED";
    }
  }

  return Array.from(map.values());
}
