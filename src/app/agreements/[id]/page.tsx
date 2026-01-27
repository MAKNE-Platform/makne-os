import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";
import { Milestone } from "@/lib/db/models/Milestone";
import { createMilestoneAction } from "./milestones/create/actions";

type BrandUserType = {
    email: string;
};

type AgreementType = {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    deliverables?: string;
    amount?: number;
    status: string;
    brandId: mongoose.Types.ObjectId;
    creatorId?: mongoose.Types.ObjectId;
    creatorEmail?: string;

    policies?: {
        paymentTerms?: string;
        cancellationPolicy?: string;
        revisionPolicy?: string;
        usageRights?: string;
    };

    activity?: {
        message: string;
        createdAt: Date;
    }[];
};

export default async function AgreementDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) redirect("/auth/login");

    await connectDB();

    const agreement = (await Agreement.findById(id).lean()) as AgreementType | null;
    if (!agreement) redirect("/agreements");

    const isBrand = agreement.brandId.toString() === userId;
    const isCreator = agreement.creatorId?.toString() === userId;
    const canRespond = isCreator && agreement.status === "SENT";
    const canAddMilestone = isBrand && agreement.status === "DRAFT";
    const canSendAgreement = isBrand && agreement.status === "DRAFT";

    if (!isBrand && !isCreator) redirect("/dashboard");

    const brandUser = (await User.findById(
        agreement.brandId
    ).lean()) as BrandUserType | null;

    const milestones = await Milestone.find({
        agreementId: agreement._id,
    }).lean();

    const canEditPolicy =
        isBrand && agreement.status === "DRAFT";

    return (
        <div className="max-w-2xl space-y-8">
            <h1 className="text-2xl font-medium">{agreement.title}</h1>

            <p className="text-sm text-zinc-400">
                Status: <span className="text-white">{agreement.status}</span>
            </p>

            {/* Brand / Creator info */}
            <div className="rounded-xl border border-white/10 p-4 bg-white/5 text-sm text-zinc-300">
                <p>
                    <span className="text-zinc-400">Brand:</span> {brandUser?.email}
                </p>
                {agreement.creatorEmail && (
                    <p>
                        <span className="text-zinc-400">Creator:</span>{" "}
                        {agreement.creatorEmail}
                    </p>
                )}
            </div>

            <div className="rounded-xl border border-white/10 p-6 bg-white/5 space-y-4">
                <h3 className="text-sm font-medium text-white">
                    Policies
                </h3>

                {!agreement.policies && (
                    <p className="text-sm text-zinc-400">
                        No policies defined yet.
                    </p>
                )}

                {agreement.policies?.paymentTerms && (
                    <p>
                        <span className="text-zinc-400">Payment terms:</span>{" "}
                        {agreement.policies.paymentTerms}
                    </p>
                )}

                {agreement.policies?.cancellationPolicy && (
                    <p>
                        <span className="text-zinc-400">Cancellation:</span>{" "}
                        {agreement.policies.cancellationPolicy}
                    </p>
                )}

                {agreement.policies?.revisionPolicy && (
                    <p>
                        <span className="text-zinc-400">Revisions:</span>{" "}
                        {agreement.policies.revisionPolicy}
                    </p>
                )}

                {agreement.policies?.usageRights && (
                    <p>
                        <span className="text-zinc-400">Usage rights:</span>{" "}
                        {agreement.policies.usageRights}
                    </p>
                )}
            </div>

            {canEditPolicy && (
                <div className="rounded-xl border border-white/10 p-6 bg-white/5">
                    <h3 className="text-sm font-medium text-white">
                        Define Policies
                    </h3>

                    <form
                        action={`/agreements/${agreement._id}/policies`}
                        method="POST"
                        className="mt-4 space-y-3"
                    >
                        <textarea
                            name="paymentTerms"
                            placeholder="Payment terms (e.g. payment released per milestone)"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />

                        <textarea
                            name="cancellationPolicy"
                            placeholder="Cancellation policy"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />

                        <textarea
                            name="revisionPolicy"
                            placeholder="Revision policy"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />

                        <textarea
                            name="usageRights"
                            placeholder="Usage rights & ownership"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />

                        <button className="rounded-lg bg-[#636EE1] px-5 py-2 text-sm text-white">
                            Save Policies
                        </button>
                    </form>
                </div>
            )}



            {/* Milestones */}
            <div className="rounded-xl border border-white/10 p-6 bg-white/5">
                <h3 className="text-sm font-medium text-white">Milestones</h3>

                {milestones.length === 0 && (
                    <p className="mt-2 text-sm text-zinc-400">No milestones yet.</p>
                )}

                <div className="mt-4 space-y-3">
                    {milestones.map((m: any) => (
                        <div key={m._id} className="rounded-lg border border-white/10 p-4">
                            <div className="flex justify-between">
                                <h4 className="font-medium">{m.title}</h4>
                                <span className="text-xs text-zinc-400">₹{m.amount}</span>
                            </div>
                            {m.description && (
                                <p className="mt-1 text-sm text-zinc-400">{m.description}</p>
                            )}
                            <p className="mt-2 text-xs text-zinc-500">
                                Status: {m.status}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add milestone (DRAFT only) */}
            {canAddMilestone && (
                <div className="rounded-xl border border-white/10 p-6 bg-white/5">
                    <h3 className="text-sm font-medium text-white">Add Milestone</h3>

                    <form
                        action={async (formData) => {
                            "use server";
                            await createMilestoneAction(id, formData);
                        }}
                        className="mt-4 space-y-3"
                    >
                        <input
                            name="title"
                            placeholder="Milestone title"
                            required
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />
                        <textarea
                            name="description"
                            placeholder="Description (optional)"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />
                        <input
                            name="amount"
                            type="number"
                            placeholder="Amount (₹)"
                            required
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />
                        <button className="rounded-lg bg-[#636EE1] px-5 py-2 text-sm text-white">
                            Add Milestone
                        </button>
                    </form>
                </div>
            )}

            {/* Send agreement */}
            {canSendAgreement && (
                <div className="rounded-xl border border-white/10 p-6 bg-white/5">
                    <h3 className="text-sm font-medium text-white">Send Agreement</h3>

                    <form
                        action={`/agreements/${agreement._id}/send`}
                        method="POST"
                        className="mt-4 space-y-3"
                    >
                        <input
                            name="creatorEmail"
                            type="email"
                            required
                            placeholder="Creator email"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />
                        <button className="rounded-lg bg-[#636EE1] px-6 py-2 text-sm text-white">
                            Send to Creator
                        </button>
                    </form>
                </div>
            )}

            {/* Respond */}
            {canRespond && (
                <form
                    action={`/agreements/${id}/respond`}
                    method="POST"
                    className="flex gap-3"
                >
                    <button
                        name="action"
                        value="ACCEPT"
                        className="rounded-lg bg-[#636EE1] px-5 py-2 text-sm text-white"
                    >
                        Accept
                    </button>
                    <button
                        name="action"
                        value="REJECT"
                        className="rounded-lg border border-white/20 px-5 py-2 text-sm text-white"
                    >
                        Reject
                    </button>
                </form>
            )}
        </div>
    );
}
