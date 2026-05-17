import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { Agreement } from "@/lib/db/models/Agreement";
import CreatorProfileView from "@/components/brand/CreatorProfileView";
import type { InferSchemaType } from "mongoose";
import { SavedCreator } from "@/lib/db/models/SavedCreator";
import { User } from "@/lib/db/models/User";
import { generateRecommendationInsight }
    from "@/lib/recommendation/generateRecommendationInsight";
import { scoreCreator }
    from "@/lib/recommendation/scoreCreator";
import { getCreatorPerformanceMetrics }
    from "@/lib/recommendation/getCreatorPerformanceMetrics";
import { generateAiRecommendationAnalysis } from "@/lib/recommendation/generateAiRecommendationAnalysis";

type CreatorType = InferSchemaType<typeof CreatorProfile.schema>;

type UserLean = {
    _id: any;
    email: string;
};

type CreatorLean = {
    displayName: string;
    userId: any;
    _id: any;
    username: string;
    niche: string;
    platforms: string;
    location?: string;
    bio?: string;
    profileImage?: string;
    skills?: {
        contentFormats?: string[];
        tools?: string[];
        languages?: string[];
        strengths?: string[];
    };
    portfolio?: {
        _id: any;
        title: string;
        description?: string;
        brandName?: string;
        thumbnail?: string;
        deliverables?: string[];
        links?: any[];
        media?: any[];
        outcome?: any;
    }[];
};

export default async function BrandViewCreatorPage({
    params,
}: {
    params: Promise<{ creatorId: string }>;
}) {

    const { creatorId } = await params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    const role = cookieStore.get("user_role")?.value;

    if (!userId || role !== "BRAND") {
        redirect("/auth/login");
    }

    await connectDB();

    const creator = await CreatorProfile
        .findById(creatorId)
        .lean<CreatorLean>()
        .exec();

    if (!creator) {
        redirect("/brand/creators");
    }

    const c = creator;

    const metrics =
        await getCreatorPerformanceMetrics(
            c.userId.toString()
        );

    const recommendation =
        scoreCreator({

            creator: {

                niche:
                    c.niche,

                platforms:
                    c.platforms,

                completionRate:
                    metrics.completionRate,

                avgRevisions:
                    metrics.avgRevisions,

                repeatBrandsPercent:
                    metrics.repeatBrandsPercent,

                profileCompletion: 100,

                portfolioCount:
                    c.portfolio?.length || 0,
            },

            campaign: {

                niche:
                    c.niche,

                platform:
                    c.platforms
                        ?.split(",")[0] || "",
            },
        });

    const recommendationInsight =
        await generateAiRecommendationAnalysis({

            creatorName:
                c.displayName ||
                "This creator",

            niche:
                c.niche,

            platforms:
                c.platforms,

            completionRate:
                metrics.completionRate,

            avgRevisions:
                metrics.avgRevisions,

            repeatBrandsPercent:
                metrics.repeatBrandsPercent,

            recommendationReasons:
                recommendation.reasons,
        });

    const alreadySaved = await SavedCreator.findOne({
        brandId: new mongoose.Types.ObjectId(userId),
        creatorId: new mongoose.Types.ObjectId(creatorId),
    }).lean();

    const draftAgreements = await Agreement.find({
        brandId: new mongoose.Types.ObjectId(userId),
        status: "DRAFT",
        creatorId: { $exists: false },
    }).lean();

    const creatorUser = await User.findById(c.userId).lean<UserLean>().exec();

    if (!creatorUser) redirect("/brand/creators");

    const safeCreator = {
        _id: c._id.toString(),
        displayName: c.displayName || c.username || "Creator",
        username: c.username,
        email: creatorUser.email,
        niche: c.niche,
        platforms: c.platforms,
        location: c.location ?? "",
        bio: c.bio ?? "",
        profileImage: c.profileImage ?? "",
        skills: c.skills ?? {},
        portfolio: (c.portfolio ?? []).map((p: any) => ({
            _id: p._id.toString(),
            title: p.title,
            description: p.description ?? "",
            brandName: p.brandName ?? "",
            thumbnail: p.thumbnail ?? "",
            deliverables: p.deliverables ?? [],
            links: p.links ?? [],
            media: p.media ?? [],
            outcome: p.outcome ?? {},
        })),
    };

    const safeDrafts = draftAgreements.map((a: any) => ({
        _id: a._id.toString(),
        title: a.title,
    }));


    return (
        <CreatorProfileView
            creator={safeCreator}
            draftAgreements={safeDrafts}
            alreadySaved={!!alreadySaved}

            recommendation={{
                score:
                    recommendation.score,

                insight:
                    recommendationInsight,

                reasons:
                    recommendation.reasons,

                metrics,
            }}
        />
    );
}