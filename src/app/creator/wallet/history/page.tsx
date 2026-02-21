import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";

export default async function WalletHistoryPage() {
    await connectDB();

    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role?.toLowerCase() !== "creator") {
        return <div className="p-8">Unauthorized</div>;
    }

    const payments = await Payment.find({ creatorId: userId })
        .sort({ createdAt: -1 })
        .lean();

    const totalAmount = payments
        .filter((p) => p.status === "RELEASED")
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <Link
                    href="/creator/payments"
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>

                <a
                    href="/api/wallet/statement"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm"
                >
                    <Download className="w-4 h-4" />
                    Download Statement
                </a>
            </div>

            <div>
                <h1 className="text-2xl font-semibold">
                    Wallet Ledger
                </h1>
                <p className="text-muted-foreground text-sm">
                    Total Earnings: ₹{totalAmount}
                </p>
            </div>

            <div className="rounded-2xl border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 text-left">Date</th>
                            <th className="px-6 py-4 text-left">Agreement ID</th>
                            <th className="px-6 py-4 text-left">Milestone ID</th>
                            <th className="px-6 py-4 text-left">Amount</th>
                            <th className="px-6 py-4 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {payments.map((payment) => (
                            <tr key={String(payment._id)} className="border-b">
                                <td className="px-6 py-4">
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.agreementId.toString()}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.milestoneId.toString()}
                                </td>
                                <td className="px-6 py-4 text-emerald-400">
                                    ₹{payment.amount}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}