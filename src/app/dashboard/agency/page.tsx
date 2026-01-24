import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { AgencyProfile } from "@/lib/db/models/AgencyProfile";

type AgencyProfileType = {
  agencyName: string;
  teamSize?: string;
  contactEmail: string;
};

export default async function AgencyDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "AGENCY") {
    redirect("/auth/login");
  }

  await connectDB();

  const profile = (await AgencyProfile.findOne({
    userId,
  }).lean()) as AgencyProfileType | null;

  if (!profile) {
    redirect("/onboarding/agency");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Agency Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your clients and creators
        </p>
      </div>

      <div className="rounded-xl border border-white/10 p-6 bg-white/5">
        <h2 className="text-sm font-medium text-white">
          Agency Profile
        </h2>

        <div className="mt-4 space-y-2 text-sm text-zinc-300">
          <p>
            <span className="text-zinc-400">Agency:</span>{" "}
            {profile.agencyName}
          </p>

          {profile.teamSize && (
            <p>
              <span className="text-zinc-400">Team size:</span>{" "}
              {profile.teamSize}
            </p>
          )}

          <p>
            <span className="text-zinc-400">Contact email:</span>{" "}
            {profile.contactEmail}
          </p>
        </div>
      </div>
    </div>
  );
}
