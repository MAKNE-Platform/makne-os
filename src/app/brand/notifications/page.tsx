import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Notification } from "@/lib/db/models/Notification";

export default async function BrandNotificationsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Unauthorized
      </div>
    );
  }

  await connectDB();

  const notifications = await Notification.find({
    userId: new mongoose.Types.ObjectId(userId),
    role: "BRAND",
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No notifications yet.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id.toString()}
              className="rounded-xl border bg-background p-4"
            >
              <p className="text-sm font-medium">
                {n.title}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {n.message}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
