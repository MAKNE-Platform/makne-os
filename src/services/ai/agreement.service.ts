import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

type AgreementInput = {
    title: string;
};

export async function generateAgreement(
    data: AgreementInput
) {
    try {
        const prompt = `
You are an AI assistant helping brands create creator collaboration agreements.

Generate ONLY a short professional agreement description based on the title.

Agreement Title:
${data.title}

IMPORTANT:
- Keep it concise
- 2-4 sentences maximum
- Professional and modern tone
- Suitable for creator-brand collaborations
- No legal jargon
- Return ONLY valid JSON
- No markdown
- No explanations

Use this exact JSON structure:

{
  "summary": ""
}
`;

        console.log("Sending request to OpenRouter...");

        const response =
            await openai.chat.completions.create({
                model: "deepseek/deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an AI assistant generating creator-brand agreements.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });

        const content =
            response.choices[0].message.content || "{}";

        console.log("Raw Response:", content);

        const cleaned = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (error) {
        console.error("OpenRouter Error:", error);

        throw new Error("Failed to generate agreement");
    }
}