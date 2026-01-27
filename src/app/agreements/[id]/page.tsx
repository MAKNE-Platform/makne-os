import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";


type BrandUserType = {
    email: string;
};

type AgreementType = {
    title: string;
    description?: string;
    deliverables?: string;
    amount?: number;
    status: string;
    brandId: mongoose.Types.ObjectId;
    creatorId?: mongoose.Types.ObjectId;
    creatorEmail?: string;

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

    if (!userId) {
        redirect("/auth/login");
    }

    await connectDB();

    const agreement = (await Agreement.findById(
        id
    ).lean()) as AgreementType | null;

    if (!agreement) {
        redirect("/agreements");
    }

    const isBrand =
        agreement.brandId.toString() === userId;
    const isCreator =
        agreement.creatorId?.toString() === userId;
    const canRespond =
        isCreator && agreement.status === "SENT";


    if (!isBrand && !isCreator) {
        redirect("/dashboard");
    }

    const brandUser = (await User.findById(
        agreement.brandId
    ).lean()) as BrandUserType | null;


    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-2xl font-medium">
                    {agreement.title}
                </h1>

                <p className="mt-2 text-sm text-zinc-400">
                    Status:{" "}
                    <span className="text-white">
                        {agreement.status}
                    </span>
                </p>
            </div>

            <div className="rounded-xl border border-white/10 p-6 bg-white/5 space-y-4">
                {agreement.description && (
                    <div>
                        <h3 className="text-sm font-medium text-white">
                            Description
                        </h3>
                        <p className="mt-1 text-sm text-zinc-300">
                            {agreement.description}
                        </p>
                    </div>
                )}

                {agreement.deliverables && (
                    <div>
                        <h3 className="text-sm font-medium text-white">
                            Deliverables
                        </h3>
                        <p className="mt-1 text-sm text-zinc-300">
                            {agreement.deliverables}
                        </p>
                    </div>
                )}

                {agreement.amount && (
                    <div>
                        <h3 className="text-sm font-medium text-white">
                            Amount
                        </h3>
                        <p className="mt-1 text-sm text-zinc-300">
                            ₹{agreement.amount}
                        </p>
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-white/10 p-6 bg-white/5 space-y-2 text-sm text-zinc-300">
                <p>
                    <span className="text-zinc-400">Brand:</span>{" "}
                    {brandUser?.email}
                </p>

                {agreement.creatorEmail && (
                    <p>
                        <span className="text-zinc-400">
                            Creator:
                        </span>{" "}
                        {agreement.creatorEmail}
                    </p>
                )}
            </div>

            <div className="rounded-xl border border-white/10 p-6 bg-white/5">
                <h3 className="text-sm font-medium text-white">
                    Activity
                </h3>

                <div className="mt-4 space-y-3 text-sm text-zinc-300">
                    {(!agreement.activity || agreement.activity.length === 0) && (
                        <p className="text-zinc-400">No activity yet.</p>
                    )}

                    {agreement.activity?.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <span className="text-zinc-500">•</span>
                            <div>
                                <p>{item.message}</p>
                                <p className="text-xs text-zinc-500">
                                    {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {canRespond && (
                <div className="rounded-xl border border-white/10 p-6 bg-white/5">
                    <h3 className="text-sm font-medium text-white">
                        Respond to Agreement
                    </h3>

                    <form
                        action={`/agreements/${id}/respond`}
                        method="POST"
                        className="mt-4 flex gap-3"
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
                </div>
            )}

        </div>
    );
}
