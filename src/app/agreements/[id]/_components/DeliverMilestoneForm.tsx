"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { FolderUp } from 'lucide-react';

export default function DeliverMilestoneForm({
  milestoneId,
}: {
  milestoneId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [note, setNote] = useState("");

  const [improving, setImproving] =
    useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    await fetch(`/milestones/${milestoneId}/deliver`, {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    router.refresh();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  }

  function handleReplaceClick() {
    fileInputRef.current?.click();
  }

  async function improveNote() {
    if (!note.trim()) return;

    try {
      setImproving(true);

      const response = await fetch(
        "/api/ai/improve-submission-note",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            note,
          }),
        }
      );

      const data = await response.json();

      if (data.note) {
        setNote(data.note);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Failed to improve note"
      );
    } finally {
      setImproving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="mt-4 space-y-4"
    >
      {/* DESCRIPTION CARD */}
      <div className="bg-[#0F0F12] border border-white/5 rounded-xl p-4 space-y-4">

        <div className="flex items-center justify-between">

          <p className="text-xs text-zinc-500 uppercase tracking-wide">
            Description
          </p>

          <button
            type="button"
            onClick={improveNote}
            disabled={improving || !note.trim()}
            className="rounded-lg border border-[#636EE1]/20 bg-[#636EE1]/10 px-3 py-1.5 text-xs text-[#A5AEFF] transition hover:bg-[#636EE1]/20 disabled:opacity-40"
          >
            {improving
              ? "Improving..."
              : "✨ Improve with AI"}
          </button>

        </div>

        <textarea
          name="note"
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          placeholder="Explain what you delivered, context, revisions, etc."
          rows={5}
          className="w-full rounded-xl border border-white/10 bg-[#161618] px-4 py-4 text-sm leading-relaxed text-white resize-none outline-none transition focus:border-[#636EE1] focus:ring-1 focus:ring-[#636EE1]"
        />

      </div>

      {/* LINKS CARD */}
      <div className="bg-[#0F0F12] border border-white/5 rounded-xl p-4 space-y-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wide">
          External Links
        </p>

        <input
          type="text"
          name="links"
          placeholder="https://drive.google.com/... , https://youtube.com/..."
          className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#636EE1]"
        />
      </div>

      {/* PREVIEW AREA */}
      {/* FILE INPUT */}
      <input
        id={`file-upload-${milestoneId}`}
        type="file"
        name="files"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Button / Drop Area */}
      {selectedFiles.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">
            Selected Media
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedFiles.map((file, index) => {
              const isImage = file.type.startsWith("image/");

              return (
                <div
                  key={index}
                  className="border border-white/5 rounded-2xl overflow-hidden bg-[#0F0F12]"
                >
                  {isImage ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="p-6 text-sm text-zinc-300">
                      {file.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <label
            htmlFor={`file-upload-${milestoneId}`}
            className="inline-flex items-center gap-2 bg-[#161618] hover:bg-[#1E1E22] border border-white/10 px-4 py-2 rounded-lg text-sm transition cursor-pointer"
          >
            Replace Media
          </label>
        </div>
      ) : (
        <label
          htmlFor={`file-upload-${milestoneId}`}
          className="w-full border border-dashed border-white/20 rounded-2xl py-12 text-sm text-zinc-400 hover:border-[#636EE1] hover:text-white transition flex flex-col items-center justify-center gap-3 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#161618] flex items-center justify-center">
            <FolderUp />
          </div>
          Click to upload media
        </label>
      )}



      <button
        disabled={loading}
        className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Work"}
      </button>
    </form>
  );
}
