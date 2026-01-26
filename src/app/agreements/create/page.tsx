"use client";

import { createAgreementAction } from "./actions";
import { useState } from "react";

export default function CreateAgreementPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-medium">Create Agreement</h1>

      <form
        action={async (formData) => {
          setLoading(true);
          await createAgreementAction(formData);
          setLoading(false);
        }}
        className="space-y-4"
      >
        <input
          name="title"
          placeholder="Agreement title"
          required
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-white"
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-white"
        />

        <textarea
          name="deliverables"
          placeholder="Deliverables"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-white"
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount (₹)"
          className="w-full rounded-xl bg-[#161618] px-4 py-3 text-white"
        />

        <button
          disabled={loading}
          className="rounded-xl bg-[#636EE1] px-6 py-3 text-white"
        >
          {loading ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
}
