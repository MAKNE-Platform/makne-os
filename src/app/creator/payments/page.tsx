import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";

import PaymentsClient from "./PaymentsClient";

import { getCreatorBalance } from "@/lib/payments/getCreatorBalance";
import { Payout } from "@/lib/db/models/Payout";

export default async function CreatorPaymentsPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "CREATOR") redirect("/auth/login");

    await connectDB();

    const creatorObjectId = new mongoose.Types.ObjectId(userId);

    const balance = await getCreatorBalance(creatorObjectId);

    const creatorId = new mongoose.Types.ObjectId(userId);

    const paymentsRaw = await Payment.find({
        creatorId,
        status: "RELEASED",
    })
        .lean<{
            _id: mongoose.Types.ObjectId;
            agreementId: mongoose.Types.ObjectId;
            milestoneId: mongoose.Types.ObjectId;
            brandId: mongoose.Types.ObjectId;
            creatorId: mongoose.Types.ObjectId;
            amount: number;
            status: "PENDING" | "INITIATED" | "RELEASED" | "FAILED";
            createdAt: Date;
            updatedAt: Date;
        }[]>();

    const payments = paymentsRaw.map((p) => ({
        id: p._id.toString(),
        agreementId: p.agreementId?.toString(),
        milestoneId: p.milestoneId?.toString(),
        brandId: p.brandId?.toString(),
        creatorId: p.creatorId?.toString(),
        amount: p.amount,
        status: p.status,
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
    }));

    const released = payments.filter(p => p.status === "RELEASED");
    const pending = payments.filter(
        p => p.status === "PENDING" || p.status === "INITIATED"
    );

    const totalEarnings = released.reduce((s, p) => s + p.amount, 0);
    const pendingEarnings = pending.reduce((s, p) => s + p.amount, 0);

    // Last 6 months earnings chart
    const now = new Date();
    const earningsChart: { label: string; value: number }[] = [];

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

        const label = d.toLocaleString("default", { month: "short" });

        const monthly = released
            .filter(p => {
                const date = new Date(p.updatedAt);
                return (
                    date.getMonth() === d.getMonth() &&
                    date.getFullYear() === d.getFullYear()
                );
            })
            .reduce((s, p) => s + p.amount, 0);

        earningsChart.push({ label, value: monthly });
    }

    return (
        <PaymentsClient
            payments={payments}
            totalEarnings={totalEarnings}
            pendingEarnings={pendingEarnings}
            earningsChart={earningsChart}
            balance={balance}
        />
    );
}