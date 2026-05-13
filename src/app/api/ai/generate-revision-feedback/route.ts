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
Generate a professional creator revision request for a milestone submission.

Milestone:
${body.milestoneTitle}

Expected Outcome:
${body.aiExpectationSummary}

Submission Note:
${body.submissionNote || "No submission note"}

AI Review Summary:
${body.reviewSummary || "N/A"}

AI Concerns:
${body.concerns?.join(", ") || "None"}

IMPORTANT:
- Return ONLY the revision feedback text
- No markdown
- No headings
- Keep it professional and constructive
- Keep it concise but actionable
- Sound human, not robotic
`;

    const response =
      await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",

        messages: [
          {
            role: "system",
            content:
              "You help brands write professional creator revision requests.",
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
      feedback: content.trim(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to generate revision feedback",
      },
      { status: 500 }
    );
  }
}