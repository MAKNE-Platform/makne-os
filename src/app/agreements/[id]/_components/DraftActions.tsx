"use client";

import { useState } from "react";

export default function DraftActions({
  agreementId,
}: {
  agreementId: string;
}) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="flex gap-3 items-center">

      {/* Toggle Edit */}
      <button
        onClick={() => setEditMode((prev) => !prev)}
        className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5 transition"
      >
        {editMode ? "Cancel Edit" : "Edit Agreement"}
      </button>

      {/* SEND */}
      <form
        method="POST"
        action={`/agreements/${agreementId}/send`}
      >
        <button className="group relative rounded-lg bg-[#636EE1] px-5 py-2 text-sm font-medium text-white transition hover:brightness-110">
          <span className="absolute inset-0 rounded-lg bg-[#636EE1]/20 blur-md opacity-0 transition group-hover:opacity-60" />
          <span className="relative">Send to Creator</span>
        </button>
      </form>

      {/* EDIT PANELS */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-8 w-full max-w-2xl space-y-6 shadow-2xl">

            <h2 className="text-lg font-semibold">Edit Agreement</h2>

            {/* META EDIT FORM */}
            <form
              method="POST"
              action="/agreements/update-meta"
              className="space-y-4"
            >
              <input type="hidden" name="agreementId" value={agreementId} />

              <input
                name="title"
                placeholder="Agreement Title"
                className="w-full rounded-lg bg-[#161618] px-4 py-2 text-sm"
              />

              <textarea
                name="description"
                placeholder="Description"
                className="w-full rounded-lg bg-[#161618] px-4 py-2 text-sm"
              />

              <button className="bg-[#636EE1] px-4 py-2 rounded-md text-sm">
                Update
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}