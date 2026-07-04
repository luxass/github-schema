import { writeFile } from "node:fs/promises";
import process from "node:process";

async function run() {
  const token = process.env.GITHUB_TOKEN;
  if (token == null || token === "") {
    console.error("GITHUB_TOKEN not set");
    process.exit(1);
  }

  const res = await fetch("https://api.github.com/graphql", {
    headers: {
      Authorization: `bearer ${token}`,
      Accept: "application/vnd.github.v4.idl",
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch schema");
    process.exit(1);
  }

  console.log("Fetched schema successfully");

  const schema: unknown = await res.json();
  if (
    schema == null ||
    typeof schema !== "object" ||
    !("data" in schema) ||
    typeof (schema as Record<string, unknown>).data !== "string"
  ) {
    console.error("Failed to parse schema");
    process.exit(1);
  }

  await writeFile("github-schema.graphql", (schema as { data: string }).data);
  console.log("Wrote schema to github-schema.graphql");
}

try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
