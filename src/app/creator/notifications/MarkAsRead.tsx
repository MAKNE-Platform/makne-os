"use client";

export function MarkAsRead({
  notificationId,
  isRead,
}: {
  notificationId: string;
  isRead: boolean;
}) {
  if (isRead) return null;

  async function markRead() {
    await fetch(
      `/api/notifications/${notificationId}/read`,
      { method: "POST" }
    );

    window.location.reload();
  }

  return (
    <button
      onClick={markRead}
      className="text-xs text-blue-600 hover:underline"
    >
      Mark as read
    </button>
  );
}
