import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

type GeneratePortfolioSummaryParams = {
  agreementTitle: string;

  agreementDescription?: string;

  deliverables?: {
    title: string;
    description?: string;
  }[];
};

export async function generatePortfolioSummary({
  agreementTitle,
  agreementDescription,
  deliverables,
}: GeneratePortfolioSummaryParams) {
  try {
    const prompt = `
Generate a concise creator portfolio campaign summary.

Campaign:
${agreementTitle}

Campaign Description:
${agreementDescription || "N/A"}

Deliverables:
${deliverables
  ?.map(
    (d) =>
      `- ${d.title}: ${d.description || ""}`
  )
  .join("\n")}

IMPORTANT:
- Return ONLY the summary
- No markdown
- Write in portfolio/case-study style
- Keep it concise
- Sound professional and creator-focused
- Focus on campaign execution and deliverables
`;

    const response =
      await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",

        messages: [
          {
            role: "system",
            content:
              "You generate creator portfolio campaign summaries.",
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
    console.error(error);

    return "";
  }
}