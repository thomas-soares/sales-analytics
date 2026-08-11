/**
 * Tests for formatting utilities.
 */

import { describe, expect, it } from "vitest";

import {
  formatCurrency,
  formatDate,
  formatQuantity,
  parseBrDate,
} from "../utils/formatting";

describe("Formatting Utils", () => {
  describe("formatCurrency", () => {
    it("should format string value as BRL currency", () => {
      const result = formatCurrency("49.90");
      expect(result).toBe("R$ 49,90");
    });

    it("should format number value as BRL currency", () => {
      const result = formatCurrency(199.9);
      expect(result).toBe("R$ 199,90");
    });

    it("should format zero correctly", () => {
      const result = formatCurrency("0.00");
      expect(result).toBe("R$ 0,00");
    });

    it("should handle large values", () => {
      const result = formatCurrency("1299.99");
      expect(result).toBe("R$ 1.299,99");
    });
  });

  describe("formatDate", () => {
    it("should format ISO date to Brazilian format", () => {
      const result = formatDate("2024-01-15");
      expect(result).toBe("15/01/2024");
    });

    it("should handle different months", () => {
      const result = formatDate("2024-12-25");
      expect(result).toBe("25/12/2024");
    });
  });

  describe("formatQuantity", () => {
    it("should format quantity as localized number", () => {
      const result = formatQuantity(1234);
      expect(result).toBe("1.234");
    });

    it("should handle single digits", () => {
      const result = formatQuantity(5);
      expect(result).toBe("5");
    });
  });

  describe("parseBrDate", () => {
    it("should parse Brazilian date format correctly", () => {
      const result = parseBrDate("15/01/2024");
      expect(result).toBe("2024-01-15");
    });

    it("should return null for invalid format", () => {
      const result = parseBrDate("invalid");
      expect(result).toBeNull();
    });

    it("should handle December dates", () => {
      const result = parseBrDate("25/12/2024");
      expect(result).toBe("2024-12-25");
    });
  });
});
