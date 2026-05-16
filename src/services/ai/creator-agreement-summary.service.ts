import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

type Params = {
  title: string;

  description?: string;

  deliverables?: {
    title: string;
    description?: string;
  }[];

  policies?: {
    paymentTerms?: string;
    cancellationPolicy?: string;
    revisionPolicy?: string;
    usageRights?: string;
  };
};

type AiTask = {
  title: string;

  type:
  | "DELIVERABLE"
  | "MILESTONE"
  | "POLICY"
  | "SUBMISSION"
  | "GENERAL";
};

type Result = {
  summary: string;
  tasks: AiTask[];
};

export async function generateCreatorAgreementSummary({
  title,
  description,
  deliverables,
  policies,
}: Params): Promise<Result> {

  try {

    const prompt = `
Help a creator understand a collaboration agreement clearly.

Agreement Title:
${title}

Agreement Description:
${description || "N/A"}

Deliverables:
${deliverables
        ?.map(
          (d) =>
            `- ${d.title}: ${d.description || ""}`
        )
        .join("\n")}

Policies:

Payment Terms:
${policies?.paymentTerms || "N/A"}

Cancellation Policy:
${policies?.cancellationPolicy || "N/A"}

Revision Policy:
${policies?.revisionPolicy || "N/A"}

Usage Rights:
${policies?.usageRights || "N/A"}

IMPORTANT TASK RULES:

- Every task must clearly reference the campaign or deliverable context
- Tasks should immediately make sense even if creators have multiple active campaigns
- Avoid vague tasks like "Submit content"
- Instead write contextual tasks like:
  "Submit Instagram Reel for Product X launch campaign"

- Avoid internal/legal terminology creators may not understand
- Never mention invoices
- Never mention legal jargon
- Keep tasks creator-friendly and execution-focused

Never use financial/legal business terminology like:
- invoice
- indemnity
- liability
- reimbursement

Instead explain things in simple creator-friendly language.

Structure the summary in this style:

Campaign Understanding:
...

What You Need To Deliver:
...

Important Things To Watch:
...

Execution Advice:
...

Submission Checklist:
...

Also generate a concise creator task list based on the agreement.

Return tasks creators must complete to successfully execute the collaboration.

Tasks should:
- be short
- actionable
- execution-focused
- realistic
`;

    const response =
      await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",

        temperature: 0.4,

        messages: [
          {
            role: "system",
            content:
              "You are an expert creator collaboration assistant helping creators understand agreements, deliverables, risks, and execution expectations. Always return valid JSON only.",
          },

          {
            role: "user",
            content: `
${prompt}

Return response ONLY in this exact JSON format:

{
  "summary": "string",
  "tasks": [
    {
      "title": "string",
      "type": "DELIVERABLE"
    }
  ]
}
`,
          },
        ],
      });



    const raw =
      response.choices[0].message.content || "{}";

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    // NORMALIZE SUMMARY
    let summary = "";

    if (typeof parsed.summary === "string") {

      summary = parsed.summary;

    } else if (
      parsed.summary &&
      typeof parsed.summary === "object"
    ) {

      summary = Object.entries(parsed.summary)
        .map(
          ([key, value]) =>
            `${key}:\n${value}`
        )
        .join("\n\n");

    }

    // NORMALIZE TASKS
    const tasks = Array.isArray(parsed.tasks)
      ? parsed.tasks.map((task: any) => ({
        title:
          task.title || "Untitled Task",

        type:
          task.type || "GENERAL",

        completed: false,
      }))
      : [];

    return {
      summary,
      tasks,
    };

  } catch (error) {

    console.error(
      "Creator agreement AI error:",
      error
    );

    return {
      summary: "",
      tasks: [],
    };
  }
}