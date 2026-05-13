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
Generate a concise professional creator deliverable description.

${body.deliverableTitle}

IMPORTANT:
- Keep it concise
- 1-3 sentences
- Professional creator-brand tone
- Mention what the creator is expected to deliver
- No markdown
- Return plain text only
`;

        const response =
            await openai.chat.completions.create({
                model: "deepseek/deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content:
                            "You generate creator campaign deliverable descriptions.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });

        const content =
            response.choices[0].message.content || "";

        return NextResponse.json({
            description: content.trim(),
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error:
                    "Failed to generate deliverable description",
            },
            { status: 500 }
        );
    }
}