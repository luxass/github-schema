import { defineConfig } from "tsdown";

export default defineConfig(
  {
    entry: ["./src/index.ts", "./src/raw.ts", "./src/github-schema.ts"],
    format: ["cjs", "esm"],
    clean: true,
    dts: true,
    treeshake: true,
    exports: true,
    publint: true,
  },
);
