import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { BrandProfile } from "@/lib/db/models/BrandProfile";

type BrandProfileType = {
  brandName: string;
  industry: string;
  location?: string;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Brand Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your collaborations
        </p>
      </div>

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
    </div>
  );
}
