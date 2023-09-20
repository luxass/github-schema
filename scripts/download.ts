#!/usr/bin/env bun
import process from "node:process";

async function run() {
  if (!Bun.env.GITHUB_TOKEN) {
    console.log("GITHUB_TOKEN not set");
    process.exit(1);
  }

  const res = await fetch("https://api.github.com/graphql", {
    headers: {
      Authorization: `bearer ${Bun.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v4.idl",
    },
  });

  if (!res.ok) {
    console.log("Failed to fetch schema");
    process.exit(1);
  }

  const schema = await res.json();
  await Bun.write("github-schema.graphql", schema.data);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
