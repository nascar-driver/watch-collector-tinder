import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // react enables JSX (used once we add component tests in Phase 2).
  plugins: [react()],
  // Resolve the `@/*` tsconfig path alias natively (no plugin needed).
  resolve: { tsconfigPaths: true },
  test: {
    // Pure-logic tests need no DOM yet. Switch to "jsdom" in Phase 2 for components.
    environment: "node",
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
  },
});
