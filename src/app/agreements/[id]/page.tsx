import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";
import { Milestone } from "@/lib/db/models/Milestone";

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
        redirect("/agreements/");
    }

    const agreement = (await Agreement.findById(id).lean()) as any;


    if (!agreement) redirect("/agreements");

    const isBrand = agreement.brandId.toString() === userId;
    const isCreator = agreement.creatorId?.toString() === userId;

    if (!isBrand && !isCreator) redirect("/dashboard");

    const brandUser = (await User.findById(
        agreement.brandId
    ).lean()) as any;

    const milestones = (await Milestone.find({
        agreementId: agreement._id,
    }).lean()) as any[];

    const deliverables = agreement.deliverables || [];

    const isDraft = agreement.status === "DRAFT";
    const isSent = agreement.status === "SENT";
    const isActive = agreement.status === "ACTIVE";

    const canSend =
        isDraft &&
        deliverables.length > 0 &&
        milestones.length > 0 &&
        agreement.policies;

    return (
        <div className="max-w-2xl space-y-10">

            {/* DRAFT BANNER */}
            {isDraft && isBrand && (
                <div className="rounded-xl border border-[#636EE1]/30 bg-[#636EE1]/10 p-4 text-sm text-[#636EE1]">
                    This agreement is in <b>Draft</b>. You can edit deliverables,
                    milestones, and policies until it is sent.
                </div>
            )}

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-medium">{agreement.title}</h1>
                <p className="mt-1 text-sm text-zinc-400">
                    Status: <span className="text-white">{agreement.status}</span>
                </p>
            </div>

            {/* BRAND / CREATOR */}
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

            {/* ================= DELIVERABLES ================= */}
            {isDraft && isBrand && (
                <div className="rounded-xl border border-white/10 p-6 bg-white/5 space-y-4">
                    <h3 className="text-sm font-medium text-white">
                        Deliverables
                    </h3>

                    <form
                        action={`/agreements/${agreement._id}/deliverables`}
                        method="POST"
                        className="space-y-4"
                    >
                        {deliverables.map((d: any) => (
                            <div key={d._id} className="space-y-2">
                                <input
                                    name="deliverable_title"
                                    defaultValue={d.title}
                                    className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                                />
                                <textarea
                                    name="deliverable_description"
                                    defaultValue={d.description}
                                    className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                                />
                            </div>
                        ))}

                        <p className="text-xs text-zinc-400">
                            Changes are saved immediately.
                        </p>

                        <button className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white">
                            Update Deliverables
                        </button>
                    </form>
                </div>
            )}

            {/* ================= MILESTONES ================= */}
            <div className="rounded-xl border border-white/10 p-6 bg-white/5 space-y-4">
                <h3 className="text-sm font-medium text-white">
                    Milestones
                </h3>

                {milestones.length === 0 && (
                    <p className="text-sm text-zinc-400">
                        No milestones added yet.
                    </p>
                )}

                {milestones.map((m: any) => (
                    <div
                        key={m._id}
                        className="rounded-lg border border-white/10 p-4 space-y-2"
                    >
                        <div className="flex justify-between">
                            <h4 className="font-medium">{m.title}</h4>
                            <span className="text-xs text-zinc-400">
                                ₹{m.amount}
                            </span>
                        </div>

                        <p className="text-xs text-zinc-500">
                            Status: {m.status}
                        </p>

                        <p className="text-xs text-zinc-400">
                            Covers:{" "}
                            {deliverables
                                .filter((d: any) =>
                                    m.deliverableIds?.some(
                                        (id: any) => id.toString() === d._id.toString()
                                    )
                                )
                                .map((d: any) => d.title)
                                .join(", ")}
                        </p>
                    </div>
                ))}
            </div>

            {/* ADD MILESTONE */}
            {isDraft && isBrand && (
                <div className="rounded-xl border border-white/10 p-6 bg-white/5 space-y-4">
                    <h3 className="text-sm font-medium text-white">
                        Add Milestone
                    </h3>

                    {deliverables.length === 0 ? (
                        <p className="text-sm text-zinc-400">
                            Add deliverables before creating milestones.
                        </p>
                    ) : (
                        <form
                            action={`/agreements/${agreement._id}/milestones/create`}
                            method="POST"
                            className="space-y-4"
                        >
                            <input
                                name="title"
                                placeholder="Milestone title"
                                className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                            />

                            <input
                                name="amount"
                                type="number"
                                placeholder="Amount (₹)"
                                className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                            />

                            <div className="space-y-2">
                                <p className="text-sm text-zinc-400">
                                    Covers deliverables:
                                </p>

                                {deliverables.map((d: any) => (
                                    <label
                                        key={d._id}
                                        className="flex items-center gap-2 text-sm text-zinc-300"
                                    >
                                        <input
                                            type="checkbox"
                                            name="deliverableIds[]"
                                            value={d._id.toString()}
                                        />
                                        {d.title}
                                    </label>
                                ))}
                            </div>

                            <button className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white">
                                Add Milestone
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* ================= POLICIES ================= */}
            {isDraft && isBrand && (
                <div className="rounded-xl border border-white/10 p-6 bg-white/5 space-y-4">
                    <h3 className="text-sm font-medium text-white">
                        Policies
                    </h3>

                    <form
                        action={`/agreements/${agreement._id}/policies`}
                        method="POST"
                        className="space-y-3"
                    >
                        <textarea
                            name="paymentTerms"
                            defaultValue={agreement.policies?.paymentTerms}
                            placeholder="Payment terms"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />
                        <textarea
                            name="cancellationPolicy"
                            defaultValue={agreement.policies?.cancellationPolicy}
                            placeholder="Cancellation policy"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />
                        <textarea
                            name="revisionPolicy"
                            defaultValue={agreement.policies?.revisionPolicy}
                            placeholder="Revision policy"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />
                        <textarea
                            name="usageRights"
                            defaultValue={agreement.policies?.usageRights}
                            placeholder="Usage rights"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />

                        <button className="rounded-lg bg-[#636EE1] px-5 py-2 text-sm text-white">
                            Save Policies
                        </button>
                    </form>
                </div>
            )}

            {/* SEND AGREEMENT */}
            {isDraft && isBrand && (
                <div className="rounded-xl border border-white/10 p-6 bg-white/5 space-y-3">
                    <h3 className="text-sm font-medium text-white">
                        Send Agreement
                    </h3>

                    {canSend ? (
                        <form
                            action={`/agreements/${agreement._id}/send`}
                            method="POST"
                            className="space-y-3"
                        >
                            <input
                                name="creatorEmail"
                                type="email"
                                placeholder="Creator email"
                                className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                            />
                            <button className="rounded-lg bg-[#636EE1] px-6 py-2 text-sm text-white">
                                Send to Creator
                            </button>
                        </form>
                    ) : (
                        <p className="text-sm text-zinc-400">
                            Complete deliverables, milestones, and policies before sending.
                        </p>
                    )}
                </div>
            )}

            {/* CREATOR RESPONSE */}
            {isSent && isCreator && (
                <form
                    action={`/agreements/${agreement._id}/respond`}
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

            <a
                href={`/agreements/${agreement._id}/print`}
                target="_blank"
                className="inline-block rounded-lg border border-white/20 px-4 py-2 text-sm text-white"
            >
                Export / Print Agreement
            </a>
        </div>
    );
}
