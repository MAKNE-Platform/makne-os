import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Agreement } from "@/lib/db/models/Agreement";
import Link from "next/link";

type BrandProfileType = {
  brandName: string;
  industry: string;
  location?: string;
};

type AgreementType = {
  _id: mongoose.Types.ObjectId;
  title: string;
  status: string;
  creatorEmail?: string;
  createdAt: Date;
};


export default async function BrandDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  const profile = (await BrandProfile.findOne({
    userId,
  }).lean()) as BrandProfileType | null;

  if (!profile) {
    redirect("/onboarding/brand");
  }

  const agreements = (await Agreement.find(
    { brandId: new mongoose.Types.ObjectId(userId) },
    {
      title: 1,
      status: 1,
      creatorEmail: 1,
      createdAt: 1,
    }
  )
    .sort({ createdAt: -1 })
    .lean()) as unknown as AgreementType[];


  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-medium">Brand Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your collaborations and agreements
        </p>
      </div>

      {/* BRAND PROFILE */}
      <div className="rounded-xl border border-white/10 p-6 bg-white/5">
        <h2 className="text-sm font-medium text-white">
          Brand Profile
        </h2>

        <div className="mt-4 space-y-2 text-sm text-zinc-300">
          <p>
            <span className="text-zinc-400">Brand:</span>{" "}
            {profile.brandName}
          </p>

          <p>
            <span className="text-zinc-400">Industry:</span>{" "}
            {profile.industry}
          </p>

          {profile.location && (
            <p>
              <span className="text-zinc-400">Location:</span>{" "}
              {profile.location}
            </p>
          )}
        </div>
      </div>

      {/* AGREEMENTS */}
      <div className="rounded-xl border border-white/10 p-6 bg-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">
            Agreements
          </h2>

          <Link
            href="/agreements/create"
            className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white"
          >
            Create Agreement
          </Link>
        </div>

        {agreements.length === 0 && (
          <p className="mt-4 text-sm text-zinc-400">
            You haven’t created any agreements yet.
          </p>
        )}

        <div className="mt-4 space-y-3">
          {agreements.map((agreement) => {
            const isDraft = agreement.status === "DRAFT";

            return (
              <div
                key={agreement._id.toString()}
                className="flex items-center justify-between rounded-lg border border-white/10 p-4"
              >
                <div>
                  <p className="font-medium text-white">
                    {agreement.title}
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    Status: {agreement.status}
                  </p>

                  {agreement.creatorEmail && (
                    <p className="mt-1 text-xs text-zinc-400">
                      Creator: {agreement.creatorEmail}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/agreements/${agreement._id}`}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white"
                  >
                    View
                  </Link>

                  {isDraft && (
                    <span className="text-xs text-zinc-400 self-center">
                      Editable
                    </span>
                  )}

                  {!isDraft && (
                    <span className="text-xs text-zinc-500 self-center">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
