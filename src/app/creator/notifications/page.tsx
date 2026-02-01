import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Notification, NotificationDocument } from "@/lib/db/models/Notification";
import { MarkAsRead } from "./MarkAsRead";

export default async function CreatorNotificationsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") {
    redirect("/auth/login");
  }

  await connectDB();

 const notifications = await Notification.find({
  userId: new mongoose.Types.ObjectId(userId),
  role: "CREATOR",
})
  .sort({ createdAt: -1 })
  .lean<NotificationDocument[]>();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You don’t have any notifications yet.
        </p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id.toString()}
              className={`rounded-xl border p-4 ${n.read
                  ? "bg-background"
                  : "bg-muted/40"
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    {n.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>

                <MarkAsRead
                  notificationId={n._id.toString()}
                  isRead={n.read}
                />
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
