/**
 * Custom React hooks for sales analytics functionality.
 */

import { useState } from "react";

import type { ReportRequest, SalesReport } from "../types/api";
import { apiService } from "../services/apiService";

interface UseUploadResult {
  uploading: boolean;
  error: string | null;
  recordsCount: number | null;
  upload: (file: File) => Promise<void>;
  reset: () => void;
}

export function useUpload(): UseUploadResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordsCount, setRecordsCount] = useState<number | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const response = await apiService.uploadCsv(file);

      if (response.status === "error") {
        throw new Error(response.message || "Upload failed");
      }

      setRecordsCount(response.records_count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setError(null);
    setRecordsCount(null);
  };

  return { uploading, error, recordsCount, upload, reset };
}

interface UseReportResult {
  report: SalesReport | null;
  loading: boolean;
  error: string | null;
  fetchReport: (request: ReportRequest) => Promise<void>;
  reset: () => void;
}

export function useReport(): UseReportResult {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (request: ReportRequest) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getReport(request);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setReport(null);
    setError(null);
  };

  return { report, loading, error, fetchReport, reset };
}
