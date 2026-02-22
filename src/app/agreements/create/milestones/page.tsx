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
        redirect("/brand/dashboard");
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
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0e1324] to-[#151933] px-6 py-16">

        <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#636EE1]/20 blur-[120px]">
            <div className="h-[260px] w-[260px] rounded-full bg-[#636EE1]/10 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-2xl space-y-12">

            {/* HEADER */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold tracking-tight text-white">
                        Define Milestones
                    </h1>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-zinc-400">
                        Step 3 of 6
                    </span>
                </div>

                <p className="text-sm text-zinc-400">
                    Break the agreement into structured payment stages and map
                    each milestone to specific deliverables.
                </p>

                {/* Progress Bar */}
                <div className="mt-4 h-1 w-full rounded-full bg-white/10">
                    <div className="h-full w-3/6 rounded-full bg-[#636EE1]" />
                </div>
            </div>

            {/* FORM CARD */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

                <form action={saveMilestonesAction} className="space-y-10">

                    {[0, 1, 2].map((index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-white/10 bg-[#121420] p-6 space-y-6 transition hover:border-white/20"
                        >
                            {/* Milestone Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-zinc-300">
                                    Milestone {index + 1}
                                </h3>
                                <span className="text-xs text-zinc-500">
                                    Payment Stage
                                </span>
                            </div>

                            {/* Title */}
                            <input
                                name="milestone_title"
                                placeholder={`Milestone ${index + 1} title`}
                                className="w-full rounded-2xl border border-white/10 bg-[#0f1322] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
                            />

                            {/* Amount */}
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                                    ₹
                                </span>
                                <input
                                    name="milestone_amount"
                                    type="number"
                                    placeholder="Amount"
                                    className="w-full rounded-2xl border border-white/10 bg-[#0f1322] pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
                                />
                            </div>

                            {/* Deliverables Mapping */}
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-zinc-300">
                                    Covers Deliverables
                                </p>

                                <div className="space-y-2 rounded-xl border border-white/10 bg-[#0f1322] p-4">
                                    {deliverables.map((d) => (
                                        <label
                                            key={d._id.toString()}
                                            className="flex items-center gap-3 text-sm text-zinc-300"
                                        >
                                            <input
                                                type="checkbox"
                                                name={`milestone_${index}_deliverables`}
                                                value={d._id.toString()}
                                                className="h-4 w-4 rounded border-white/20 bg-transparent text-[#636EE1] focus:ring-[#636EE1]"
                                            />
                                            {d.title}
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}

                    {/* CTA */}
                    <div className="flex justify-end pt-4">
                        <button className="group relative inline-flex items-center justify-center rounded-2xl bg-[#636EE1] px-8 py-3 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.98]">
                            <span className="absolute inset-0 rounded-2xl bg-[#636EE1]/20 blur-md opacity-0 transition group-hover:opacity-60" />
                            <span className="relative">Continue</span>
                        </button>
                    </div>

                </form>

            </div>
        </div>
    </div>
);
}
