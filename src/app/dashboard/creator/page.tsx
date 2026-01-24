import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";

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
        </div>
    );
}
