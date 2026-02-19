"use client";

import { useState, useEffect } from "react";
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
  brandName?: string;
  status?: string;
};

export default function CreatorInboxClient({
  items,
}: {
  items: InboxItem[];
}) {
  const [inboxItems, setInboxItems] = useState(items);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length && !selectedId) {
      setSelectedId(items[0].id ?? null);
    }
  }, [items]);

  const selected = inboxItems.find(
    (item) => item.id === selectedId
  );



  async function markAsRead(id?: string) {
    if (!id) return;

    try {
      await fetch(`/api/inbox/${id}/read`, {
        method: "POST",
      });

      setInboxItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, read: true } : item
        )
      );

    } catch (err) {
      console.error(err);
    }
  }


  useEffect(() => {
    if (selected && !selected.read) {
      markAsRead(selected.id);
    }
  }, [selected?.id]);


  function formatTime(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  if (!inboxItems.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#ffffff05] p-10 text-center">
        <div className="text-lg font-medium">You're all caught up</div>
        <div className="text-sm opacity-60 mt-2">
          No notifications or urgent actions right now.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[90vh] lg:h-[90vh] rounded-2xl border border-white/10 overflow-hidden">

      {/* ================= LEFT PANEL ================= */}
      <div
        className={`
        w-full lg:w-[380px] lg:border-r border-white/10 bg-[#0d0d0d] flex flex-col
        ${selected ? "hidden lg:flex" : "flex"}
      `}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 space-y-4">
          <h1 className="text-2xl lg:text-4xl font-medium">Inbox</h1>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {inboxItems.map((item, i) => (
            <button
              key={item.id ?? i}
              onClick={() => setSelectedId(item.id ?? null)}
              className={`
              w-full text-left px-4 lg:px-5 py-4 border-b border-white/5
              transition hover:bg-white/5
              ${selectedId === item.id ? "bg-white/10" : ""}
            `}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {item.title}
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#636EE1]" />
                    )}
                  </div>

                  <div className="text-xs opacity-60 line-clamp-1">
                    {item.description}
                  </div>
                </div>

                <div className="text-xs opacity-40">
                  {formatTime(item.createdAt)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div
        className={`
        flex-1 bg-black flex flex-col
        ${!selected ? "hidden lg:flex" : "flex"}
      `}
      >
        {!selected ? (
          <div className="h-full flex items-center justify-center text-white/40">
            Select a message to view details
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 lg:p-6 border-b border-white/10 space-y-4">

              {/* Mobile Back Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-sm opacity-60 hover:opacity-100 transition"
                >
                  ← Back
                </button>
              </div>

              <div className="flex justify-between items-start lg:items-center flex-col lg:flex-row gap-3">
                <h2 className="text-xl lg:text-2xl font-medium">
                  {selected.title}
                </h2>

                {selected.priority === "urgent" && (
                  <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                    Action Required
                  </span>
                )}
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 text-xs opacity-60">

                {selected.brandName && (
                  <span>
                    Brand:{" "}
                    <span className="opacity-80">
                      {selected.brandName}
                    </span>
                  </span>
                )}

                {selected.status && (
                  <span className="px-2 py-1 rounded-full bg-white/10 w-fit">
                    {selected.status}
                  </span>
                )}

                <span>
                  {new Date(selected.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* BODY */}
            <div className="p-4 lg:p-6 space-y-6 flex-1 overflow-y-auto">
              <p className="text-sm opacity-80 leading-relaxed">
                {selected.description}
              </p>

              {selected.link && (
                <div>
                  <Link
                    href={selected.link}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#636EE1] text-sm hover:opacity-90 transition"
                  >
                    Open Agreement →
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

}
