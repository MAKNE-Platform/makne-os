"use client";

import { useState } from "react";
import Link from "next/link";

type InboxItem = {
  id?: string;
  type: "notification" | "deliverable" | "payment";
  title: string;
  description: string;
  createdAt: string;
  priority?: "urgent" | "normal";
  link?: string;
  read?: boolean;
};

export default function CreatorInboxClient({
  items,
}: {
  items: InboxItem[];
}) {
  const [inboxItems, setInboxItems] = useState(items);

  async function markAsRead(id?: string) {
    if (!id) return;

    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });

      setInboxItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, read: true } : item
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  }

  if (!inboxItems.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-8 text-center">
        <div className="text-lg font-medium">You're all caught up 🎉</div>
        <div className="text-sm opacity-60 mt-2">
          No notifications or urgent actions right now.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium">Inbox</h1>

      <div className="space-y-4">
        {inboxItems.map((item, i) => (
          <div
            key={item.id ?? i}
            className={`
              rounded-xl border p-5 space-y-4 transition
              ${
                item.priority === "urgent"
                  ? "border-red-500/40 bg-red-500/5"
                  : "border-white/10 bg-[#ffffff05]"
              }
              ${item.read ? "opacity-60" : ""}
            `}
          >
            {/* Top Section */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">{item.title}</div>

                <div className="text-sm opacity-70">
                  {item.description}
                </div>
              </div>

              {item.priority === "urgent" && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 whitespace-nowrap">
                  Action Required
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-xs opacity-50">
                {new Date(item.createdAt).toLocaleString()}
              </span>

              <div className="flex items-center gap-4">
                {!item.read && item.id && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="text-xs opacity-60 hover:opacity-100 transition"
                  >
                    Mark as read
                  </button>
                )}

                {item.link && (
                  <Link
                    href={item.link}
                    className="text-sm text-[#636EE1] hover:underline"
                  >
                    View →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
