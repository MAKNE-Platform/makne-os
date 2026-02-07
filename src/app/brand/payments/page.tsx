import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { BrandProfile } from "@/lib/db/models/BrandProfile";
import { Payment } from "@/lib/db/models/Payment";
import { Agreement } from "@/lib/db/models/Agreement";
import { User } from "@/lib/db/models/User";


import BrandSidebar from "@/components/brand/BrandSidebar";
import MobileTopNav from "@/components/dashboard/MobileTopNav";

type BrandProfileType = {
    brandName: string;
    industry: string;
    location?: string;
};

export default async function BrandPaymentsPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "BRAND") redirect("/auth/login");

    await connectDB();

    /* ================= BRAND PROFILE ================= */

    const brandProfile = (await BrandProfile.findOne({
        userId: new mongoose.Types.ObjectId(userId),
    }).lean()) as BrandProfileType | null;

    if (!brandProfile) redirect("/onboarding/brand");

    /* ================= PAYMENTS ================= */

    const payments = await Payment.find({
        brandId: new mongoose.Types.ObjectId(userId),
    })
        .sort({ createdAt: -1 })
        .lean();

    const released = payments.filter(p => p.status === "RELEASED");
    const pending = payments.filter(p =>
        ["PENDING", "INITIATED"].includes(p.status)
    );

    const totalPaid = released.reduce(
        (sum, p) => sum + (p.amount ?? 0),
        0
    );

    /* ================= LOOKUPS ================= */

    // Agreements
    const agreementIds = payments.map(p => p.agreementId);
    const agreements = await Agreement.find(
        { _id: { $in: agreementIds } },
        { title: 1 }
    ).lean();

    const agreementMap = new Map(
        agreements.map(a => [a._id.toString(), a.title])
    );

    // Creators
    const creatorIds = payments.map(p => p.creatorId);
    const creators = await User.find(
        { _id: { $in: creatorIds } },
        { email: 1 }
    ).lean();

    const creatorMap = new Map(
        creators.map(c => [c._id.toString(), c.email])
    );


    return (
        <div className="min-h-screen bg-black text-white lg:px-0 px-2">

            {/* ================= MOBILE NAV ================= */}
            <MobileTopNav
                brandName={brandProfile.brandName}
                industry={brandProfile.industry}
            />

            <div className="flex">

                {/* ================= SIDEBAR ================= */}
                <BrandSidebar
                    active="payments"
                    brandProfile={brandProfile}
                />

                {/* ================= MAIN ================= */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-medium">Payments</h1>
                        <p className="mt-1 text-md opacity-70">
                            All payments derived from milestone completion
                        </p>
                    </div>

                    {/* ================= SUMMARY ================= */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">

                        <SummaryCard
                            label="Total paid"
                            value={`₹ ${totalPaid.toLocaleString()}`}
                        />

                        <SummaryCard
                            label="Released"
                            value={released.length}
                        />

                        <SummaryCard
                            label="Pending"
                            value={pending.length}
                        />

                    </div>

                    {/* ================= PAYMENTS TABLE ================= */}
                    <div className="rounded-xl border border-white/10 overflow-hidden">

                        {/* Header — desktop only */}
                        <div
                            className="
      hidden lg:grid
      grid-cols-[2fr_2fr_1fr_1fr_1fr]
      gap-4
      px-4 py-3
      text-xs
      uppercase
      tracking-wide
      opacity-60
      border-b border-white/10
    "
                        >
                            <div>Agreement</div>
                            <div>Creator</div>
                            <div>Amount</div>
                            <div>Status</div>
                            <div>Date</div>
                        </div>

                        {/* Rows */}
                        {payments.length === 0 && (
                            <div className="px-4 py-6 text-sm opacity-70">
                                No payment activity yet.
                            </div>
                        )}

                        {payments.map((p: any) => {
                            const agreementTitle =
                                agreementMap.get(p.agreementId.toString()) ?? "—";

                            const creatorEmail =
                                creatorMap.get(p.creatorId.toString()) ?? "—";

                            return (
                                <div
                                    key={p._id.toString()}
                                    className="
          border-b border-white/5
          bg-[#ffffff05]
        "
                                >

                                    {/* ================= DESKTOP ROW ================= */}
                                    <div
                                        className="
            hidden lg:grid
            grid-cols-[2fr_2fr_1fr_1fr_1fr]
            gap-4
            px-4 py-4
            text-sm
            items-center
          "
                                    >
                                        <div className="truncate font-medium">
                                            {agreementTitle}
                                        </div>

                                        <div className="truncate opacity-80">
                                            {creatorEmail}
                                        </div>

                                        <div className="font-medium">
                                            ₹ {p.amount.toLocaleString()}
                                        </div>

                                        <StatusPill status={p.status} />

                                        <div className="text-xs opacity-60">
                                            {new Date(p.createdAt).toDateString()}
                                        </div>
                                    </div>

                                    {/* ================= MOBILE CARD ================= */}
                                    <div className="lg:hidden px-4 py-4 space-y-2 text-sm">

                                        <div className="font-medium">
                                            {agreementTitle}
                                        </div>

                                        <div className="text-xs opacity-70">
                                            {creatorEmail}
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="font-medium">
                                                ₹ {p.amount.toLocaleString()}
                                            </div>

                                            <StatusPill status={p.status} />
                                        </div>

                                    </div>

                                </div>
                            );
                        })}
                    </div>


                </main>
            </div>
        </div>
    );
}

/* ================= UI ================= */

function SummaryCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="
      rounded-xl
      border border-white/10
      bg-[#ffffff05]
      p-4
    ">
            <div className="text-xs opacity-70">
                {label}
            </div>
            <div className="mt-2 text-3xl font-medium">
                {value}
            </div>
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const color =
        status === "RELEASED"
            ? "text-[#636EE1] border-[#636EE1]"
            : status === "FAILED"
                ? "text-red-400 border-red-400"
                : "opacity-70 border-white/20";

    return (
        <span
            className={`
        inline-flex
        w-max
        rounded-full
        border
        px-3 py-1
        text-xs
        ${color}
      `}
        >
            {status}
        </span>
    );
}
