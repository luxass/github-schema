#!/usr/bin/env bun
import process from "node:process";

async function run() {
  if (!Bun.env.GITHUB_TOKEN) {
    console.log("GITHUB_TOKEN not set");
    process.exit(1);
  }

  const pkgJSONFile = Bun.file("package.json");

  const pkgJSON: unknown = await pkgJSONFile.json();

  if (typeof pkgJSON !== "object" || pkgJSON === null) {
    console.log("Failed to parse package.json");
    process.exit(1);
  }

  if (!("version" in pkgJSON)) {
    console.log("package.json missing version");
    process.exit(1);
  }

  if (typeof pkgJSON.version !== "string") {
    console.log("package.json version is not a string");
    process.exit(1);
  }

  const version = pkgJSON.version;

  // increment the patch version
  const [major, minor, patch] = version.split(".").map((n) => Number.parseInt(n, 10));
  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    console.log("Failed to parse package.json version");
    process.exit(1);
  }

  const newVersion = `${major}.${minor}.${(patch || 0) + 1}`;

  pkgJSON.version = newVersion;

  await Bun.write("package.json", `${JSON.stringify(pkgJSON, null, 2)}\n`);
  console.log(newVersion);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
