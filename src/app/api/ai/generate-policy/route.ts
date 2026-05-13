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
Generate ONLY the actual policy content for a creator-brand agreement.

Policy Type:
${body.policyType}

Agreement Context:
Title: ${body.agreementTitle}

Description:
${body.agreementDescription}

Deliverables:
${body.deliverables}

IMPORTANT:
- Return ONLY the policy text
- Do NOT include headings
- Do NOT repeat the agreement title
- Do NOT repeat deliverables
- Do NOT use markdown
- Do NOT add labels like "Payment Terms:"
- Keep it concise and professional
- 2-5 sentences maximum
`;

        const response =
            await openai.chat.completions.create({
                model: "deepseek/deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content:
                            "You generate creator-brand agreement policies.",
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
            content: content.trim(),
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Failed to generate policy",
            },
            { status: 500 }
        );
    }
}