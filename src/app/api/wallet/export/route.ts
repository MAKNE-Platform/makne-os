import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";

export async function GET(req: Request) {
    await connectDB();

    // TODO: add auth session validation
    const transactions = await Payment.find({
        status: "COMPLETED",
    })
        .populate({
            path: "agreement",
            match: { creator: userId },
        })
        .sort({ createdAt: -1 });

    const filteredTransactions = transactions.filter(
        (tx) => tx.agreement
    );
    const parser = new Parser({
        fields: ["date", "agreement", "amount", "status"],
    });

    const data = filteredTransactions.map((tx) => ({
        date: tx.createdAt.toISOString(),
        agreement: tx.agreement?.title || "",
        amount: tx.amount,
        status: tx.status,
    }));

    const csv = parser.parse(data);

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition":
                "attachment; filename=makne-earnings-report.csv",
        },
    });
}