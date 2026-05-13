"use client";

import { useState } from "react";
import AIGenerateButton from "./AIGenerateButton";

type Props = {
  defaultValue?: string;
};

export default function AgreementDescriptionField({
  defaultValue = "",
}: Props) {
  const [description, setDescription] =
    useState(defaultValue);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-300">
          Description
        </label>

        <AIGenerateButton
          onGenerate={({ description }) => {
            setDescription(description);
          }}
        />
      </div>

      <textarea
        name="description"
        rows={8}
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        placeholder="Brief overview of the collaboration"
        className="w-full resize-none rounded-2xl border border-white/10 bg-[#121420] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
      />
    </div>
  );
}