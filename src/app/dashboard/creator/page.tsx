import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";

import { Agreement } from "@/lib/db/models/Agreement";


type CreatorProfileType = {
    niche: string;
    platforms: string;
    portfolio?: string;
};

export default async function CreatorDashboard() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "CREATOR") {
        redirect("/auth/login");
    }

    await connectDB();

    const profile = (await CreatorProfile.findOne({
        userId,
    }).lean()) as CreatorProfileType | null;


    const agreements = await Agreement.find({
        creatorId: userId,
    }).lean();



    if (!profile) {
        // Safety fallback (should not happen, but good practice)
        redirect("/onboarding/creator");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-medium">Creator Dashboard</h1>
                <p className="mt-1 text-sm text-zinc-400">
                    Welcome back 👋
                </p>
            </div>

            <div className="rounded-xl border border-white/10 p-6 bg-white/5">
                <h2 className="text-sm font-medium text-white">
                    Your Profile
                </h2>

                <div className="mt-4 space-y-2 text-sm text-zinc-300">
                    <p>
                        <span className="text-zinc-400">Niche:</span>{" "}
                        {profile.niche}
                    </p>

                    <p>
                        <span className="text-zinc-400">Platforms:</span>{" "}
                        {profile.platforms}
                    </p>

                    {profile.portfolio && (
                        <p>
                            <span className="text-zinc-400">Portfolio:</span>{" "}
                            <a
                                href={profile.portfolio}
                                target="_blank"
                                className="text-[#636EE1] hover:underline"
                            >
                                View
                            </a>
                        </p>
                    )}
                </div>
            </div>


            <div className="rounded-xl border border-white/10 p-6 bg-white/5">
                <h2 className="text-sm font-medium text-white">
                    Agreements
                </h2>

                {agreements.length === 0 && (
                    <p className="mt-3 text-sm text-zinc-400">
                        No agreements received yet.
                    </p>
                )}

                <div className="mt-4 space-y-3">
                    {agreements.map((agreement: any) => (
                        <div
                            key={agreement._id}
                            className="rounded-lg border border-white/10 p-4"
                        >
                            <div className="flex items-center justify-between">
                                <a
  href={`/agreements/${agreement._id}`}
  className="hover:underline"
>
  {agreement.title}
</a>


                                <span className="text-xs rounded-full px-2 py-1 bg-white/10">
                                    {agreement.status}
                                </span>
                            </div>

                            {agreement.status === "SENT" && (
                                <form
                                    action={`/agreements/${agreement._id}/respond`}
                                    method="POST"
                                    className="mt-3 flex gap-2"
                                >
                                    <button
                                        name="action"
                                        value="ACCEPT"
                                        className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white"
                                    >
                                        Accept
                                    </button>

                                    <button
                                        name="action"
                                        value="REJECT"
                                        className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white"
                                    >
                                        Reject
                                    </button>
                                </form>
                            )}


                            {agreement.amount && (
                                <p className="mt-2 text-sm text-zinc-400">
                                    Amount: ₹{agreement.amount}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
