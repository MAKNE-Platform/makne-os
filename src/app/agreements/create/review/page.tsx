import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { Milestone } from "@/lib/db/models/Milestone";
import {
    createAgreementAction,
    createAndSendAgreementAction,
} from "./actions";


type ReviewAgreementType = {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    creatorEmail?: string;
    deliverables?: {
        _id: mongoose.Types.ObjectId;
        title: string;
        description?: string;
    }[];
    policies?: {
        paymentTerms?: string;
        cancellationPolicy?: string;
        revisionPolicy?: string;
        usageRights?: string;
    };
};

export default async function ReviewAgreementPage() {

    const cookieStore = await cookies();
    const role = cookieStore.get("user_role")?.value;
    const agreementId = cookieStore.get("draft_agreement_id")?.value;

    if (role !== "BRAND") redirect("/auth/login");
    if (!agreementId) redirect("/brand/dashboard");

    await connectDB();

    const agreement = (await Agreement.findById(
        new mongoose.Types.ObjectId(agreementId)
    ).lean()) as unknown as ReviewAgreementType | null;

    if (!agreement) redirect("/brand/dashboard");

    const missingCreator = !agreement.creatorEmail;
    const missingPolicy = !agreement.policies;


    type ReviewMilestoneType = {
        _id: mongoose.Types.ObjectId;
        title: string;
        amount: number;
    };

    const milestones = (await Milestone.find({
        agreementId: agreement._id,
    }).lean()) as unknown as ReviewMilestoneType[];

    const missingMilestones = milestones.length === 0;

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-2xl font-medium">
                    Review Agreement
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                    Step 5 of 6 · Final review before creation
                </p>
            </div>

            {/* META */}
            <section className="rounded-xl border border-white/10 p-6 bg-white/5">
                <h2 className="text-sm font-medium text-white">Meta</h2>
                <p className="mt-2 text-sm text-zinc-300">
                    <b>Title:</b> {agreement.title}
                </p>
                {agreement.description && (
                    <p className="text-sm text-zinc-300">
                        <b>Description:</b> {agreement.description}
                    </p>
                )}
                {agreement.creatorEmail && (
                    <p className="text-sm text-zinc-300">
                        <b>Creator:</b> {agreement.creatorEmail}
                    </p>
                )}
            </section>

            {/* DELIVERABLES */}
            <section className="rounded-xl border border-white/10 p-6 bg-white/5">
                <h2 className="text-sm font-medium text-white">Deliverables</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                    {agreement.deliverables?.map((d: any) => (
                        <li key={d._id}>• {d.title}</li>
                    ))}
                </ul>
            </section>

            {/* MILESTONES */}
            <section className="rounded-xl border border-white/10 p-6 bg-white/5">
                <h2 className="text-sm font-medium text-white">Milestones</h2>
                <div className="mt-3 space-y-3">
                    {milestones.map((m: any) => (
                        <div key={m._id} className="text-sm text-zinc-300">
                            <p>
                                <b>{m.title}</b> — ₹{m.amount}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* POLICIES */}
            {agreement.policies && (
                <section className="rounded-xl border border-white/10 p-6 bg-white/5">
                    <h2 className="text-sm font-medium text-white">Policies</h2>
                    {Object.entries(agreement.policies).map(
                        ([key, value]) =>
                            value && (
                                <p key={key} className="mt-2 text-sm text-zinc-300">
                                    <b>{key}:</b> {value}
                                </p>
                            )
                    )}
                </section>
            )}

            {missingCreator && (
                <section className="rounded-xl border p-4 space-y-3">
                    <p className="text-sm">
                        No creator added yet. Add a creator to send this agreement.
                    </p>

                    <form
                        action="/agreements/update-creator"
                        method="POST"
                        className="flex gap-2"
                    >
                        <input
                            type="hidden"
                            name="agreementId"
                            value={agreement._id.toString()}
                        />

                        <input
                            name="creatorEmail"
                            type="email"
                            required
                            placeholder="creator@email.com"
                            className="flex-1 rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />

                        <button className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white">
                            Add Creator
                        </button>
                    </form>
                </section>
            )}


            {/* ACTIONS */}
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <form action={createAgreementAction}>
                        <button className="rounded-lg border border-white/20 px-5 py-2 text-sm text-white">
                            Create Draft
                        </button>
                    </form>

                    {missingCreator && (
                        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">
                            Please add a creator before sending the agreement.
                        </div>
                    )}

                    {missingPolicy && (
                        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">
                            Please define policies before sending the agreement.
                        </div>
                    )}

                    <form action={createAndSendAgreementAction} className="space-y-3">
                        <button
                            type="submit"
                            name="mode"
                            value="SEND"
                            disabled={missingCreator || missingPolicy || missingMilestones}

                            className="rounded-lg bg-[#636EE1] px-6 py-3 text-sm text-white disabled:opacity-40"
                        >
                            Create & Send Agreement
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
}
