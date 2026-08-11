/**
 * API Service layer for Sales Analytics.
 * Centralizes all HTTP calls to the backend.
 */

import type {
  HealthResponse,
  ReportRequest,
  SalesReport,
  UploadResponse,
} from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export const apiService = {
  /**
   * Check API health status.
   */
  async health(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse<HealthResponse>(response);
  },

  /**
   * Upload a CSV file to the backend.
   */
  async uploadCsv(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    return handleResponse<UploadResponse>(response);
  },

  /**
   * Get the sales report with optional filters.
   */
  async getReport(request: ReportRequest): Promise<SalesReport> {
    const params = new URLSearchParams();

    if (request.start_date) params.append("start_date", request.start_date);
    if (request.end_date) params.append("end_date", request.end_date);
    if (request.category) params.append("category", request.category);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/report${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);
    return handleResponse<SalesReport>(response);
  },
};
