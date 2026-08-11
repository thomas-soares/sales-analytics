import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/components/**/*.tsx", "src/hooks/**/*.ts", "src/services/**/*.ts", "src/utils/**/*.ts"],
      exclude: [
        "src/**/index.ts",
        "src/components/ErrorNotification.tsx",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
      ],
      thresholds: {
        statements: 90,
        branches: 70,
        functions: 80,
        lines: 90,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
