"use client";

import { useState } from "react";

type Task = {
  title: string;
  completed?: boolean;
  type?: string;

  agreementTitle?: string;
  agreementId?: string;
};

export default function CampaignAssistantWidget({
  tasks,
}: {
  tasks: Task[];
}) {

  const [open, setOpen] =
    useState(false);

  const completedCount =
    tasks.filter((t) => t.completed)
      .length;

  return (
    <>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#636EE1]/20 bg-[#11131A]/95 backdrop-blur px-4 py-3 shadow-2xl hover:bg-[#151925] transition"
      >

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#636EE1]/15 text-[#A5AEFF]">
          ✨
        </div>

        <div className="text-left">

          <p className="text-xs uppercase tracking-wide text-[#636EE1]">
            Campaign Assistant
          </p>

          <p className="text-sm text-white">
            {completedCount}/{tasks.length} tasks completed
          </p>

        </div>

      </button>

      {/* PANEL */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] rounded-3xl border border-white/10 bg-[#0B0F19]/95 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="border-b border-white/5 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-[#636EE1]">
                  AI Campaign Assistant
                </p>

                <h3 className="mt-2 text-lg font-semibold text-white">
                  Creator Task Tracker
                </h3>

              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>

            </div>

          </div>

          {/* TASKS */}
          <div className="max-h-[500px] overflow-y-auto p-5 space-y-3">

            {tasks.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-[#11131A] p-5 text-sm text-zinc-400">
                No tasks generated yet.
              </div>
            ) : (
              tasks.map((task, index) => (

                <div
                  key={index}
                  className={`rounded-2xl border p-4 transition ${
                    task.completed
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-white/5 bg-[#11131A]"
                  }`}
                >

                  <div className="flex items-start gap-3">

                    {/* STATUS */}
                    <div
                      className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                        task.completed
                          ? "border-emerald-400 bg-emerald-400 text-black"
                          : "border-white/20 text-zinc-500"
                      }`}
                    >
                      {task.completed ? "✓" : ""}
                    </div>

                    {/* CONTENT */}
                    <div className="space-y-2 flex-1">

{task.agreementTitle && (
  <p className="text-[10px] uppercase tracking-wide text-[#636EE1]">
    {task.agreementTitle}
  </p>
)}

                      <p
                        className={`text-sm leading-relaxed ${
                          task.completed
                            ? "text-zinc-500 line-through"
                            : "text-zinc-200"
                        }`}
                      >
                        {task.title}
                      </p>

                      {task.type && (
                        <div className="inline-flex rounded-full border border-[#636EE1]/20 bg-[#636EE1]/10 px-2 py-1 text-[10px] uppercase tracking-wide text-[#A5AEFF]">
                          {task.type}
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              ))
            )}

          </div>

        </div>
      )}

    </>
  );
}