import OpenAI from "openai";

const openai = new OpenAI({
    baseURL:
        "https://openrouter.ai/api/v1",

    apiKey:
        process.env.OPENROUTER_API_KEY,
});

type Params = {

    creatorName: string;

    niche?: string;

    platforms?: string;

    bio?: string;

    portfolioTitles?: string[];

    completionRate?: number;

    avgRevisions?: number;

    repeatBrandsPercent?: number;

    avgTurnaround?: number;

    recommendationReasons?: string[];

    brandIndustry?: string;
};

export async function generateAiRecommendationAnalysis({
    creatorName,
    niche,
    platforms,
    bio,
    portfolioTitles,
    completionRate,
    avgRevisions,
    repeatBrandsPercent,
    avgTurnaround,
    recommendationReasons,
    brandIndustry,
}: Params) {

    try {

        const prompt = `
You are an expert creator-brand strategist helping brands evaluate creators for collaborations.

Analyze this creator professionally and provide a high-quality recommendation analysis.

CREATOR INFORMATION:

Name:
${creatorName}

Niche:
${niche || "N/A"}

Platforms:
${platforms || "N/A"}

Bio:
${bio || "N/A"}

Portfolio Projects:
${portfolioTitles?.join(", ") || "N/A"}

PERFORMANCE METRICS:

Completion Rate:
${completionRate || 0}%

Average Revisions:
${avgRevisions || 0}

Repeat Brand Collaborations:
${repeatBrandsPercent || 0}%

Average Turnaround:
${avgTurnaround || 0} days

SYSTEM RECOMMENDATION SIGNALS:
${recommendationReasons?.join(", ") || "N/A"}

TARGET BRAND INDUSTRY:
${brandIndustry || "General"}

IMPORTANT RULES:

Your job is to help brands quickly decide whether this creator is a good collaboration fit.

The response must feel simple, practical, and easy to understand.

Focus ONLY on:
1. campaign fit
2. reliability
3. best collaboration use cases

Keep the analysis concise and highly readable.

Maximum 3 short sentences.

Do NOT sound like a consultant or strategist.

Do NOT use complex wording.

Do NOT over-explain metrics.

Do NOT repeat numbers unless necessary.

Avoid generic praise.

Write like an internal hiring recommendation for a busy brand manager.

Good example style:

Strong fit for beauty and lifestyle campaigns. Reliable delivery history with low revision frequency. Best suited for Instagram-first product campaigns and short-form creator content.

Bad example style:

This creator demonstrates a compelling blend of operational consistency and aesthetically aligned storytelling capabilities...

The response should feel premium, strategic, and trustworthy.
`;

        const response =
            await openai.chat.completions.create({

                model:
                    "deepseek/deepseek-chat",

                temperature: 0.2,

                messages: [

                    {
                        role: "system",

                        content:
                            "You are an elite creator partnership strategist helping brands identify ideal creators for collaborations.",
                    },

                    {
                        role: "user",

                        content: prompt,
                    },
                ],
            });

        return (
            response.choices[0]
                .message.content
                ?.replace(/#/g, "")
                .replace(/\*\*/g, "")
                .trim() || ""
        );

    } catch (error) {

        console.error(
            "AI recommendation analysis error:",
            error
        );

        return "";
    }
}