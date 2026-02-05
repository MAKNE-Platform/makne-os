import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";

export default async function AgreementsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") redirect("/auth/login");

  await connectDB();

  const agreements = await Agreement.find({
    brandId: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-10 lg:px-10 lg:py-5 p-5">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-medium">Agreements</h1>
        <p className="mt-1 text-md opacity-70">
          All collaborations created by your brand
        </p>
      </div>

      {/* Empty state */}
      {agreements.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-6 text-sm opacity-70">
          No agreements yet.
        </div>
      )}

      {/* ================= DESKTOP TABLE (UNCHANGED) ================= */}
      <div className="hidden md:block rounded-xl border border-white/10 overflow-hidden">

        {/* Table header */}
        <div
          className="
            grid
            grid-cols-[2fr_1fr_2fr_1fr]
            gap-4
            px-4 py-3
            text-xs
            uppercase
            tracking-wide
            opacity-60
            border-b border-white/10
            bg-black
          "
        >
          <div>Title</div>
          <div>Status</div>
          <div>Creator</div>
          <div>Date</div>
        </div>

        {/* Table rows */}
        {agreements.map((agreement: any) => {
          const isDraft = agreement.status === "DRAFT";

          return (
            <div
              key={agreement._id}
              className="border-b border-white/5 last:border-none"
            >

              {/* Main row */}
              <Link
                href={`/agreements/${agreement._id}`}
                className="
                  grid
                  grid-cols-[2fr_1fr_2fr_1fr]
                  gap-4
                  px-4 py-4
                  text-sm
                  items-center
                  bg-[#ffffff05]
                  hover:bg-white/10
                  transition
                "
              >
                <div className="font-medium truncate">
                  {agreement.title}
                </div>

                <StatusPill status={agreement.status} />

                <div className="truncate opacity-80">
                  {agreement.creatorEmail ?? "—"}
                </div>

                <div className="text-xs opacity-60">
                  {new Date(agreement.createdAt).toDateString()}
                </div>
              </Link>

              {/* Draft inline action */}
              {isDraft && (
                <div className="px-4 py-3 bg-black border-t border-white/5">
                  <form
                    action={`/agreements/${agreement._id}/send`}
                    method="POST"
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <input
                      name="creatorEmail"
                      type="email"
                      required
                      placeholder="Creator email"
                      className="
                        flex-1
                        rounded-lg
                        bg-black
                        border border-white/10
                        px-3 py-2
                        text-sm
                        text-white
                        placeholder:opacity-40
                        focus:outline-none
                        focus:border-[#636EE1]
                      "
                    />

                    <button
                      type="submit"
                      className="
                        rounded-lg
                        bg-[#636EE1]
                        px-4 py-2
                        text-sm
                        font-medium
                        text-black
                        hover:brightness-95
                        transition
                      "
                    >
                      Send invite
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= MOBILE UI ================= */}
      <div className="md:hidden space-y-3">
        {agreements.map((agreement: any) => (
          <Link
            key={agreement._id}
            href={`/agreements/${agreement._id}`}
            className="
              block
              rounded-xl
              border border-white/10
              bg-[#ffffff05]
              p-4
              space-y-3
              hover:border-[#636EE1]/40
              transition
            "
          >
            <div className="font-medium">
              {agreement.title}
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <Pill>{agreement.status}</Pill>
              <Pill>
                {new Date(agreement.createdAt).toDateString()}
              </Pill>
            </div>

            <div className="text-sm opacity-70 truncate">
              {agreement.creatorEmail ?? "No creator assigned"}
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

/* ================= UI HELPERS ================= */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        rounded-full
        border border-white/10
        px-2 py-0.5
        text-xs
      "
    >
      {children}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className="
        w-max
        items-center
        rounded-full
        border
        px-5 py-2 text-center
        text-xs
        opacity-80
        border-[#636de180]
      "
    >
      {status}
    </span>
  );
}
