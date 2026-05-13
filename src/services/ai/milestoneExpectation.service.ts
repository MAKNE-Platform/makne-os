import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

type GenerateMilestoneExpectationParams = {
  agreementTitle: string;
  agreementDescription?: string;
  milestoneTitle: string;
  deliverables: string[];
};

export async function generateMilestoneExpectation({
  agreementTitle,
  agreementDescription,
  milestoneTitle,
  deliverables,
}: GenerateMilestoneExpectationParams) {
  try {
    const prompt = `
Generate an internal AI expectation summary for a creator-brand collaboration milestone.

Agreement Title:
${agreementTitle}

Agreement Description:
${agreementDescription || "N/A"}

Milestone:
${milestoneTitle}

Mapped Deliverables:
${deliverables.join(", ")}

IMPORTANT:
- Return ONLY the expectation summary
- No markdown
- No headings
- Keep it concise
- 2-4 sentences
- Describe what successful creator submission should generally contain
- Mention professionalism, completeness, and expected deliverable quality
`;

    const response =
      await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You generate internal AI workflow expectation summaries for creator collaboration milestones.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    return (
      response.choices[0].message.content?.trim() ||
      ""
    );
  } catch (error) {
    console.error(
      "Milestone expectation AI error:",
      error
    );

    return "";
  }
}