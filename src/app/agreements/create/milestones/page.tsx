import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { saveMilestonesAction } from "./actions";

type DeliverableType = {
    _id: mongoose.Types.ObjectId;
    title: string;
};

type AgreementWithDeliverables = {
    deliverables: {
        _id: mongoose.Types.ObjectId;
        title: string;
    }[];
};


export default async function MilestonesPage() {
    // --- AUTH & FLOW GUARDS ---
    const cookieStore = await cookies();
    const role = cookieStore.get("user_role")?.value;
    const agreementId = cookieStore.get("draft_agreement_id")?.value;

    if (role !== "BRAND") {
        redirect("/auth/login");
    }

    if (!agreementId) {
        redirect("/dashboard/brand");
    }

    // --- DATA FETCH ---
    await connectDB();

    const agreement = (await Agreement.findById(
        new mongoose.Types.ObjectId(agreementId)
    ).lean()) as unknown as AgreementWithDeliverables | null;

    if (!agreement || !Array.isArray(agreement.deliverables)) {
        redirect("/agreements/create/deliverables");
    }

    const deliverables = agreement.deliverables;


    // --- JSX (PURE COMPONENT BELOW) ---
    return (
        <div className="max-w-xl space-y-8">
            <div>
                <h1 className="text-2xl font-medium">
                    Define Milestones
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                    Step 3 of 6 · Payments & delivery mapping
                </p>
            </div>

            <form action={saveMilestonesAction} className="space-y-8">
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-white/10 p-5 bg-white/5 space-y-4"
                    >
                        <input
                            name="milestone_title"
                            placeholder={`Milestone ${index + 1} title`}
                            className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
                        />

                        <input
                            name="milestone_amount"
                            type="number"
                            placeholder="Amount (₹)"
                            className="w-full rounded-lg bg-[#161618] px-4 py-3 text-sm text-white"
                        />

                        <div className="space-y-2">
                            <p className="text-sm text-zinc-400">
                                Covers deliverables:
                            </p>

                            {deliverables.map((d) => (
                                <label
                                    key={d._id.toString()}
                                    className="flex items-center gap-2 text-sm text-zinc-300"
                                >
                                    <input
                                        type="checkbox"
                                        name={`milestone_${index}_deliverables`}
                                        value={d._id.toString()}
                                    />
                                    {d.title}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex justify-between">
                    <button className="rounded-lg bg-[#636EE1] px-6 py-3 text-sm text-white">
                        Continue
                    </button>
                </div>
            </form>
        </div>
    );
}
