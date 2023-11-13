import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { StorybookConfig } from "@storybook/react-vite";

export default {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()],
      define: {
        "process.env": {},
      },
    });
  },
} satisfies StorybookConfig;
