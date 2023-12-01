// @ts-check
import {
  luxass,
} from "@luxass/eslint-config";

export default await luxass({
  react: true,
  nextjs: {
    rootDir: "www",
  },
  tailwindcss: {
    config: "tailwind.config.js",
  },
});
