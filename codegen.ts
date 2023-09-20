import type { CodegenConfig } from "@graphql-codegen/cli";

const config = {
  schema: "./github-schema.graphql",
  overwrite: true,
  generates: {
    "github-schema.d.ts": {
      plugins: [
        "typescript",
      ],
      config: {
        enumsAsTypes: true,
        useImplementingTypes: true,
      },
    },
  },
} satisfies CodegenConfig;

export default config;
