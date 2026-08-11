import { vi } from "vitest";

if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = vi.fn(() => "blob:mock-url");
}

if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = vi.fn();
}

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
