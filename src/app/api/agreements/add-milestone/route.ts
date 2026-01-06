import { NextResponse } from "next/server";
import { addMilestone } from "@/core/agreements/handlers/addMilestone";

export async function POST(req: Request) {
  const actorId = "brand_1";
  const body = await req.json();

  // HARD NORMALIZATION (keep this)
  const deliverableIds: string[] = body.deliverableIds.map(
    (d: any) => (typeof d === "string" ? d : d.deliverableId)
  );

  const { milestoneId } = await addMilestone({
    agreementId: body.agreementId,
    name: body.name,
    unlockRule: body.unlockRule,
    deliverableIds,
    actorId,
  });

  return NextResponse.json({ milestoneId });
}
