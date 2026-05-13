import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateDeliverables(
  title: string
) {
  try {
    const prompt = `
You are helping generate creator-brand campaign deliverables.

Based on the agreement title, generate realistic creator deliverables.

Agreement Title:
${title}

IMPORTANT:
- Return ONLY valid JSON
- No markdown
- No explanations
- Maximum 3 deliverables
- Keep descriptions concise and professional

Use this exact structure:

{
  "deliverables": [
    {
      "title": "",
      "description": ""
    }
  ]
}
`;

    const response =
      await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You generate creator campaign deliverables.",
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

    return JSON.parse(cleaned);
  } catch (error) {
    console.error(error);
    throw new Error(
      "Failed to generate deliverables"
    );
  }
}