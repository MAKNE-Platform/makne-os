"use client";

import { useRouter } from "next/navigation";
import { deleteNotification } from "@/app/brand/notifications/actions";

export default function DeleteNotificationButton({
  notificationId,
}: {
  notificationId: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        e.preventDefault();

        await deleteNotification(notificationId);
        router.refresh(); // ✅ THIS LINE IS THE KEY
      }}
      className="
        h-6 w-6
        rounded-full
        flex items-center justify-center
        text-xs
        hover:text-white
        hover:bg-white/10
        text-[#636EE1]
        transition
      "
      aria-label="Delete notification"
    >
      ✕
    </button>
  );
}
