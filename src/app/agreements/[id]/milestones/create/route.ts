import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { Milestone } from "@/lib/db/models/Milestone";
import { Agreement } from "@/lib/db/models/Agreement";

export async function POST(
    request: Request,
    context: { params: { id: string } }
) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "BRAND") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const amount = Number(formData.get("amount"));

    if (!title || !amount) {
        return NextResponse.json(
            { error: "Title and amount required" },
            { status: 400 }
        );
    }

    await connectDB();

    const agreement = await Agreement.findOne({
        _id: new mongoose.Types.ObjectId(context.params.id),
        brandId: new mongoose.Types.ObjectId(userId),
        status: "DRAFT",
    });

    if (!agreement) {
        return NextResponse.json(
            { error: "Agreement not editable" },
            { status: 403 }
        );
    }

    await Milestone.create({
        agreementId: agreement._id,
        title,
        description,
        amount,
        deliverableIds: [],
    });

    return NextResponse.redirect(
        new URL(`/agreements/${agreement._id}`, request.url)
    );
}
