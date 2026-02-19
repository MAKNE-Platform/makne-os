import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";
import { Milestone } from "@/lib/db/models/Milestone";
import { Payment } from "@/lib/db/models/Payment";
import DeliverMilestoneForm from "./_components/DeliverMilestoneForm";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Download } from "lucide-react";

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
    if (!mongoose.Types.ObjectId.isValid(id)) redirect("/agreements");

    const agreement = (await Agreement.findById(id).lean()) as any;
    if (!agreement) redirect("/agreements");

    const isBrand = agreement.brandId.toString() === userId;
    const isCreator = agreement.creatorId?.toString() === userId;

    const backHref = isBrand
        ? "/agreements"
        : "/creator/agreements";

    if (!isBrand && !isCreator) redirect("/dashboard");

    const brandProfile = (await BrandProfile.findOne({
        userId: agreement.brandId,
    }).lean()) as any;


    const milestones = await Milestone.find({
        agreementId: agreement._id,
    }).lean();

    const payments = await Payment.find({
        agreementId: agreement._id,
    }).lean();

    const paymentByMilestoneId = new Map(
        payments.map((p) => [p.milestoneId.toString(), p])
    );

    const totalValue = milestones.reduce((sum, m) => sum + m.amount, 0);
    const paidAmount = payments
        .filter((p) => p.status === "RELEASED")
        .reduce((sum, p) => sum + p.amount, 0);

    const completedCount = milestones.filter(
        (m: any) => m.status === "COMPLETED"
    ).length;

    const progressPercent =
        milestones.length > 0
            ? Math.round((completedCount / milestones.length) * 100)
            : 0;


    return (
        <div className="min-h-screen bg-[#0B0B0D] text-white">
            
            <div className="max-w-5xl mx-auto px-8 py-12 space-y-10">

                {/* BACK BUTTON */}
                <div className="flex items-center justify-between border-b pb-5 border-white/5">
                    <a
                        href={backHref}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-[#121214] hover:border-[#636EE1] hover:text-white text-sm text-zinc-400 transition"
                    >
                        ← Back
                    </a>
                    <img className="h-10" src="/makne-logo-lg.png" alt="" />
                </div>


                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="lg:text-4xl text-2xl font-semibold tracking-tight">
                            {agreement.title}
                        </h1>
                        {/* <p className="text-sm text-zinc-500 mt-1">
                            Agreement ID • {agreement._id.toString().slice(-6)}
                        </p> */}
                    </div>

                    <span className="px-3 py-1 rounded-md text-sm bg-[#141418] border border-white/10 text-zinc-300">
                        {agreement.status}
                    </span>
                </div>

                <div className="border-t border-white/5" />


                <div className="bg-[#121214] border border-white/5 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">
                            Milestone Progress
                        </p>
                        <p className="text-sm text-zinc-400">
                            {completedCount} of {milestones.length} completed
                        </p>
                    </div>

                    <div className="w-full h-2 bg-[#1A1A1D] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#636EE1] transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <p className="text-xs text-zinc-500">
                        {progressPercent}% completed
                    </p>
                </div>


                {/* BASIC INFO */}
                <section className="space-y-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-2 gap-6">
                        <InfoField
                            label="Brand"
                            value={brandProfile?.brandName}
                        />

                        {agreement.creatorEmail && (
                            <InfoField
                                label="Creator"
                                value={agreement.creatorName || agreement.creatorEmail}
                            />

                        )}
                        {isBrand && (
                            <>
                                <InfoField
                                    label="Total Agreement Value"
                                    value={`₹${totalValue}`}
                                />
                                <InfoField
                                    label="Total Paid So Far"
                                    value={`₹${paidAmount}`}
                                />
                            </>
                        )}

                        {isCreator && (
                            <InfoField
                                label="Total Agreement Value"
                                value={`₹${totalValue}`}
                            />
                        )}

                    </div>
                </section>

                <div className="border-t border-white/5" />

                {/* MILESTONES */}
                <section className="space-y-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                        Milestones
                    </h2>

                    <div className="space-y-6">
                        {milestones.map((m: any) => {
                            const payment = paymentByMilestoneId.get(m._id.toString());
                            const hasSubmission = !!m.submission;

                            return (
                                <div
                                    key={m._id}
                                    className="bg-[#121214] border border-white/5 rounded-xl p-6 space-y-5"
                                >
                                    {/* HEADER ROW */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium">
                                                {m.title}
                                            </h3>

                                            <p className="text-xs text-zinc-500 mt-2">
                                                {m.status === "PENDING" && "Awaiting creator submission"}
                                                {m.status === "IN_PROGRESS" &&
                                                    "Submitted — awaiting review"}
                                                {m.status === "REVISION" &&
                                                    "Revision requested — update required"}
                                                {m.status === "COMPLETED" &&
                                                    "Approved and completed"}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-semibold">
                                                ₹{m.amount}
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                Milestone payout amount
                                            </p>
                                        </div>
                                    </div>

                                    {/* ================= CREATOR VIEW ================= */}

                                    {isCreator && agreement.status === "ACTIVE" && (
                                        <div className="space-y-4">

                                            {m.submission ? (
                                                <div className="bg-[#0F0F12] border border-white/5 rounded-lg p-4 space-y-3">

                                                    <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                                        Your Submitted Work
                                                    </p>

                                                    {m.submission?.submittedAt && (
                                                        <p className="text-xs text-zinc-500">
                                                            Submitted on{" "}
                                                            {new Date(m.submission.submittedAt).toLocaleDateString()}
                                                        </p>
                                                    )}

                                                    {m.submission.note && (
                                                        <p className="text-sm text-zinc-300">
                                                            {m.submission.note}
                                                        </p>
                                                    )}

                                                    {/* File Preview Here */}

                                                    <SubmissionFiles files={m.submission.files} />

                                                </div>
                                            ) : (
                                                <div className="bg-[#0F0F12] border border-dashed border-white/10 rounded-lg p-4 text-sm text-zinc-500">
                                                    Not submitted yet.
                                                </div>
                                            )}

                                            {(m.status === "PENDING" || m.status === "REVISION") && (
                                                <DeliverMilestoneForm milestoneId={m._id.toString()} />
                                            )}

                                        </div>
                                    )}


                                    {/* ================= BRAND VIEW ================= */}
                                    {isBrand && (
                                        <div className="space-y-4">

                                            {m.submission ? (
                                                <div className="bg-[#0F0F12] border border-white/5 rounded-lg p-4 space-y-3">

                                                    <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                                        Creator Submission
                                                    </p>

                                                    {m.submission?.submittedAt && (
                                                        <p className="text-xs text-zinc-500">
                                                            Submitted on{" "}
                                                            {new Date(m.submission.submittedAt).toLocaleDateString()}
                                                        </p>
                                                    )}

                                                    {m.submission.note && (
                                                        <p className="text-sm text-zinc-300">
                                                            {m.submission.note}
                                                        </p>
                                                    )}

                                                    <SubmissionFiles files={m.submission.files} />

                                                    {m.submission?.files?.length > 0 && (
                                                        <div className="pt-3">
                                                            <a
                                                                href={m.submission.files[0].url}
                                                                target="_blank"
                                                                download
                                                                className="inline-flex items-center gap-2 bg-[#161618] hover:bg-[#1E1E22] border border-white/10 px-4 py-2 rounded-lg text-sm transition"
                                                            >
                                                                <Download />Download
                                                            </a>
                                                        </div>
                                                    )}


                                                    {/* BRAND ACTIONS */}
                                                    {m.status === "IN_PROGRESS" && (
                                                        <div className="flex gap-3 pt-4 border-t border-white/5">

                                                            {/* APPROVE */}
                                                            <form
                                                                action={`/milestones/${m._id}/approve`}
                                                                method="POST"
                                                            >
                                                                <button
                                                                    type="submit"
                                                                    className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm transition"
                                                                >
                                                                    Approve
                                                                </button>
                                                            </form>

                                                            {/* REQUEST REVISION */}
                                                            <form
                                                                action={`/milestones/${m._id}/request-changes`}
                                                                method="POST"
                                                            >
                                                                <button
                                                                    type="submit"
                                                                    className="bg-[#161618] border border-white/10 hover:bg-[#1E1E22] px-4 py-2 rounded-lg text-sm transition"
                                                                >
                                                                    Request Revision
                                                                </button>
                                                            </form>

                                                        </div>
                                                    )}


                                                </div>
                                            ) : (
                                                <div className="bg-[#0F0F12] border border-dashed border-white/10 rounded-lg p-4 text-sm text-zinc-500">
                                                    Not submitted yet.
                                                </div>
                                            )}

                                        </div>
                                    )}


                                    {/* ================= BRAND PAYMENT BLOCK ================= */}
                                    {isBrand && payment && m.status === "COMPLETED" && (
                                        <div className="pt-4 border-t border-white/5">
                                            {isBrand && payment && m.status === "COMPLETED" && (
                                                <div className="pt-4 border-t border-white/5 space-y-3">

                                                    {payment.status === "PENDING" && (
                                                        <form
                                                            method="POST"
                                                            action={`/api/payments/${payment._id}/initiate`}
                                                        >
                                                            <button className="bg-[#636EE1] px-4 py-2 rounded-md text-sm">
                                                                Release ₹{payment.amount}
                                                            </button>
                                                        </form>
                                                    )}

                                                    {payment.status === "INITIATED" && (
                                                        <p className="text-amber-400 text-sm">
                                                            ⏳ Payment processing...
                                                        </p>
                                                    )}

                                                    {payment.status === "RELEASED" && (
                                                        <p className="text-emerald-400 text-sm">
                                                            ✅ Payment released to creator
                                                        </p>
                                                    )}

                                                </div>
                                            )}

                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="border-t border-white/5" />

                {/* EXPORT */}
                <section>
                    <a
                        href={`/agreements/${agreement._id}/print`}
                        target="_blank"
                        className="inline-block border border-white/10 px-4 py-2 rounded-md text-sm hover:border-[#636EE1] transition"
                    >
                        Export / Print Agreement
                    </a>
                </section>
            </div>
        </div>
    );
}

function InfoField({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="space-y-1">
            <p className="text-sm text-zinc-500 uppercase tracking-wide">
                {label}
            </p>
            <p className="text-sm text-white">{value}</p>
        </div>
    );
}

function SubmissionFiles({ files }: { files?: any[] }) {
    if (!files || files.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {files.map((file: any, i: number) => {
                const type = file.type || "";

                const isImage =
                    type.startsWith("image/") ||
                    file.name?.match(/\.(jpg|jpeg|png|webp|gif)$/i);

                return (
                    <div
                        key={i}
                        className="border border-white/5 rounded-2xl overflow-hidden bg-[#0F0F12]"
                    >
                        {isImage ? (
                            <a href={file.url} target="_blank">
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-full h-56 object-cover hover:opacity-90 transition"
                                />
                            </a>
                        ) : (
                            <a
                                href={file.url}
                                target="_blank"
                                className="block p-6 text-sm text-[#636EE1] hover:underline"
                            >
                                {file.name}
                            </a>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

