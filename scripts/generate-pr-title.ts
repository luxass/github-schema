/* eslint-disable node/prefer-global/process */
import { readFileSync } from "node:fs";

const SYSTEM_PROMPT = `You are an expert at analyzing code changes and generating concise, descriptive pull request titles.

Your task is to analyze the provided git diff and generate a clear, actionable PR title that describes what new feature, bug fix, or change has been implemented.

Guidelines:
- Use conventional commit format when appropriate (feat:, fix:, chore:, docs:, etc.)
- Be specific about what was added/changed/fixed
- Keep titles under 72 characters
- Focus on the user-facing impact or technical improvement
- Use present tense, imperative mood
- Don't include "PR" or "pull request" in the title

Examples of good titles:
- "feat: add user authentication with JWT tokens"
- "fix: resolve memory leak in data processing pipeline"
- "chore: update dependencies to latest versions"
- "docs: add API documentation for webhook endpoints"

Analyze the diff and respond with ONLY the PR title, no additional text or explanation.
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
      model: "openai/gpt-5",
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

  return data.choices[0].message.content.trim();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
