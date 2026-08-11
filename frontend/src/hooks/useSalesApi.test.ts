/**
 * Tests for custom React hooks.
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { useUpload, useReport } from "../hooks/useSalesApi";

// Mock the API service
vi.mock("../services/apiService", () => ({
  apiService: {
    uploadCsv: vi.fn(),
    getReport: vi.fn(),
  },
}));

describe("useUpload Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useUpload());

    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.recordsCount).toBeNull();
  });

  it("should handle successful upload", async () => {
    const { apiService } = await import("../services/apiService");
    vi.mocked(apiService.uploadCsv).mockResolvedValueOnce({
      status: "success",
      records_count: 5,
    });

    const { result } = renderHook(() => useUpload());
    const file = new File(["data"], "test.csv", { type: "text/csv" });

    await act(async () => {
      await result.current.upload(file);
    });

    expect(result.current.recordsCount).toBe(5);
    expect(result.current.error).toBeNull();
  });

  it("should handle upload error", async () => {
    const { apiService } = await import("../services/apiService");
    vi.mocked(apiService.uploadCsv).mockResolvedValueOnce({
      status: "error",
      message: "Invalid CSV",
    });

    const { result } = renderHook(() => useUpload());
    const file = new File(["data"], "test.csv", { type: "text/csv" });

    await act(async () => {
      await expect(result.current.upload(file)).rejects.toThrow("Invalid CSV");
    });

    expect(result.current.error).toBe("Invalid CSV");
  });

  it("should reset state", async () => {
    const { apiService } = await import("../services/apiService");
    vi.mocked(apiService.uploadCsv).mockResolvedValueOnce({
      status: "success",
      records_count: 5,
    });

    const { result } = renderHook(() => useUpload());
    const file = new File(["data"], "test.csv", { type: "text/csv" });

    await act(async () => {
      await result.current.upload(file);
    });

    expect(result.current.recordsCount).toBe(5);

    act(() => {
      result.current.reset();
    });

    expect(result.current.recordsCount).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

describe("useReport Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useReport());

    expect(result.current.report).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should fetch report successfully", async () => {
    const { apiService } = await import("../services/apiService");
    const mockReport = {
      product_totals: [],
      category_totals: [],
      total_value: "0.00",
      most_sold_product: {
        product: "",
        total_quantity: 0,
        total_value: "0.00",
      },
    };
    vi.mocked(apiService.getReport).mockResolvedValueOnce(mockReport);

    const { result } = renderHook(() => useReport());

    await act(async () => {
      await result.current.fetchReport({});
    });

    expect(result.current.report).toEqual(mockReport);
    expect(result.current.error).toBeNull();
  });

  it("should handle report fetch error", async () => {
    const { apiService } = await import("../services/apiService");
    vi.mocked(apiService.getReport).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useReport());

    await act(async () => {
      await result.current.fetchReport({});
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.report).toBeNull();
  });

  it("should reset state", async () => {
    const { apiService } = await import("../services/apiService");
    const mockReport = {
      product_totals: [],
      category_totals: [],
      total_value: "0.00",
      most_sold_product: {
        product: "",
        total_quantity: 0,
        total_value: "0.00",
      },
    };
    vi.mocked(apiService.getReport).mockResolvedValueOnce(mockReport);

    const { result } = renderHook(() => useReport());

    await act(async () => {
      await result.current.fetchReport({});
    });

    expect(result.current.report).toBeTruthy();

    act(() => {
      result.current.reset();
    });

    expect(result.current.report).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
