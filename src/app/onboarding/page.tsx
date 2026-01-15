"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { selectUserRole } from "./actions";

export default function OnboardingPage() {
  const [role, setRole] = useState<"brand" | "creator" | null>(null);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  async function handleContinue() {
    if (!role) return;

    await selectUserRole(role === "brand" ? "BRAND" : "CREATOR");

    // Mark completion ONLY — no navigation yet
    setCompleted(true);
  }

  // 🚨 Navigation happens AFTER hydration settles
  useEffect(() => {
    if (!completed || !role) return;

    router.push(role === "brand" ? "/dashboard" : "/creator");
  }, [completed, role, router]);

  return (
    <main className="min-h-screen bg-[#0B0B0C] flex items-center justify-center px-6">
      <div className="w-full max-w-xl animate-fade-in">
        <div className="rounded-2xl bg-[#161618] border border-white/5 p-8 text-center">
          <h1 className="text-2xl font-medium text-zinc-100">
            How will you use Makne?
          </h1>

          <p className="mt-3 text-zinc-400 text-sm">
            Choose what best describes your role.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setRole("brand")}
              className={`
                rounded-xl border p-6 text-left transition
                ${
                  role === "brand"
                    ? "border-white bg-white/5"
                    : "border-white/10 hover:border-white/20"
                }
              `}
            >
              <h3 className="text-lg font-medium text-zinc-100">I’m a brand</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Create agreements, manage creators, release payments.
              </p>
            </button>

            <button
              onClick={() => setRole("creator")}
              className={`
                rounded-xl border p-6 text-left transition
                ${
                  role === "creator"
                    ? "border-white bg-white/5"
                    : "border-white/10 hover:border-white/20"
                }
              `}
            >
              <h3 className="text-lg font-medium text-zinc-100">I’m a creator</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Review agreements, submit work, track payments.
              </p>
            </button>
          </div>

          <button
            onClick={handleContinue}
            disabled={!role}
            className={`
              mt-8 w-full rounded-xl py-3 text-sm font-medium transition
              ${
                role
                  ? "bg-white text-black hover:bg-zinc-100 active:scale-[0.98]"
                  : "bg-white/20 text-white/40 cursor-not-allowed"
              }
            `}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
