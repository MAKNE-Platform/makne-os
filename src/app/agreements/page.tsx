import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";

export default async function AgreementsPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId) redirect("/auth/login");

    await connectDB();

    const agreements = await Agreement.find({
        brandId: userId,
    }).lean();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-medium">Agreements</h1>

            {agreements.length === 0 && (
                <p className="text-zinc-400">No agreements yet.</p>
            )}

            <div className="space-y-3">
                {agreements.map((agreement: any) => (
                    <div
                        key={agreement._id}
                        className="rounded-xl border border-white/10 p-4 bg-white/5 space-y-3"
                    >
                        <div>
                            <a
                                href={`/agreements/${agreement._id}`}
                                className="hover:underline"
                            >
                                {agreement.title}
                            </a>

                            <p className="text-sm text-zinc-400">
                                Status: {agreement.status}
                            </p>
                        </div>

                        {agreement.status === "DRAFT" && (
                            <form
                                action={`/agreements/${agreement._id}/send`}
                                method="POST"
                                className="flex gap-2"
                            >
                                <input
                                    name="creatorEmail"
                                    type="email"
                                    required
                                    placeholder="Creator email"
                                    className="flex-1 rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                                />

                                <button className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white">
                                    Send
                                </button>
                            </form>
                        )}
                    </div>

                ))}
            </div>
        </div>
    );
}
