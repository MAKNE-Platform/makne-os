import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const prompt = `
You are helping a content creator understand revision feedback from a brand.

Your job is NOT to give generic advice.

Your job is to explain:
- what specifically needs improvement
- what the creator should change before resubmitting

Milestone:
${body.milestoneTitle}

Expected Deliverable:
${body.aiExpectationSummary}

Creator Submission Note:
${body.submissionNote}

Brand Revision Feedback:
${body.feedback}

STRICT RULES:
- Do NOT give business advice
- Do NOT explain project management concepts
- Do NOT tell the creator to define goals or clarify objectives
- Do NOT sound like a consultant
- ONLY explain the actual changes needed
- Keep it practical and execution-focused
- Assume the creator already understands the project
- Write like a creative lead giving actionable improvement notes
- Use short bullet points
- Maximum 5 bullet points
- No introduction
- No conclusion
- No markdown bold formatting

GOOD EXAMPLE:
• Make the product appear earlier in the reel
• Improve lighting during the close-up sequence
• Add the finalized campaign caption before resubmitting
• Ensure branding is visible in the final frame

BAD EXAMPLE:
- Define the project goals
- Clarify the milestone outcome
- Align with objectives

Return ONLY the actionable creator improvements.
`;

        const response =
            await openai.chat.completions.create({
                model: "deepseek/deepseek-chat",

                messages: [
                    {
                        role: "system",
                        content:
                            "You help creators understand brand revision feedback clearly.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });

        return NextResponse.json({
            result:
                response.choices[0].message.content?.trim() ||
                "",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error:
                    "Failed to interpret feedback",
            },
            { status: 500 }
        );
    }
}