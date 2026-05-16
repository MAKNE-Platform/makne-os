import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { Milestone } from "@/lib/db/models/Milestone";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();

        const userId =
            cookieStore.get("auth_session")?.value;

        const role =
            cookieStore.get("user_role")?.value;

        if (!userId || role !== "CREATOR") {
            return NextResponse.redirect(
                new URL("/auth/login", req.url)
            );
        }

        const formData =
            await req.formData();

        const agreementId =
            formData.get("agreementId")?.toString();

        if (
            !agreementId ||
            !mongoose.Types.ObjectId.isValid(
                agreementId
            )
        ) {
            return NextResponse.redirect(
                new URL(
                    "/creator/portfolio/import",
                    req.url
                )
            );
        }

        await connectDB();

        const agreement: any =
            await Agreement.findOne({
                _id:
                    new mongoose.Types.ObjectId(
                        agreementId
                    ),

                creatorId:
                    new mongoose.Types.ObjectId(
                        userId
                    ),

                status: "COMPLETED",
            }).lean();

        const milestones =
            await Milestone.find({
                agreementId: agreement._id,
            }).lean();

        if (!agreement) {
            return NextResponse.redirect(
                new URL(
                    "/creator/portfolio/import",
                    req.url
                )
            );
        }

        const profile =
            await CreatorProfile.findOne({
                userId:
                    new mongoose.Types.ObjectId(
                        userId
                    ),
            });

        if (!profile) {
            return NextResponse.redirect(
                new URL(
                    "/creator/portfolio/import",
                    req.url
                )
            );
        }

        // Prevent duplicate imports
        const alreadyExists =
            profile.portfolio?.some(
                (p: any) =>
                    p.meta?.agreementId?.toString() ===
                    agreement._id.toString()
            );

        if (alreadyExists) {
            return NextResponse.redirect(
                new URL(
                    "/creator/portfolio?import=exists",
                    req.url
                )
            );
        }

        const media =
            milestones.flatMap((m: any) =>
                (m.submission?.files || []).map(
                    (file: any) => ({
                        type:
                            file.url?.match(
                                /\.(mp4|mov|webm)$/i
                            )
                                ? "VIDEO"
                                : "IMAGE",

                        url: file.url,
                    })
                )
            );

        const links =
            milestones.flatMap((m: any) =>
                (m.submission?.links || []).map(
                    (url: string) => ({
                        label: "Campaign Asset",
                        url,
                    })
                )
            );

        const thumbnail =
            media.find(
                (m: any) => m.type === "IMAGE"
            )?.url || "";

        // Transform agreement → portfolio project
        const portfolioProject = {
            title: agreement.title || "",

            brandName:
                agreement.creatorEmail || "Brand Campaign",

            campaignType:
                "Brand Collaboration",

            thumbnail,

            description:
                agreement.description || "",

            link: "",

            duration: {
                start: agreement.createdAt
                    ? new Date(
                        agreement.createdAt
                    )
                        .toISOString()
                        .split("T")[0]
                    : "",

                end: agreement.updatedAt
                    ? new Date(
                        agreement.updatedAt
                    )
                        .toISOString()
                        .split("T")[0]
                    : "",
            },

            deliverables:
                agreement.deliverables?.map(
                    (d: any) => ({
                        title: d.title || "",
                        description:
                            d.description || "",
                    })
                ) || [],

            media,

            links,

            outcome: {
                summary:
                    agreement.portfolioSummary ||
                    agreement.description ||
                    "",

                metrics: [],
            },

            meta: {
                draft: false,

                featured: false,

                verifiedByBrand: true,

                importedFromAgreement: true,

                agreementId:
                    agreement._id.toString(),

                createdAt: new Date(),

                updatedAt: new Date(),
            },
        };

        profile.portfolio = [
            ...(profile.portfolio || []),
            portfolioProject,
        ];

        await profile.save();

        return NextResponse.redirect(
            new URL(
                "/creator/portfolio?import=success",
                req.url
            )
        );
    } catch (error) {
        console.error(error);

        return NextResponse.redirect(
            new URL(
                "/creator/portfolio?import=error",
                req.url
            )
        );
    }
}