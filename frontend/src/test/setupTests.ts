import { vi } from "vitest";

const originalConsoleError = console.error;

vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
  const firstArg = args[0];

  if (
    firstArg instanceof Error &&
    firstArg.message === "Could not parse CSS stylesheet"
  ) {
    return;
  }

  originalConsoleError(...args);
});
