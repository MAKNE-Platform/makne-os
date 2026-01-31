import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Payout } from "@/lib/db/models/Payout";
import { SystemPayoutActions } from "./SystemPayoutActions";
import type { PayoutDocument } from "@/lib/db/models/Payout";


export default async function SystemPayoutsPage() {
    await connectDB();

    const payouts = await Payout.find({})
        .sort({ requestedAt: -1 })
        .lean<PayoutDocument[]>();


    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <h1 className="mb-6 text-xl font-semibold">
                Payout Processing
            </h1>

            {payouts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No payout requests found.
                </p>
            ) : (
                <div className="space-y-3">
                    {payouts.map((payout) => (
                        <div
                            key={payout._id.toString()}
                            className="rounded-xl border bg-background p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">
                                        ₹{payout.amount}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Creator ID: {payout.creatorId.toString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Requested on{" "}
                                        {new Date(
                                            payout.requestedAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <SystemPayoutActions
                                    payoutId={payout._id.toString()}
                                    status={payout.status}
                                />

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
