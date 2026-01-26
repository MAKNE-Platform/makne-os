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
};

export default async function AgreementDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params; // ✅ FIX

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
        </div>
    );
}
