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
Analyze this creator-brand agreement.

Agreement Title:
${body.title}

Description:
${body.description}

Deliverables:
${body.deliverables}

Policies:
${body.policies}

Milestones:
${body.milestones}

IMPORTANT:
- Return ONLY valid JSON
- No markdown
- No explanations outside JSON

Use this structure:

{
  "summary": "",
  "risks": [],
  "suggestions": []
}
`;

    const response =
      await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You review creator-brand agreements and identify risks, clarity issues, and improvement suggestions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const content =
      response.choices[0].message.content || "{}";

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json(
      JSON.parse(cleaned)
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to review agreement",
      },
      { status: 500 }
    );
  }
}