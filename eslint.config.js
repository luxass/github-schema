// @ts-check
import luxass from "@luxass/eslint-config";

export default luxass({
  type: "lib",
}, {
  ignores: [
    "github-schema.graphql",
    "./src/github-schema.ts",
  ],
});
