import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";
import { Milestone } from "@/lib/db/models/Milestone";
import DeliverMilestoneForm from "./_components/DeliverMilestoneForm";


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

    const missingCreator = isDraft && !agreement.creatorEmail;
    const missingPolicy = isDraft && !agreement.policies;


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
                <div className="rounded-xl border border-white/10 p-6 bg-white/5 space-y-6">
                    <h3 className="text-sm font-medium text-white">Deliverables</h3>

                    {/* EXISTING DELIVERABLES */}
                    {deliverables.length === 0 && (
                        <p className="text-sm text-zinc-400">
                            No deliverables added yet.
                        </p>
                    )}

                    {deliverables.map((d: any) => (
                        <div
                            key={d._id}
                            className="rounded-lg border border-white/10 p-4 space-y-3"
                        >
                            {/* EDIT */}
                            <form
                                action={`/agreements/${agreement._id}/deliverables/update`}
                                method="POST"
                                className="space-y-2"
                            >
                                <input type="hidden" name="deliverableId" value={d._id.toString()}
                                />

                                <input
                                    name="title"
                                    defaultValue={d.title}
                                    className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                                />

                                <textarea
                                    name="description"
                                    defaultValue={d.description}
                                    placeholder="Description (optional)"
                                    className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                                />

                                <button className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white">
                                    Update Deliverable
                                </button>
                            </form>

                            {/* DELETE */}
                            <form
                                action={`/agreements/${agreement._id}/deliverables/delete`}
                                method="POST"
                            >
                                <input type="hidden" name="deliverableId" value={d._id.toString()}
                                />
                                <button className="text-xs text-red-400 hover:underline">
                                    Delete deliverable
                                </button>
                            </form>
                        </div>
                    ))}

                    {/* ADD NEW DELIVERABLE */}
                    <div className="rounded-lg border border-dashed border-white/20 p-4 space-y-3">
                        <h4 className="text-sm font-medium text-white">
                            Add new deliverable
                        </h4>

                        <form
                            action={`/agreements/${agreement._id}/deliverables/create`}
                            method="POST"
                            className="space-y-2"
                        >
                            <input
                                name="title"
                                placeholder="Deliverable title"
                                required
                                className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                            />

                            <textarea
                                name="description"
                                placeholder="Description (optional)"
                                className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                            />

                            <button className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white">
                                Add Deliverable
                            </button>
                        </form>
                    </div>
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

                        {/* ===== CREATOR SUBMISSION UI ===== */}
                        {/* {isCreator &&
                            agreement.status === "ACTIVE" &&
                            m.status === "PENDING" && (
                                <form
                                    action={`/milestones/${m._id}/deliver`}
                                    method="POST"
                                    encType="multipart/form-data"
                                    className="mt-4 space-y-3"
                                >
                                    <textarea
                                        name="note"
                                        placeholder="Delivery note (optional)"
                                        className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                                    />

                                    <input
                                        type="file"
                                        name="files"
                                        multiple
                                        className="w-full text-sm text-zinc-400"
                                    />

                                    <input
                                        type="text"
                                        name="links"
                                        placeholder="External links (comma separated)"
                                        className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                                    />

                                    <button className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm text-white">
                                        Submit Work
                                    </button>
                                </form>
                            )} */}

                        {isCreator &&
                            agreement.status === "ACTIVE" &&
                            m.status === "PENDING" && (
                                <DeliverMilestoneForm milestoneId={m._id.toString()} />
                            )}

                        {/* ===== BRAND VIEW: SUBMITTED CONTENT ===== */}
                        {isBrand && m.submission && (
                            <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                                {m.status === "PENDING" && (
                                    <p className="text-xs text-zinc-400">
                                        Not submitted yet
                                    </p>
                                )}

                                {m.submission?.submittedAt && (
                                    <p className="text-xs text-zinc-400">
                                        Submitted on{" "}
                                        {new Date(m.submission.submittedAt).toLocaleDateString()}
                                    </p>
                                )}


                                {m.submission.note && (
                                    <p className="text-sm text-zinc-300">
                                        <span className="text-zinc-400">Note:</span>{" "}
                                        {m.submission.note}
                                    </p>
                                )}

                                {m.submission.files?.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-zinc-400">Files:</p>
                                        <ul className="list-disc pl-5 text-sm">
                                            {m.submission.files.map((file: any, i: number) => (
                                                <li key={i}>
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        className="text-[#636EE1] hover:underline"
                                                    >
                                                        {file.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {m.submission.links?.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-zinc-400">Links:</p>
                                        <ul className="list-disc pl-5 text-sm">
                                            {m.submission.links.map((link: string, i: number) => (
                                                <li key={i}>
                                                    <a
                                                        href={link}
                                                        target="_blank"
                                                        className="text-[#636EE1] hover:underline"
                                                    >
                                                        {link}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

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
                        Creator
                    </h3>

                    <form
                        action={`/agreements/${agreement._id}/send`}
                        method="POST"
                        className="space-y-3"
                    >
                        <input
                            name="creatorEmail"
                            type="email"
                            required
                            defaultValue={agreement.creatorEmail || ""}
                            placeholder="Creator email"
                            className="w-full rounded-lg bg-[#161618] px-3 py-2 text-sm text-white"
                        />

                        <p className="text-xs text-zinc-400">
                            Sending the agreement will lock deliverables, milestones, and policies.
                        </p>

                        <button className="rounded-lg bg-[#636EE1] px-5 py-2 text-sm text-white">
                            Send to Creator
                        </button>
                    </form>

                </div>
            )}


            {/* CREATOR RESPONSE */}
            {isSent && isCreator && (
                <form
                    action={`/agreements/${agreement._id}/respond`}
                    method="POST"
                    target="_self"
                    className="flex gap-3"
                >
                    <input type="hidden" name="redirectTo" value="self" />

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