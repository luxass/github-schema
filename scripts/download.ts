import {
  writeFile,
} from "node:fs/promises";
import process from "node:process";

async function run() {
  if (!process.env.GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN not set");
    process.exit(1);
  }

  const res = await fetch("https://api.github.com/graphql", {
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v4.idl",
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch schema");
    process.exit(1);
  }

  console.log("Fetched schema successfully");

  const schema = await res.json();
  if (!schema || typeof schema !== "object" || !("data" in schema) || typeof schema.data !== "string") {
    console.error("Failed to parse schema");
    process.exit(1);
  }

  await writeFile("github-schema.graphql", schema.data);
  console.log("Wrote schema to github-schema.graphql");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
