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
Analyze this creator milestone submission against the expected milestone outcome.

Milestone:
${body.milestoneTitle}

Expected Outcome:
${body.aiExpectationSummary}

Submission Note:
${body.submissionNote || "No submission note provided"}

Submission Links:
${body.submissionLinks || "No links provided"}

IMPORTANT:
- Return ONLY valid JSON
- No markdown
- No explanations outside JSON

Use this structure:

{
  "summary": "",
  "completionStatus": "STRONG",
  "strengths": [],
  "concerns": [],
  "revisionSuggestion": ""
}

Rules:
- completionStatus must be one of:
  STRONG
  PARTIAL
  WEAK

- Be realistic and constructive
- Do not assume files were analyzed visually
- Focus on workflow completeness and submission quality
`;

    const response =
      await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You review creator milestone submissions for brands and provide professional workflow evaluation.",
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
        error: "Failed to review submission",
      },
      { status: 500 }
    );
  }
}