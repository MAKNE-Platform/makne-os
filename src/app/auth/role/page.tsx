"use client";

import { selectRoleAction } from "./actions";
import { useState } from "react";

const ROLES = [
  {
    id: "CREATOR",
    title: "Creator",
    description: "Create content and collaborate with brands",
  },
  {
    id: "BRAND",
    title: "Brand",
    description: "Work with creators to promote your products",
  },
  {
    id: "AGENCY",
    title: "Agency",
    description: "Manage creators and negotiate brand deals",
  },
];

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative w-full max-w-lg translate-x-0.5 ">

      {/* Ambient glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[450px] h-[200px]
                      bg-[#636EE1]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 rounded-3xl border border-white/10 
                      bg-white/5 backdrop-blur-xl p-8 space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">
            Choose your role
          </h1>
          <p className="text-sm text-zinc-400">
            This helps us personalize your MAKNE experience.
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4">
          {ROLES.map((role) => {
            const isActive = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`w-full rounded-2xl border p-5 text-left transition-all duration-200
                  ${isActive
                    ? "border-[#636EE1] bg-[#636EE1]/10 shadow-lg shadow-[#636EE1]/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
              >
                <h3 className="text-base font-semibold text-white">
                  {role.title}
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  {role.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          disabled={!selectedRole || loading}
          onClick={async () => {
            if (!selectedRole) return;
            setLoading(true);
            await selectRoleAction(selectedRole);
          }}
          className="w-full rounded-xl bg-[#636EE1] py-3 text-sm font-medium text-white
                     hover:bg-[#7A84FF] transition
                     shadow-lg shadow-[#636EE1]/30
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : "Continue"}
        </button>

      </div>
    </div>
  );
}