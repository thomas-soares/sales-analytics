/**
 * Tests for the API service layer.
 */

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import type { HealthResponse, SalesReport, UploadResponse } from "../types/api";
import { apiService } from "../services/apiService";

// Mock global fetch
global.fetch = vi.fn();

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("health", () => {
    it("should fetch and return health status", async () => {
      const mockResponse: HealthResponse = { status: "ok" };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.health();

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:8000/health");
    });
  });

  describe("uploadCsv", () => {
    it("should upload file and return response with records count", async () => {
      const mockFile = new File(["data"], "test.csv", { type: "text/csv" });
      const mockResponse: UploadResponse = {
        status: "success",
        records_count: 3,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.uploadCsv(mockFile);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8000/upload",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
    });
  });

  describe("getReport", () => {
    it("should fetch report without filters", async () => {
      const mockReport: SalesReport = {
        product_totals: [],
        category_totals: [],
        total_value: "0.00",
        most_sold_product: {
          product: "",
          total_quantity: 0,
          total_value: "0.00",
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await apiService.getReport({});

      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:8000/report");
    });

    it("should fetch report with date filters", async () => {
      const mockReport: SalesReport = {
        product_totals: [],
        category_totals: [],
        total_value: "0.00",
        most_sold_product: {
          product: "",
          total_quantity: 0,
          total_value: "0.00",
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await apiService.getReport({
        start_date: "2024-01-01",
        end_date: "2024-01-31",
      });

      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8000/report?start_date=2024-01-01&end_date=2024-01-31",
      );
    });

    it("should fetch report with category filter", async () => {
      const mockReport: SalesReport = {
        product_totals: [],
        category_totals: [],
        total_value: "0.00",
        most_sold_product: {
          product: "",
          total_quantity: 0,
          total_value: "0.00",
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await apiService.getReport({ category: "Clothing" });

      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8000/report?category=Clothing",
      );
    });
  });
});
