import { EventType } from "@/core/events/types";

export interface MilestoneView {
  milestoneId: string;
  title: string;
  amount: number;
  status: "PENDING" | "COMPLETED";

  state: "PENDING" | "RELEASED" | "BLOCKED";

  payoutState: "NOT_RECEIVED" | "RECEIVED";

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
    // ✅ React to PAYMENT_RECEIVED (payout confirmation)
    if (event.type === "PAYMENT_RECEIVED") {
      const milestone = map.get(event.payload?.milestoneId);
      if (milestone) {
        milestone.payoutState = "RECEIVED";
      }
    }


    // Create milestone
    if (event.type === "MILESTONE_CREATED") {
      const payload = event.payload ?? {};

      map.set(payload.milestoneId, {
        milestoneId: payload.milestoneId,
        title: payload.title ?? "Untitled Milestone",
        amount: payload.amount ?? 0,
        deliverableIds: Array.isArray(payload.deliverableIds)
          ? payload.deliverableIds
          : [],

        // ✅ new
        status: "PENDING",

        // ✅ existing behavior preserved
        state: "PENDING",
        payoutState: "NOT_RECEIVED",
      });
    }

    // ✅ milestone completion is event-driven
    if (event.type === "MILESTONE_COMPLETED") {
      const milestone = map.get(event.payload?.milestoneId);
      if (milestone) {
        milestone.status = "COMPLETED";
      }
    }
  }

  // Derive PAYMENT readiness (unchanged logic)
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


export function projectMilestonesById(
  events: any[]
): Record<string, MilestoneView> {
  const list = projectMilestones(events);
  const byId: Record<string, MilestoneView> = {};

  for (const m of list) {
    byId[m.milestoneId] = m;
  }

  return byId;
}

