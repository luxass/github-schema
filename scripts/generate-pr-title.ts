/* eslint-disable node/prefer-global/process */
import { readFileSync, writeFileSync } from "node:fs";

const SYSTEM_PROMPT = `You are an expert at analyzing code changes and generating structured data for pull request titles.

Your task is to analyze the provided git diff and generate a JSON object with the following properties:
- type: The conventional commit type (feat, fix, chore, docs, style, refactor)
- scope: The scope of the change (e.g., component or section name). Use empty string if no specific scope.
- message: A concise description of the change, under 72 characters total for the full title.

Guidelines for the message:
- Be specific about what was added/changed/fixed
- Focus on the user-facing impact or technical improvement
- Use present tense, imperative mood
- Keep the full formatted title (type(scope): message) under 72 characters
- Do not use `graphql` or `schema`, and something similar. The scope needs to be a component such as `User`, `Repository` (if applicable) 

Examples:
- {"type": "feat", "scope": "auth", "message": "add user authentication with JWT tokens"}
- {"type": "fix", "scope": "", "message": "resolve memory leak in data processing pipeline"}
- {"type": "chore", "scope": "deps", "message": "update dependencies to latest versions"}
- {"type": "docs", "scope": "api", "message": "add API documentation for webhook endpoints"}

Analyze the diff and respond with ONLY a valid JSON object matching this schema, no additional text or explanation.
`;

async function run() {
  console.log("📖 Reading git diff from github-schema.diff...");
  const diff = readFileSync("github-schema.diff", "utf8");

  if (!diff.trim()) {
    console.error("❌ No changes detected in github-schema.diff");
    process.exit(1);
  }

  console.log("🤖 Generating PR title with GitHub Models API...");

  const response = await fetch("https://models.github.ai/inference/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Please analyze this git diff and generate an appropriate PR title:\n\n${diff}`,
        },
      ],
      model: "openai/gpt-4o",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "pr-title",
          strict: true,
          schema: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["feat", "fix", "chore", "docs", "style", "refactor"],
                description: "The type of change being made",
              },
              scope: {
                type: "string",
                description: "The optional scope of the change (e.g., component or section name). Can be empty string.",
              },
              message: {
                type: "string",
                description: "A concise description of the change, under 72 characters",
              },
            },
            additionalProperties: false,
            required: [
              "type",
              "scope",
              "message",
            ],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub Models API request failed: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data = await response.json() as {
    choices: {
      message: {
        content: string;
      };
    }[];
  };

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response received from GitHub Models API");
  }

  const content = data.choices[0].message.content.trim();
  const parsed = JSON.parse(content) as {
    type: string;
    scope: string;
    message: string;
  };

  const title = `${parsed.type}${parsed.scope ? `(${parsed.scope})` : ""}: ${parsed.message}`;

  // write to github_output
  if (process.env.GITHUB_OUTPUT) {
    console.log(`✅ Generated PR title: ${title}`);
    writeFileSync(process.env.GITHUB_OUTPUT, `title=${title}\n`);
  }

  return title;
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
