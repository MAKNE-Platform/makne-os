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
Improve this creator milestone submission note.

Original Note:
${body.note}

IMPORTANT:
- Return ONLY the improved note
- No markdown
- Keep it concise
- Keep it professional
- Sound natural and human
- Improve clarity and presentation quality
`;

    const response =
      await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",

        messages: [
          {
            role: "system",
            content:
              "You help creators write polished professional milestone submission notes.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    return NextResponse.json({
      note:
        response.choices[0].message.content?.trim() ||
        body.note,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to improve submission note",
      },
      { status: 500 }
    );
  }
}