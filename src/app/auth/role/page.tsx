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
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-medium text-white">
        Choose your role
      </h1>

      <p className="mt-2 text-sm text-zinc-400">
        This helps us personalize your experience on MAKNE.
      </p>

      <div className="mt-6 space-y-3">
        {ROLES.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setSelectedRole(role.id)}
            className={`w-full rounded-xl border px-4 py-4 text-left transition
              ${
                selectedRole === role.id
                  ? "border-[#636EE1] bg-[#636EE1]/10"
                  : "border-white/10 hover:bg-white/5"
              }`}
          >
            <h3 className="text-sm font-medium text-white">
              {role.title}
            </h3>
            <p className="mt-1 text-xs text-zinc-400">
              {role.description}
            </p>
          </button>
        ))}
      </div>

      <button
        disabled={!selectedRole || loading}
        onClick={async () => {
          if (!selectedRole) return;
          setLoading(true);
          await selectRoleAction(selectedRole);
        }}
        className="mt-6 w-full rounded-xl bg-[#636EE1] py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Continue"}
      </button>
    </div>
  );
}
