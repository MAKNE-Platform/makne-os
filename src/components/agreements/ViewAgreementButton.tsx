"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowRight } from "lucide-react";

export default function ViewAgreementButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(() => {
          router.push(`/agreements/${id}`);
        })
      }

      onMouseEnter={() => router.prefetch(`/agreements/${id}`)}
      
      disabled={isPending}
      className="
        inline-flex items-center gap-1
        rounded-full border border-[#636EE1]/40
        bg-[#636EE1]/10 px-4 py-1.5 text-xs font-medium
        text-[#636EE1] hover:bg-[#636EE1] hover:text-black
        transition disabled:opacity-60
      "
    >
      {isPending ? "Opening..." : "View"}
      <ArrowRight size={14} />
    </button>
  );
}