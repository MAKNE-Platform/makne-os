import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { InboxRead } from "@/lib/db/models/InboxRead";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const cookieStore = cookies();
    const userId = (await cookieStore).get("auth_session")?.value;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();

    await InboxRead.updateOne(
      {
        userId: new mongoose.Types.ObjectId(userId),
        itemId: id,
      },
      {
        $set: {
          userId: new mongoose.Types.ObjectId(userId),
          itemId: id,
        },
      },
      { upsert: true }
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("Inbox read error:", err);
    return new Response("Error", { status: 500 });
  }
}
