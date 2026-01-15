import { getDb } from "@/lib/db";
import { UserEvent, UserEventSchema } from "../events/types";

export async function dispatchUserEvent(event: UserEvent) {
  // 1. Validate user event
  UserEventSchema.parse(event);

  // 2. Persist to SAME events collection (optional)
  const db = await getDb();
  await db.collection("events").insertOne(event);

  // 3. (Future) trigger user-specific agents here

  return { success: true };
}
