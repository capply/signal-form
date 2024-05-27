import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["lib/index.ts", "lib/remix.tsx"],
  dts: true,
});
